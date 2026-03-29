'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import type { Booking, PassBalance } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatSession(session: string): string {
  const map: Record<string, string> = {
    half_day_am: 'AM Half Day',
    half_day_pm: 'PM Half Day',
    full_day: 'Full Day',
    hourly: 'Hourly',
  };
  return map[session] || session;
}

function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;

    function tick() {
      const now = Date.now();
      const diff = targetDate!.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const QUICK_ACTIONS = [
  { label: 'Book a Room', href: '/book', desc: 'Reserve a training room, meeting space or hot desk', icon: '⬜' },
  { label: 'Buy Passes', href: '/cowork', desc: 'Purchase full or half day co-working passes', icon: '⬜' },
  { label: 'View Pricing', href: '/pricing', desc: 'See all rates and available bundles', icon: '⬜' },
  { label: 'Enquire Studio', href: '/studio', desc: 'Get in touch about studio memberships', icon: '⬜' },
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [fullDayBalance, setFullDayBalance] = useState(0);
  const [halfDayBalance, setHalfDayBalance] = useState(0);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const countdown = useCountdown(expiryDate);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoadingData(true);

      const [balanceRes, bookingsRes] = await Promise.all([
        supabase
          .from('pass_balances')
          .select('*')
          .eq('user_id', user!.id),
        supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user!.id)
          .eq('status', 'upcoming')
          .order('booking_date', { ascending: true })
          .limit(5),
      ]);

      if (balanceRes.data) {
        let fd = 0;
        let hd = 0;
        let latestExpiry: Date | null = null;

        (balanceRes.data as PassBalance[]).forEach(b => {
          const remaining = b.total_passes - b.used_passes;
          if (b.pass_type === 'full_day') fd += remaining;
          if (b.pass_type === 'half_day') hd += remaining;

          const purchased = new Date(b.purchased_at);
          const expiry = new Date(purchased.getTime() + 45 * 24 * 60 * 60 * 1000);
          if (!latestExpiry || expiry > latestExpiry) latestExpiry = expiry;
        });

        setFullDayBalance(fd);
        setHalfDayBalance(hd);
        if (fd + hd > 0) setExpiryDate(latestExpiry);
      }

      if (bookingsRes.data) {
        setBookings(bookingsRes.data as Booking[]);
      }

      setLoadingData(false);
    }
    load();
  }, [user]);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const totalPasses = fullDayBalance + halfDayBalance;
  const hasExpiry = expiryDate && totalPasses > 0;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="overline" style={{ marginBottom: '8px' }}>Member Portal</p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '-0.01em' }}>
            Overview
          </h1>
          <span style={{ color: 'var(--grey)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {today}
          </span>
        </div>
        {profile && (
          <p style={{ color: 'var(--grey)', marginTop: '6px', fontSize: '0.9rem' }}>
            Welcome back, <span style={{ color: 'var(--light)', fontWeight: 500 }}>{profile.first_name}</span>
          </p>
        )}
      </div>

      {/* Top widgets row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

        {/* Pass Balance Widget */}
        <div style={{
          background: 'var(--dark2)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '32px',
        }}>
          <p className="overline" style={{ marginBottom: '20px' }}>Your Pass Balance</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }}>
            {/* Full Day */}
            <div style={{ background: 'var(--dark2)', padding: '24px 20px' }}>
              <p style={{ fontSize: '3rem', fontWeight: 700, color: fullDayBalance > 0 ? 'var(--green)' : 'var(--mid)', lineHeight: 1, marginBottom: '8px' }}>
                {loadingData ? '–' : fullDayBalance}
              </p>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)' }}>
                Full Day Passes
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--grey)', marginTop: '4px' }}>
                {fullDayBalance === 0 ? '0 remaining' : `${fullDayBalance} remaining`}
              </p>
            </div>

            {/* Half Day */}
            <div style={{ background: 'var(--dark2)', padding: '24px 20px' }}>
              <p style={{ fontSize: '3rem', fontWeight: 700, color: halfDayBalance > 0 ? 'var(--green)' : 'var(--mid)', lineHeight: 1, marginBottom: '8px' }}>
                {loadingData ? '–' : halfDayBalance}
              </p>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)' }}>
                Half Day Passes
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--grey)', marginTop: '4px' }}>
                {halfDayBalance === 0 ? '0 remaining' : `${halfDayBalance} remaining`}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--grey)', letterSpacing: '0.04em', marginBottom: '20px' }}>
            Valid for 45 days from purchase date
          </p>

          <Link
            href="/cowork"
            className="btn-primary"
            style={{ display: 'inline-flex', fontSize: '0.7rem', padding: '12px 20px' }}
          >
            Buy More Passes →
          </Link>
        </div>

        {/* Expiry Countdown Widget */}
        <div style={{
          background: 'var(--dark2)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '32px',
        }}>
          <p className="overline" style={{ marginBottom: '20px' }}>Pass Expiry</p>

          {!loadingData && !hasExpiry ? (
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--grey)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '20px' }}>
                No active passes — purchase bundles on the co-working page.
              </p>
              <Link
                href="/cowork"
                className="btn-secondary"
                style={{ display: 'inline-flex', fontSize: '0.7rem', padding: '12px 20px' }}
              >
                View Co-Working →
              </Link>
            </div>
          ) : (
            <>
              {hasExpiry && (
                <p style={{ fontSize: '0.72rem', color: 'var(--grey)', marginBottom: '24px', letterSpacing: '0.04em' }}>
                  Expires {expiryDate!.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hours' },
                  { value: countdown.minutes, label: 'Mins' },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: 'var(--dark2)', padding: '20px 16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--green)', lineHeight: 1, marginBottom: '6px' }}>
                      {String(value).padStart(2, '0')}
                    </p>
                    <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--grey)' }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div style={{
        background: 'var(--dark2)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '24px',
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <p className="overline" style={{ marginBottom: '4px' }}>Dashboard</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--light)' }}>
              Your Upcoming Bookings
            </h2>
          </div>
          <Link
            href="/dashboard/bookings"
            style={{ color: 'var(--green)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}
          >
            View All →
          </Link>
        </div>

        {!loadingData && bookings.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--grey)', fontSize: '0.88rem', marginBottom: '16px' }}>
              No upcoming bookings
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
                  {['Reference', 'Space', 'Date', 'Session', 'Total', 'Status'].map(col => (
                    <th
                      key={col}
                      style={{
                        padding: '12px 32px',
                        textAlign: 'left',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--grey)',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, i) => (
                  <tr
                    key={booking.id}
                    style={{
                      borderBottom: i < bookings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 32px', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      {booking.reference}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--light)', textTransform: 'capitalize' }}>
                      {booking.space_type.replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--light)' }}>
                      {formatDate(booking.booking_date)}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--grey)' }}>
                      {formatSession(booking.session_type)}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--light)' }}>
                      £{booking.total_inc_vat.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 32px' }}>
                      <span className={`badge badge-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <p className="overline" style={{ marginBottom: '16px' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
          {QUICK_ACTIONS.map(action => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                background: 'var(--dark2)',
                padding: '28px 24px',
                textDecoration: 'none',
                display: 'block',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,219,38,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--dark2)')}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '8px' }}>
                {action.label}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--grey)', lineHeight: 1.5 }}>
                {action.desc}
              </p>
              <p style={{ marginTop: '16px', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
