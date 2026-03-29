'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AuthGateModal } from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/Stepper';
import { IMAGES } from '@/types';
import { getWeekdays, formatDateShort, calculateMeetingRoomTotal, formatCurrency } from '@/lib/utils';

function DatePicker({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const days = getWeekdays(new Date(), 10);

  return (
    <div style={{ display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.06)', overflowX: 'auto' }}>
      {days.map((day, i) => {
        const isSelected = selected?.toDateString() === day.toDateString();
        const parts = formatDateShort(day).split(' ');
        return (
          <button
            key={i}
            onClick={() => onSelect(day)}
            style={{
              background: isSelected ? 'var(--green)' : 'var(--dark2)',
              color: isSelected ? 'var(--dark)' : 'var(--light)',
              border: 'none',
              padding: '16px 20px',
              cursor: 'pointer',
              minWidth: '80px',
              textAlign: 'center',
              transition: 'all 0.2s var(--ease)',
              flexShrink: 0,
            }}
          >
            <div style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '6px',
              opacity: 0.7,
            }}>{parts[0]}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 200, lineHeight: 1 }}>{parts[1]}</div>
            <div style={{
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: '4px',
              opacity: 0.7,
            }}>{parts[2]}</div>
          </button>
        );
      })}
    </div>
  );
}

