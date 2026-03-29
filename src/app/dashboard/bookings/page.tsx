'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import type { Booking, BookingStatus, SpaceType } from '@/types';

const SPACE_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Spaces', value: 'all' },
  { label: 'Training Room', value: 'training_room' },
  { label: 'Hot Desk', value: 'hot_desk' },
  { label: 'Meeting Room', value: 'meeting_room' },
  { label: 'Studio', value: 'studio' },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(start: string, end: string): string {
  const fmt = (t: string) => t.substring(0, 5);
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [spaceFilter, setSpaceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user!.id)
        .order('booking_date', { ascending: false });

      if (data) setBookings(data as Booking[]);
      setLoading(false);
    }
    load();
  }, [user]);

  useEffect(() => {
    let result = bookings;
    if (spaceFilter !== 'all') {
      result = result.filter(b => b.space_type === spaceFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }
    setFiltered(result);
  }, [bookings, spaceFilter, statusFilter]);

  function handleInvoice(booking: Booking) {
    if (booking.invoice_url) {
      window.open(booking.invoice_url, '_blank');
    }
  }

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
    minWidth: '180px',
    outline: 'none',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="overline" style={{ marginBottom: '8px' }}>Member Portal</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '-0.01em' }}>
          Booking History
        </h1>
      </div>

      {/* Filter Row */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px' }}>Space Type</label>
          <select
            value={spaceFilter}
            onChange={e => setSpaceFilter(e.target.value)}
            style={selectStyle}
          >
            {SPACE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px' }}>Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {(spaceFilter !== 'all' || statusFilter !== 'all') && (
          <div style={{ marginTop: '20px' }}>
            <button
              className="btn-secondary"
              onClick={() => { setSpaceFilter('all'); setStatusFilter('all'); }}
              style={{ padding: '10px 16px', fontSize: '0.68rem' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--dark2)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--light)' }}>
            {filtered.length} Booking{filtered.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {!loading && filtered.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--grey)', fontSize: '0.88rem', marginBottom: '16px' }}>
              No bookings found
            </p>
            <Link
              href="/book"
              className="btn-primary"
              style={{ display: 'inline-flex', fontSize: '0.7rem', padding: '12px 20px' }}
            >
              Book a Space →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Reference', 'Space', 'Date', 'Time', 'Total', 'Status', ''].map((col, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '12px 24px',
                        textAlign: i === 6 ? 'right' : 'left',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--grey)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking, i) => (
                  <tr
                    key={booking.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 24px', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {booking.reference}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--light)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                      {booking.space_type.replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>
                      {formatDate(booking.booking_date)}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--grey)', whiteSpace: 'nowrap' }}>
                      {formatTime(booking.start_time, booking.end_time)}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>
                      £{booking.total_inc_vat.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => handleInvoice(booking)}
                        disabled={!booking.invoice_url}
                        style={{
                          padding: '7px 14px',
                          fontSize: '0.64rem',
                          letterSpacing: '0.12em',
                          opacity: booking.invoice_url ? 1 : 0.35,
                          cursor: booking.invoice_url ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
