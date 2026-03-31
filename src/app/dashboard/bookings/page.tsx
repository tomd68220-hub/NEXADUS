'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { BookingCalendar, type CalendarBooking } from '@/components/booking/BookingCalendar';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import type { Booking, SpaceType, BookingStatus } from '@/types';

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

type ViewMode = 'table' | 'calendar';

export default function BookingsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [spaceFilter, setSpaceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailBooking, setDetailBooking] = useState<CalendarBooking | null>(null);

  const loadBookings = useCallback(async () => {
    if (!isSupabaseConfigured || !user) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const json = await res.json();
        setBookings(json.bookings || []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const filtered = bookings.filter(b => {
    if (spaceFilter !== 'all' && b.space_type !== spaceFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const calendarBookings: CalendarBooking[] = bookings.map(b => ({
    id: b.id,
    reference: b.reference,
    space_type: b.space_type,
    booking_date: b.booking_date,
    start_time: b.start_time,
    end_time: b.end_time,
    session_type: b.session_type,
    status: b.status,
    total_inc_vat: b.total_inc_vat,
    booking_source: b.booking_source,
  }));

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--light)',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 300,
    padding: '10px 14px',
    fontSize: '0.78rem',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    minWidth: '160px',
    outline: 'none',
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
    <div>
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
              { label: 'Status', value: detailBooking.status },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--grey)', fontWeight: 300 }}>{row.label}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--light)', fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <Link href="/book" className="btn-primary" style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}>
            Book Another Space →
          </Link>
        </Modal>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="overline" style={{ marginBottom: '8px' }}>Member Portal</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '-0.01em' }}>
            My Bookings
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button style={btnTab(viewMode === 'table')} onClick={() => setViewMode('table')}>List</button>
            <button style={btnTab(viewMode === 'calendar')} onClick={() => setViewMode('calendar')}>Calendar</button>
          </div>
          <Link href="/book" className="btn-primary" style={{ fontSize: '0.7rem', padding: '10px 18px' }}>
            + Book a Space
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--grey)', fontSize: '0.82rem' }}>Loading…</div>
      ) : viewMode === 'calendar' ? (
        <BookingCalendar
          bookings={calendarBookings}
          onBookingClick={setDetailBooking}
        />
      ) : (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>Space</label>
              <select value={spaceFilter} onChange={e => setSpaceFilter(e.target.value)} style={selectStyle}>
                <option value="all">All Spaces</option>
                <option value="training_room">Training Room</option>
                <option value="hot_desk">Hot Desk</option>
                <option value="meeting_room">Meeting Room</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {(spaceFilter !== 'all' || statusFilter !== 'all') && (
              <button
                className="btn-secondary"
                onClick={() => { setSpaceFilter('all'); setStatusFilter('all'); }}
                style={{ padding: '10px 14px', fontSize: '0.62rem', alignSelf: 'flex-end' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--light)' }}>
                {filtered.length} Booking{filtered.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                <p style={{ color: 'var(--grey)', fontSize: '0.88rem', marginBottom: '16px' }}>No bookings found</p>
                <Link href="/book" className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.7rem', padding: '12px 20px' }}>
                  Book a Space →
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Reference', 'Space', 'Date', 'Time', 'Total', 'Status', ''].map((col, i) => (
                        <th key={i} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)', whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{b.reference}</td>
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>{SPACE_LABELS[b.space_type]}</td>
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>
                          {new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--grey)', whiteSpace: 'nowrap' }}>
                          {b.start_time.slice(0,5)} – {b.end_time.slice(0,5)}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>
                          {formatCurrency(b.total_inc_vat)}
                        </td>
                        <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLORS[b.status] ?? 'var(--grey)' }}>
                            ● {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <button
                            onClick={() => setDetailBooking(b as unknown as CalendarBooking)}
                            style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--grey)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', whiteSpace: 'nowrap' }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
