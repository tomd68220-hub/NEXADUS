'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookingCalendar, type CalendarBooking } from '@/components/booking/BookingCalendar';
import { NewBookingForm, type NewBookingData } from '@/components/booking/NewBookingForm';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import type { SpaceType, BookingStatus } from '@/types';
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

export default function AdminBookingsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const [spaceFilter, setSpaceFilter] = useState<SpaceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  const [showNewForm, setShowNewForm] = useState(false);
  const [newFormDate, setNewFormDate] = useState<string | undefined>();
  const [newFormHour, setNewFormHour] = useState<number | undefined>();
  const [detailBooking, setDetailBooking] = useState<CalendarBooking | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (spaceFilter !== 'all') params.set('space', spaceFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (res.ok) {
        const json = await res.json();
        setBookings(json.bookings || []);
      }
    } finally {
      setLoading(false);
    }
  }, [spaceFilter, statusFilter]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      addToast(`Booking ${status}.`, 'info');
      if (detailBooking?.id === id) {
        setDetailBooking(prev => prev ? { ...prev, status: status as BookingStatus } : null);
      }
      await loadBookings();
    } else {
      addToast('Failed to update booking.', 'error');
    }
  }

  async function handleSaveNotes() {
    if (!detailBooking) return;
    setSavingNotes(true);
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: detailBooking.id, internal_notes: editNotes }),
    });
    setSavingNotes(false);
    if (res.ok) { addToast('Notes saved.', 'success'); await loadBookings(); }
    else addToast('Failed to save notes.', 'error');
  }

  async function handleCreateBooking(data: NewBookingData) {
    const res = await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      addToast('Booking created.', 'success');
      setShowNewForm(false);
      await loadBookings();
    } else {
      const json = await res.json();
      addToast(json.error || 'Failed to create booking.', 'error');
    }
  }

  function openDetail(b: CalendarBooking) {
    setDetailBooking(b);
    setEditNotes((b as unknown as { internal_notes?: string }).internal_notes ?? '');
  }

  const filtered = bookings.filter(b => {
    if (spaceFilter !== 'all' && b.space_type !== spaceFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--light)',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 600,
    padding: '10px 14px',
    outline: 'none',
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  };

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
        <Modal title="Create Booking" onClose={() => setShowNewForm(false)}>
          <NewBookingForm
            initialDate={newFormDate}
            initialHour={newFormHour}
            onSubmit={handleCreateBooking}
            onClose={() => setShowNewForm(false)}
            mode="admin"
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
              { label: 'Total (inc. VAT)', value: formatCurrency(detailBooking.total_inc_vat) },
              { label: 'Source', value: detailBooking.booking_source ?? 'client' },
              { label: 'Status', value: detailBooking.status },
              detailBooking.profiles
                ? { label: 'Member', value: `${detailBooking.profiles.first_name} ${detailBooking.profiles.last_name}` }
                : null,
              detailBooking.profiles
                ? { label: 'Email', value: detailBooking.profiles.email }
                : null,
              detailBooking.client_name ? { label: 'Client', value: detailBooking.client_name } : null,
              detailBooking.client_email ? { label: 'Client Email', value: detailBooking.client_email } : null,
            ].filter(Boolean).map(row => row && (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--grey)', fontWeight: 300, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--light)', fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Internal notes */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '6px' }}>
              Internal Notes
            </label>
            <textarea
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--light)', fontFamily: 'Raleway, sans-serif', fontWeight: 300, padding: '10px 14px', outline: 'none', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }}
              placeholder="Admin notes..."
            />
            <button onClick={handleSaveNotes} disabled={savingNotes} className="btn-secondary" style={{ marginTop: '8px', padding: '8px 16px', fontSize: '0.62rem' }}>
              {savingNotes ? 'Saving…' : 'Save Notes'}
            </button>
          </div>

          {/* Status actions */}
          {detailBooking.status !== 'cancelled' && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {detailBooking.status === 'upcoming' && (
                <button onClick={() => handleStatusChange(detailBooking.id, 'confirmed')} className="btn-primary" style={{ fontSize: '0.7rem', padding: '10px 16px' }}>
                  Confirm →
                </button>
              )}
              {(detailBooking.status === 'upcoming' || detailBooking.status === 'confirmed') && (
                <button onClick={() => handleStatusChange(detailBooking.id, 'completed')} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '10px 16px' }}>
                  Mark Completed
                </button>
              )}
              <button
                onClick={() => handleStatusChange(detailBooking.id, 'cancelled')}
                className="btn-secondary"
                style={{ fontSize: '0.7rem', padding: '10px 16px', borderColor: 'rgba(255,100,100,0.3)', color: '#ff6b6b' }}
              >
                Cancel Booking
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div className="overline" style={{ marginBottom: '8px' }}>All Bookings</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 200, color: 'var(--white)' }}>
            Bookings <strong style={{ fontWeight: 600 }}>Management</strong>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button style={btnTab(viewMode === 'table')} onClick={() => setViewMode('table')}>Table</button>
            <button style={btnTab(viewMode === 'calendar')} onClick={() => setViewMode('calendar')}>Calendar</button>
          </div>
          <button
            onClick={() => { setNewFormDate(undefined); setNewFormHour(undefined); setShowNewForm(true); }}
            className="btn-primary"
            style={{ fontSize: '0.7rem' }}
          >
            + New Booking
          </button>
        </div>
      </div>

      {/* Filters — shown in table mode */}
      {viewMode === 'table' && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <select style={selectStyle} value={spaceFilter} onChange={e => setSpaceFilter(e.target.value as SpaceType | 'all')}>
            <option value="all">All Spaces</option>
            <option value="training_room">Training Room</option>
            <option value="hot_desk">Hot Desk</option>
            <option value="meeting_room">Meeting Room</option>
            <option value="studio">Studio</option>
          </select>
          <select style={selectStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value as BookingStatus | 'all')}>
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.72rem', color: 'var(--grey)' }}>
            {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--grey)', fontSize: '0.82rem' }}>Loading bookings…</div>
      ) : viewMode === 'calendar' ? (
        <BookingCalendar
          bookings={bookings}
          onBookingClick={openDetail}
          onSlotClick={(date, hour) => { setNewFormDate(date); setNewFormHour(hour); setShowNewForm(true); }}
          canCreate
        />
      ) : (
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Reference', 'Member / Client', 'Space', 'Date', 'Time', 'Source', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: 'var(--grey)', fontSize: '0.85rem', fontWeight: 300 }}>No bookings found.</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '13px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{b.reference}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--white)', whiteSpace: 'nowrap' }}>
                      {b.profiles ? `${b.profiles.first_name} ${b.profiles.last_name}` : b.client_name || '—'}
                    </div>
                    {b.profiles && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--grey)', fontWeight: 300 }}>{b.profiles.email}</div>
                    )}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '0.8rem', fontWeight: 300, color: 'var(--light)', whiteSpace: 'nowrap' }}>{SPACE_LABELS[b.space_type]}</td>
                  <td style={{ padding: '13px 16px', fontSize: '0.8rem', fontWeight: 300, color: 'var(--light)', whiteSpace: 'nowrap' }}>{b.booking_date}</td>
                  <td style={{ padding: '13px 16px', fontSize: '0.78rem', color: 'var(--grey)', whiteSpace: 'nowrap' }}>{b.start_time.slice(0,5)} – {b.end_time.slice(0,5)}</td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 6px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--grey)' }}>
                      {b.booking_source ?? 'client'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--light)', whiteSpace: 'nowrap' }}>{formatCurrency(b.total_inc_vat)}</td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLORS[b.status] ?? 'var(--grey)' }}>
                      ● {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openDetail(b)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--grey)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', whiteSpace: 'nowrap' }}>View</button>
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button onClick={() => handleStatusChange(b.id, 'cancelled')} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', whiteSpace: 'nowrap' }}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
