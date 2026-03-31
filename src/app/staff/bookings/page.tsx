'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookingCalendar, type CalendarBooking } from '@/components/booking/BookingCalendar';
import { NewBookingForm, type NewBookingData } from '@/components/booking/NewBookingForm';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import type { Booking, SpaceType, BookingStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

const SPACE_LABELS: Record<SpaceType, string> = {
  training_room: 'Training Room',
  hot_desk: 'Hot Desk',
  meeting_room: 'Meeting Room',
  studio: 'Studio',
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  upcoming: '#4a9eff',
  confirmed: '#c0db26',
  completed: 'var(--grey)',
  cancelled: '#ff6b6b',
};

type ViewMode = 'calendar' | 'table';

export default function StaffBookingsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFormInitialDate, setNewFormInitialDate] = useState<string | undefined>();
  const [newFormInitialHour, setNewFormInitialHour] = useState<number | undefined>();
  const [detailBooking, setDetailBooking] = useState<CalendarBooking | null>(null);

  // Table filter
  const [myOnly, setMyOnly] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/staff/bookings');
      if (res.ok) {
        const json = await res.json();
        setBookings(json.bookings || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function handleCreateBooking(data: NewBookingData) {
    const res = await fetch('/api/staff/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      addToast('Booking confirmed.', 'success');
      setShowNewForm(false);
      await loadBookings();
    } else {
      const json = await res.json();
      addToast(json.error || 'Failed to create booking.', 'error');
    }
  }

  async function handleCancelBooking(id: string) {
    if (!confirm('Cancel this booking?')) return;
    const res = await fetch('/api/staff/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'cancelled' }),
    });
    if (res.ok) {
      addToast('Booking cancelled.', 'info');
      setDetailBooking(null);
      await loadBookings();
    } else {
      addToast('Could not cancel booking.', 'error');
    }
  }

  function openSlotCreate(date: string, hour: number) {
    setNewFormInitialDate(date);
    setNewFormInitialHour(hour);
    setShowNewForm(true);
  }

  const tableBookings = myOnly
    ? bookings.filter(b => b.booking_source === 'staff' || b.booking_source === 'admin')
    : bookings;

  const btnTab = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    background: active ? 'var(--green)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${active ? 'var(--green)' : 'rgba(255,255,255,0.1)'}`,
    color: active ? 'var(--dark)' : 'var(--grey)',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'Raleway, sans-serif',
    transition: 'all 0.15s',
  });

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* New booking modal */}
      {showNewForm && (
        <Modal title="New Booking" onClose={() => setShowNewForm(false)}>
          <NewBookingForm
            initialDate={newFormInitialDate}
            initialHour={newFormInitialHour}
            onSubmit={handleCreateBooking}
            onClose={() => setShowNewForm(false)}
            mode="staff"
          />
        </Modal>
      )}

      {/* Booking detail modal */}
      {detailBooking && (
        <Modal title={`Booking — ${detailBooking.reference}`} onClose={() => setDetailBooking(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { label: 'Reference', value: detailBooking.reference },
              { label: 'Space', value: SPACE_LABELS[detailBooking.space_type] },
              { label: 'Date', value: detailBooking.booking_date },
              { label: 'Time', value: `${detailBooking.start_time.slice(0,5)} – ${detailBooking.end_time.slice(0,5)}` },
              { label: 'Total', value: formatCurrency(detailBooking.total_inc_vat) },
              { label: 'Source', value: detailBooking.booking_source ?? 'client' },
              { label: 'Status', value: detailBooking.status },
              detailBooking.profiles
                ? { label: 'Booked by', value: `${detailBooking.profiles.first_name} ${detailBooking.profiles.last_name} (${detailBooking.profiles.email})` }
                : null,
              detailBooking.client_name ? { label: 'Client', value: detailBooking.client_name } : null,
            ].filter(Boolean).map(row => row && (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--grey)', fontWeight: 300, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--light)', fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
          {(detailBooking.booking_source === 'staff') && detailBooking.status !== 'cancelled' && (
            <button
              onClick={() => handleCancelBooking(detailBooking.id)}
              className="btn-secondary"
              style={{ marginTop: '20px', borderColor: 'rgba(255,100,100,0.3)', color: '#ff6b6b' }}
            >
              Cancel This Booking
            </button>
          )}
        </Modal>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="overline" style={{ marginBottom: '8px' }}>All Rooms</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--white)' }}>
            Room <strong style={{ fontWeight: 600 }}>Calendar</strong>
          </h2>
          <p style={{ fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)', marginTop: '6px' }}>
            Click any empty slot to create an internal booking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button style={btnTab(viewMode === 'calendar')} onClick={() => setViewMode('calendar')}>Calendar</button>
            <button style={btnTab(viewMode === 'table')} onClick={() => setViewMode('table')}>Table</button>
          </div>
          <button
            onClick={() => { setNewFormInitialDate(undefined); setNewFormInitialHour(undefined); setShowNewForm(true); }}
            className="btn-primary"
            style={{ fontSize: '0.7rem' }}
          >
            + New Booking
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--grey)', fontSize: '0.82rem' }}>Loading bookings…</div>
      ) : viewMode === 'calendar' ? (
        <BookingCalendar
          bookings={bookings}
          onBookingClick={setDetailBooking}
          onSlotClick={openSlotCreate}
          canCreate
        />
      ) : (
        <>
          {/* Table filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
            <button
              style={btnTab(!myOnly)}
              onClick={() => setMyOnly(false)}
            >
              All Bookings
            </button>
            <button
              style={btnTab(myOnly)}
              onClick={() => setMyOnly(true)}
            >
              Staff Only
            </button>
            <span style={{ fontSize: '0.72rem', color: 'var(--grey)', marginLeft: '8px' }}>
              {tableBookings.length} booking{tableBookings.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Reference', 'Space', 'Date', 'Time', 'Booked By', 'Source', 'Total', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableBookings.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: 'var(--grey)', fontSize: '0.85rem' }}>No bookings found.</td></tr>
                ) : tableBookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{b.reference}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>{SPACE_LABELS[b.space_type]}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>{b.booking_date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--grey)', whiteSpace: 'nowrap' }}>{b.start_time.slice(0,5)} – {b.end_time.slice(0,5)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>
                      {b.profiles ? `${b.profiles.first_name} ${b.profiles.last_name}` : b.client_name || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--grey)' }}>
                        {b.booking_source ?? 'client'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--light)', whiteSpace: 'nowrap' }}>
                      {formatCurrency(b.total_inc_vat)}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLORS[b.status] ?? 'var(--grey)' }}>
                        ● {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => setDetailBooking(b)}
                        style={{ padding: '4px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--grey)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', whiteSpace: 'nowrap' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
