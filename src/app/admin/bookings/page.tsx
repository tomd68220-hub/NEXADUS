'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import type { SpaceType, BookingStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AdminBooking {
  id: string;
  reference: string;
  member: string;
  email: string;
  space_type: SpaceType;
  booking_date: string;
  session: string;
  total_inc_vat: number;
  status: BookingStatus;
}

const MOCK_BOOKINGS: AdminBooking[] = [
  { id: '1', reference: 'GH-2025-A4KX', member: 'Sarah Johnson', email: 'sarah@company.com', space_type: 'training_room', booking_date: '2025-04-02', session: 'AM', total_inc_vat: 105, status: 'upcoming' },
  { id: '2', reference: 'GH-2025-B7MN', member: 'James Wright', email: 'james@freelance.co.uk', space_type: 'meeting_room', booking_date: '2025-04-01', session: '10:00–12:00', total_inc_vat: 30, status: 'upcoming' },
  { id: '3', reference: 'GH-2025-C2PQ', member: 'Tom Davis', email: 'tom@startupco.io', space_type: 'training_room', booking_date: '2025-03-28', session: 'Full Day', total_inc_vat: 185, status: 'completed' },
  { id: '4', reference: 'GH-2025-D9RS', member: 'Emma Clarke', email: 'emma@design.co.uk', space_type: 'meeting_room', booking_date: '2025-03-27', session: '14:00–16:00', total_inc_vat: 30, status: 'cancelled' },
];

const SPACE_LABELS: Record<SpaceType, string> = {
  training_room: 'Training Room',
  hot_desk: 'Hot Desk',
  meeting_room: 'Meeting Room',
  studio: 'Studio',
};

export default function AdminBookingsPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [bookings, setBookings] = useState<AdminBooking[]>(MOCK_BOOKINGS);
  const [spaceFilter, setSpaceFilter] = useState<SpaceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [detailBooking, setDetailBooking] = useState<AdminBooking | null>(null);

  const filtered = bookings.filter(b => {
    if (spaceFilter !== 'all' && b.space_type !== spaceFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  function cancelBooking(id: string) {
    if (!confirm('Cancel this booking?')) return;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    addToast('Booking cancelled.', 'info');
  }

  function resendInvoice(booking: AdminBooking) {
    addToast(`Invoice resent to ${booking.email}.`, 'success');
  }

  const selectStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--light)',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 600,
    padding: '10px 14px',
    outline: 'none',
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {detailBooking && (
        <Modal title={`Booking — ${detailBooking.reference}`} onClose={() => setDetailBooking(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Reference', value: detailBooking.reference },
              { label: 'Member', value: detailBooking.member },
              { label: 'Email', value: detailBooking.email },
              { label: 'Space', value: SPACE_LABELS[detailBooking.space_type] },
              { label: 'Date', value: detailBooking.booking_date },
              { label: 'Session', value: detailBooking.session },
              { label: 'Total (inc. VAT)', value: formatCurrency(detailBooking.total_inc_vat) },
              { label: 'Status', value: detailBooking.status },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--grey)', fontWeight: 300 }}>{row.label}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--light)', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
            <button onClick={() => { resendInvoice(detailBooking); setDetailBooking(null); }} className="btn-secondary" style={{ marginTop: '8px' }}>
              Resend Invoice
            </button>
          </div>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div className="overline" style={{ marginBottom: '8px' }}>All Bookings</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 200, color: 'var(--white)' }}>
            Bookings <strong style={{ fontWeight: 600 }}>Management</strong>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={selectStyle} value={spaceFilter} onChange={e => setSpaceFilter(e.target.value as SpaceType | 'all')}>
            <option value="all">All Spaces</option>
            <option value="training_room">Training Room</option>
            <option value="hot_desk">Hot Desk</option>
            <option value="meeting_room">Meeting Room</option>
          </select>
          <select style={selectStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value as BookingStatus | 'all')}>
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Reference', 'Member', 'Space', 'Date', 'Session', 'Total', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 18px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--grey)', fontSize: '0.85rem', fontWeight: 300 }}>No bookings found matching filters.</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.06em' }}>{b.reference}</td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--white)' }}>{b.member}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--grey)', fontWeight: 300 }}>{b.email}</div>
                </td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: 300, color: 'var(--light)' }}>{SPACE_LABELS[b.space_type]}</td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: 300, color: 'var(--light)' }}>{b.booking_date}</td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)' }}>{b.session}</td>
                <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--light)' }}>{formatCurrency(b.total_inc_vat)}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setDetailBooking(b)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--grey)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>View</button>
                    {b.status !== 'cancelled' && (
                      <button onClick={() => cancelBooking(b.id)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                    )}
                    <button onClick={() => resendInvoice(b)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--grey)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Invoice</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
