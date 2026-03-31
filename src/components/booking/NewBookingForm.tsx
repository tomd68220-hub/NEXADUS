'use client';

import { useState } from 'react';
import type { SpaceType } from '@/types';

export interface NewBookingData {
  space_type: SpaceType;
  booking_date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  duration_hours?: number;
  delegates?: number;
  total_ex_vat: number;
  total_inc_vat: number;
  special_requirements?: string;
  internal_notes?: string;
  client_name?: string;
  client_email?: string;
}

interface NewBookingFormProps {
  initialDate?: string;
  initialHour?: number;
  onSubmit: (data: NewBookingData) => Promise<void>;
  onClose: () => void;
  mode: 'staff' | 'admin';
}

const VAT_RATE = 0.20;

const SPACE_OPTIONS: { value: SpaceType; label: string }[] = [
  { value: 'training_room', label: 'Training Room' },
  { value: 'meeting_room', label: 'Meeting Room' },
  { value: 'studio', label: 'Studio' },
  { value: 'hot_desk', label: 'Hot Desk' },
];

function getWeekdays(n = 28): { value: string; label: string }[] {
  const result: { value: string; label: string }[] = [];
  const d = new Date();
  while (result.length < n) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      result.push({
        value: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return result;
}

function addMinutesToTime(base: string, minutes: number): string {
  const [h, m] = base.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const MEETING_STARTS = Array.from({ length: 16 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

function calcTrainingTotal(session: string): number {
  if (session === 'full_day') return 185;
  return 105;
}

function calcMeetingTotal(hours: number): number {
  if (hours <= 4) return hours * 15;
  return 4 * 15 + (hours - 4) * 10;
}

function calcStudioTotal(hours: number): number {
  return hours * 18;
}

function calcHotDeskTotal(session: string): number {
  return session === 'full_day' ? 15 : 10;
}

export function NewBookingForm({ initialDate, initialHour, onSubmit, onClose, mode }: NewBookingFormProps) {
  const dates = getWeekdays();
  const defaultDate = initialDate && dates.find(d => d.value === initialDate)
    ? initialDate
    : dates[0]?.value ?? '';

  const [spaceType, setSpaceType] = useState<SpaceType>('meeting_room');
  const [date, setDate] = useState(defaultDate);
  const [session, setSession] = useState('half_day_am');
  const [meetingStart, setMeetingStart] = useState(
    initialHour ? `${String(initialHour).padStart(2, '0')}:00` : '09:00'
  );
  const [durationHours, setDurationHours] = useState(2);
  const [delegates, setDelegates] = useState(8);
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Derive times + total from state
  function getTimes(): { start: string; end: string } {
    if (spaceType === 'training_room') {
      if (session === 'full_day') return { start: '09:00', end: '17:00' };
      if (session === 'half_day_am') return { start: '09:00', end: '13:00' };
      return { start: '13:00', end: '17:00' };
    }
    if (spaceType === 'meeting_room' || spaceType === 'studio') {
      return { start: meetingStart, end: addMinutesToTime(meetingStart, durationHours * 60) };
    }
    // hot_desk
    if (session === 'full_day') return { start: '09:00', end: '17:00' };
    if (session === 'half_day_am') return { start: '09:00', end: '13:00' };
    return { start: '13:00', end: '17:00' };
  }

  function getTotal(): number {
    if (spaceType === 'training_room') return calcTrainingTotal(session);
    if (spaceType === 'meeting_room') return calcMeetingTotal(durationHours);
    if (spaceType === 'studio') return calcStudioTotal(durationHours);
    return calcHotDeskTotal(session);
  }

  function getSessionType(): string {
    if (spaceType === 'meeting_room' || spaceType === 'studio') return 'hourly';
    return session;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { start, end } = getTimes();
    const totalExVat = getTotal();
    setSubmitting(true);
    await onSubmit({
      space_type: spaceType,
      booking_date: date,
      start_time: start,
      end_time: end,
      session_type: getSessionType(),
      duration_hours: (spaceType === 'meeting_room' || spaceType === 'studio') ? durationHours : undefined,
      delegates: spaceType === 'training_room' ? delegates : undefined,
      total_ex_vat: totalExVat,
      total_inc_vat: parseFloat((totalExVat * (1 + VAT_RATE)).toFixed(2)),
      special_requirements: notes || undefined,
      internal_notes: internalNotes || undefined,
      client_name: clientName || undefined,
      client_email: clientEmail || undefined,
    });
    setSubmitting(false);
  }

  const { start, end } = getTimes();
  const totalExVat = getTotal();
  const totalIncVat = parseFloat((totalExVat * (1 + VAT_RATE)).toFixed(2));

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--light)',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 300,
    padding: '10px 14px',
    outline: 'none',
    fontSize: '0.88rem',
    boxSizing: 'border-box',
  };

  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--grey)',
    marginBottom: '6px',
    fontFamily: 'Raleway, sans-serif',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Room */}
      <div>
        <label style={labelStyle}>Space</label>
        <select style={selectStyle} value={spaceType} onChange={e => setSpaceType(e.target.value as SpaceType)}>
          {SPACE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Date */}
      <div>
        <label style={labelStyle}>Date</label>
        <select style={selectStyle} value={date} onChange={e => setDate(e.target.value)}>
          {dates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      {/* Session config — depends on space type */}
      {(spaceType === 'training_room' || spaceType === 'hot_desk') && (
        <div>
          <label style={labelStyle}>Session</label>
          <select style={selectStyle} value={session} onChange={e => setSession(e.target.value)}>
            <option value="half_day_am">AM Half Day (09:00–13:00)</option>
            <option value="half_day_pm">PM Half Day (13:00–17:00)</option>
            <option value="full_day">Full Day (09:00–17:00)</option>
          </select>
        </div>
      )}

      {spaceType === 'training_room' && (
        <div>
          <label style={labelStyle}>Delegates (max 14)</label>
          <input
            style={inputStyle}
            type="number"
            min={1}
            max={14}
            value={delegates}
            onChange={e => setDelegates(parseInt(e.target.value) || 1)}
          />
        </div>
      )}

      {(spaceType === 'meeting_room' || spaceType === 'studio') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Start Time</label>
            <select style={selectStyle} value={meetingStart} onChange={e => setMeetingStart(e.target.value)}>
              {MEETING_STARTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Duration (hrs)</label>
            <select style={selectStyle} value={durationHours} onChange={e => setDurationHours(parseInt(e.target.value))}>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map(h => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Time summary */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '4px' }}>Time Slot</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--light)' }}>{start} – {end}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '4px' }}>Total (inc. VAT)</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green)' }}>£{totalIncVat.toFixed(2)}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--grey)', fontWeight: 300 }}>£{totalExVat.toFixed(2)} ex. VAT</div>
        </div>
      </div>

      {/* Admin-only: client details */}
      {mode === 'admin' && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '14px' }}>
            Client Details (optional)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Client Name</label>
              <input style={inputStyle} type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Client Email</label>
              <input style={inputStyle} type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="jane@company.com" />
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label style={labelStyle}>Special Requirements</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' } as React.CSSProperties}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Equipment, setup, catering notes..."
        />
      </div>

      <div>
        <label style={labelStyle}>Internal Notes</label>
        <textarea
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' } as React.CSSProperties}
          value={internalNotes}
          onChange={e => setInternalNotes(e.target.value)}
          placeholder="Staff/admin only notes..."
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? 'Creating...' : 'Confirm Booking →'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '12px 20px' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