function TrainingRoomDrawer({ date }: { date: Date | null }) {
  const { session } = useAuth();
  const [showGate, setShowGate] = useState(false);
  const [session2, setSession2] = useState<'am' | 'pm' | 'full'>('am');
  const [delegates, setDelegates] = useState(1);
  const [requirements, setRequirements] = useState('');

  const prices = { am: 105, pm: 105, full: 185 };
  const total = prices[session2];

  function handleBook() {
    if (!session) { setShowGate(true); return; }
    alert('Proceed to Stripe checkout (integration required)');
  }

  return (
    <>
      {showGate && <AuthGateModal onClose={() => setShowGate(false)} redirectPath="/book" />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', padding: '40px' }}>
        <div>
          <div style={{ marginBottom: '28px' }}>
            <label>Session</label>
            <div style={{ display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
              {[
                { key: 'am', label: 'AM — 09:00–13:00' },
                { key: 'pm', label: 'PM — 13:00–17:00' },
                { key: 'full', label: 'Full Day — 09:00–17:00' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSession2(s.key as 'am' | 'pm' | 'full')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: session2 === s.key ? 'var(--green)' : 'var(--dark2)',
                    color: session2 === s.key ? 'var(--dark)' : 'var(--grey)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <Stepper value={delegates} min={1} max={14} onChange={setDelegates} label="Delegates" />
          </div>

          <div>
            <label>Special Requirements (optional)</label>
            <textarea
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
              rows={4}
              placeholder="Any dietary requirements, AV setup preferences, accessibility needs..."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '28px',
          position: 'sticky',
          top: '100px',
          alignSelf: 'start',
        }}>
          <div className="overline" style={{ marginBottom: '20px' }}>Booking Summary</div>
          {[
            { label: 'Space', value: 'Training Room' },
            { label: 'Date', value: date ? formatDateShort(date) : '— Select a date' },
            { label: 'Session', value: session2 === 'am' ? 'AM (09:00–13:00)' : session2 === 'pm' ? 'PM (13:00–17:00)' : 'Full Day' },
            { label: 'Delegates', value: `${delegates} ${delegates === 1 ? 'person' : 'people'}` },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--grey)', fontWeight: 300 }}>{r.label}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--light)', fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px 0 0',
            marginTop: '4px',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>Total</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 200, color: 'var(--green)' }}>{formatCurrency(total)}</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--grey)', margin: '8px 0 20px', fontWeight: 300 }}>Excl. VAT where applicable</p>
          <button onClick={handleBook} className="btn-primary btn-full" style={{ width: '100%' }}>
            Proceed to Payment
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}

function MeetingRoomDrawer({ date }: { date: Date | null }) {
  const { session } = useAuth();
  const [showGate, setShowGate] = useState(false);
  const [startHour, setStartHour] = useState(9);
  const [duration, setDuration] = useState(1);

  const total = calculateMeetingRoomTotal(duration);

  function handleBook() {
    if (!session) { setShowGate(true); return; }
    alert('Proceed to Stripe checkout (integration required)');
  }

  const timeSlots = Array.from({ length: 8 }, (_, i) => 9 + i);

  return (
    <>
      {showGate && <AuthGateModal onClose={() => setShowGate(false)} redirectPath="/book" />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', padding: '40px' }}>
        <div>
          <div style={{ marginBottom: '28px' }}>
            <label>Start Time</label>
            <div style={{ display: 'flex', gap: '1px', background: 'rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
              {timeSlots.map(h => (
                <button
                  key={h}
                  onClick={() => setStartHour(h)}
                  style={{
                    padding: '10px 16px',
                    background: startHour === h ? 'var(--green)' : 'var(--dark2)',
                    color: startHour === h ? 'var(--dark)' : 'var(--grey)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}
                >
                  {h}:00
                </button>
              ))}
            </div>
          </div>
          <div>
            <Stepper value={duration} min={1} max={8} onChange={setDuration} label="Duration (hours)" />
            <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--grey)', fontWeight: 300 }}>
              £15/hr for first 4 hours · £10/hr thereafter
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '28px',
          alignSelf: 'start',
        }}>
          <div className="overline" style={{ marginBottom: '20px' }}>Booking Summary</div>
          {[
            { label: 'Space', value: 'Meeting Room' },
            { label: 'Date', value: date ? formatDateShort(date) : '— Select a date' },
            { label: 'Start Time', value: `${startHour}:00` },
            { label: 'End Time', value: `${startHour + duration}:00` },
            { label: 'Duration', value: `${duration} hour${duration > 1 ? 's' : ''}` },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--grey)', fontWeight: 300 }}>{r.label}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--light)', fontWeight: 500 }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>Total</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 200, color: 'var(--green)' }}>{formatCurrency(total)}</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--grey)', margin: '8px 0 20px', fontWeight: 300 }}>Excl. VAT</p>
          <button onClick={handleBook} className="btn-primary btn-full" style={{ width: '100%' }}>
            Proceed to Payment
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDrawer, setOpenDrawer] = useState<'training' | 'meeting' | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function toggleDrawer(key: 'training' | 'meeting') {
    setOpenDrawer(prev => prev === key ? null : key);
  }

  return (
    <>
      {/* Page header */}
      <div style={{
        paddingTop: '72px',
        background: 'var(--dark2)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 48px' }}>
          <div className="overline" style={{ marginBottom: '16px' }}>Reservations</div>
          <h1 style={{
            fontSize: 'clamp(2.2rem,4vw,3.4rem)',
            fontWeight: 200,
            color: 'var(--white)',
            lineHeight: 1.1,
            marginBottom: '16px',
          }}>
            Book a Room — <strong style={{ fontWeight: 600 }}>Training Room or Meeting Room</strong>
          </h1>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, color: 'var(--grey)', maxWidth: '580px', lineHeight: 1.7 }}>
            Select your preferred date below, then choose a space to see available sessions and pricing.
          </p>
        </div>
      </div>

      {/* Date picker */}
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 0 0 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px' }}>
          <label style={{ marginBottom: '16px', display: 'block' }}>Select a Date (Weekdays Only)</label>
          <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
        </div>
      </div>

      {/* Room cards */}
      <div className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>

          {/* Training Room */}
          <div style={{ background: 'var(--dark2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '280px' }}>
              <div className="img-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                <Image src={IMAGES.trainingRoom} alt="Training Room" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div className="overline" style={{ marginBottom: '8px' }}>Training Room</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 200, color: 'var(--white)', lineHeight: 1.2 }}>
                      Full-day training and <strong style={{ fontWeight: 600 }}>workshops</strong>
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--green)' }}>£105</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>half-day</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {['Up to 14 delegates', 'Full AV & projector', 'Video conferencing', 'Tea & coffee included', 'Half-day or full day'].map(f => (
                    <span key={f} style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--grey)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <span style={{ color: 'var(--green)' }}>✓</span> {f}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)' }}>
                    Half-day <span style={{ color: 'var(--green)', fontWeight: 600 }}>£105</span> · Full-day <span style={{ color: 'var(--green)', fontWeight: 600 }}>£185</span>
                  </div>
                  <button
                    onClick={() => toggleDrawer('training')}
                    className="btn-primary"
                    style={{ marginLeft: 'auto' }}
                  >
                    {openDrawer === 'training' ? 'Close' : 'Book This Room'}
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer */}
            <div style={{
              maxHeight: openDrawer === 'training' ? '600px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.55s var(--ease)',
              borderTop: openDrawer === 'training' ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <TrainingRoomDrawer date={selectedDate} />
            </div>
          </div>

          {/* Meeting Room */}
          <div style={{ background: 'var(--dark2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: '280px' }}>
              <div className="img-hover" style={{ position: 'relative', overflow: 'hidden' }}>
                <Image src={IMAGES.meetingRoom} alt="Meeting Room" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div className="overline" style={{ marginBottom: '8px' }}>Meeting Room</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 200, color: 'var(--white)', lineHeight: 1.2 }}>
                      Focused meetings and <strong style={{ fontWeight: 600 }}>small groups</strong>
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--green)' }}>£15</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>per hour</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {['Up to 6 people', 'Quiet private space', 'Tea & coffee', 'Hourly booking', 'Min 1 hour'].map(f => (
                    <span key={f} style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--grey)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <span style={{ color: 'var(--green)' }}>✓</span> {f}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)' }}>
                    £15/hr (first 4hrs) · <span style={{ color: 'var(--green)', fontWeight: 600 }}>£10/hr after 4hrs</span>
                  </div>
                  <button
                    onClick={() => toggleDrawer('meeting')}
                    className="btn-primary"
                    style={{ marginLeft: 'auto' }}
                  >
                    {openDrawer === 'meeting' ? 'Close' : 'Book This Room'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{
              maxHeight: openDrawer === 'meeting' ? '600px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.55s var(--ease)',
              borderTop: openDrawer === 'meeting' ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <MeetingRoomDrawer date={selectedDate} />
            </div>
          </div>
        </div>
      </div>

      {/* Hot desk banner */}
      <div style={{
        background: 'rgba(192,219,38,0.06)',
        border: '1px solid rgba(192,219,38,0.2)',
        margin: '0 48px 80px',
        maxWidth: '1104px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '32px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
      }}>
        <div>
          <div className="overline" style={{ marginBottom: '8px' }}>Looking for a hot desk?</div>
          <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.6 }}>
            Co-working desks are credit-based — no booking needed. Just turn up between 9–5, weekdays.
          </p>
        </div>
        <Link href="/cowork" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <button className="btn-secondary">View Co-working →</button>
        </Link>
      </div>
    </>
  );
}
