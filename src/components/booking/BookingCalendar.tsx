'use client';

import { useState } from 'react';
import type { SpaceType, BookingStatus } from '@/types';

const HOUR_HEIGHT = 64;
const GRID_START = 8;
const GRID_END = 18;
const HOURS = Array.from({ length: GRID_END - GRID_START }, (_, i) => i + GRID_START);
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export interface CalendarBooking {
  id: string;
  reference: string;
  space_type: SpaceType;
  booking_date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  status: BookingStatus;
  total_inc_vat: number;
  booking_source?: string;
  profiles?: { first_name: string; last_name: string; email: string } | null;
  client_name?: string;
  client_email?: string;
}

const ROOM_CONFIG: Record<SpaceType, { bg: string; border: string; text: string; label: string }> = {
  training_room: { bg: 'rgba(74,158,255,0.16)',   border: '#4a9eff', text: '#4a9eff', label: 'Training Room' },
  meeting_room:  { bg: 'rgba(192,132,252,0.16)',  border: '#c084fc', text: '#c084fc', label: 'Meeting Room' },
  hot_desk:      { bg: 'rgba(192,219,38,0.16)',   border: '#c0db26', text: '#c0db26', label: 'Hot Desk' },
  studio:        { bg: 'rgba(251,146,60,0.16)',   border: '#fb923c', text: '#fb923c', label: 'Studio' },
};

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function getWeekMonday(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtWeekRange(monday: Date): string {
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const from = monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const to = friday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${from} – ${to}`;
}

interface BookingCalendarProps {
  bookings: CalendarBooking[];
  onBookingClick: (booking: CalendarBooking) => void;
  onSlotClick?: (date: string, hour: number) => void;
  canCreate?: boolean;
}

export function BookingCalendar({ bookings, onBookingClick, onSlotClick, canCreate = false }: BookingCalendarProps) {
  const [weekMonday, setWeekMonday] = useState(() => getWeekMonday(new Date()));
  const [roomFilter, setRoomFilter] = useState<Set<SpaceType>>(
    new Set(['training_room', 'meeting_room', 'hot_desk', 'studio'] as SpaceType[])
  );

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekMonday);
    d.setDate(weekMonday.getDate() + i);
    return d;
  });

  function prevWeek() {
    setWeekMonday(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  }
  function nextWeek() {
    setWeekMonday(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  }
  function goToday() { setWeekMonday(getWeekMonday(new Date())); }

  function toggleRoom(room: SpaceType) {
    setRoomFilter(prev => {
      const next = new Set(prev);
      if (next.has(room)) { if (next.size > 1) next.delete(room); }
      else next.add(room);
      return next;
    });
  }

  const today = toDateStr(new Date());
  const gridStartMin = GRID_START * 60;
  const totalHeight = HOURS.length * HOUR_HEIGHT;

  const bookingsByDate = new Map<string, CalendarBooking[]>();
  for (const b of bookings) {
    if (!roomFilter.has(b.space_type)) continue;
    if (b.status === 'cancelled') continue;
    if (!bookingsByDate.has(b.booking_date)) bookingsByDate.set(b.booking_date, []);
    bookingsByDate.get(b.booking_date)!.push(b);
  }

  const ctrlBtn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--grey)',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: 'Raleway, sans-serif',
  };

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={prevWeek} style={ctrlBtn}>←</button>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '0.03em', minWidth: '230px', textAlign: 'center' }}>
            {fmtWeekRange(weekMonday)}
          </span>
          <button onClick={nextWeek} style={ctrlBtn}>→</button>
          <button onClick={goToday} style={{ ...ctrlBtn, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Today
          </button>
        </div>

        {/* Room filter chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(Object.keys(ROOM_CONFIG) as SpaceType[]).map(room => {
            const active = roomFilter.has(room);
            const c = ROOM_CONFIG[room];
            return (
              <button
                key={room}
                onClick={() => toggleRoom(room)}
                style={{
                  padding: '5px 10px',
                  border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.1)'}`,
                  background: active ? c.bg : 'transparent',
                  color: active ? c.text : 'rgba(255,255,255,0.3)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'Raleway, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'var(--dark2)', overflowX: 'auto' }}>
        {/* Day headers */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '52px', flexShrink: 0 }} />
          {weekDays.map((day, i) => {
            const ds = toDateStr(day);
            const isToday = ds === today;
            return (
              <div key={i} style={{
                flex: 1,
                padding: '12px 8px',
                textAlign: 'center',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                background: isToday ? 'rgba(192,219,38,0.04)' : 'transparent',
                minWidth: '100px',
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: isToday ? 'var(--green)' : 'var(--grey)', marginBottom: '2px' }}>
                  {DAY_LABELS[i]}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: isToday ? 700 : 300, color: isToday ? 'var(--green)' : 'var(--light)' }}>
                  {day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid body */}
        <div style={{ display: 'flex', position: 'relative' }}>
          {/* Hour labels */}
          <div style={{ width: '52px', flexShrink: 0 }}>
            {HOURS.map(h => (
              <div key={h} style={{
                height: `${HOUR_HEIGHT}px`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                paddingRight: '8px',
                paddingTop: '5px',
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.2)',
              }}>
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, di) => {
            const ds = toDateStr(day);
            const isToday = ds === today;
            const dayBookings = bookingsByDate.get(ds) || [];

            return (
              <div
                key={di}
                style={{
                  flex: 1,
                  position: 'relative',
                  height: `${totalHeight}px`,
                  borderLeft: '1px solid rgba(255,255,255,0.05)',
                  background: isToday ? 'rgba(192,219,38,0.02)' : 'transparent',
                  cursor: canCreate && onSlotClick ? 'crosshair' : 'default',
                  minWidth: '100px',
                }}
                onClick={e => {
                  if (!canCreate || !onSlotClick) return;
                  if ((e.target as HTMLElement).closest('[data-booking]')) return;
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const hour = GRID_START + Math.floor(y / HOUR_HEIGHT);
                  onSlotClick(ds, Math.min(hour, GRID_END - 1));
                }}
              >
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} style={{
                    position: 'absolute',
                    top: `${(h - GRID_START) * HOUR_HEIGHT}px`,
                    left: 0, right: 0, height: '1px',
                    background: 'rgba(255,255,255,0.04)',
                    pointerEvents: 'none',
                  }} />
                ))}

                {/* Half-hour lines (lighter) */}
                {HOURS.map(h => (
                  <div key={`${h}h`} style={{
                    position: 'absolute',
                    top: `${(h - GRID_START) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px`,
                    left: 0, right: 0, height: '1px',
                    background: 'rgba(255,255,255,0.02)',
                    pointerEvents: 'none',
                  }} />
                ))}

                {/* Booking blocks */}
                {dayBookings.map(booking => {
                  const startMin = timeToMinutes(booking.start_time);
                  const endMin = timeToMinutes(booking.end_time);
                  const top = Math.max(0, (startMin - gridStartMin) * (HOUR_HEIGHT / 60));
                  const height = Math.max(22, (endMin - startMin) * (HOUR_HEIGHT / 60));
                  const c = ROOM_CONFIG[booking.space_type];
                  const name = booking.profiles
                    ? `${booking.profiles.first_name} ${booking.profiles.last_name}`
                    : booking.client_name || 'Staff';
                  const sourceBadge = booking.booking_source === 'staff' ? ' · Staff'
                    : booking.booking_source === 'admin' ? ' · Admin' : '';

                  return (
                    <div
                      key={booking.id}
                      data-booking="true"
                      onClick={e => { e.stopPropagation(); onBookingClick(booking); }}
                      title={`${c.label} — ${name}`}
                      style={{
                        position: 'absolute',
                        top: `${top}px`,
                        left: '3px',
                        right: '3px',
                        height: `${height}px`,
                        background: c.bg,
                        borderLeft: `3px solid ${c.border}`,
                        padding: '3px 5px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        zIndex: 2,
                      }}
                    >
                      <div style={{ fontSize: '0.58rem', fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.label}{sourceBadge}
                      </div>
                      {height > 30 && (
                        <div style={{ fontSize: '0.6rem', fontWeight: 300, color: 'var(--light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                          {name}
                        </div>
                      )}
                      {height > 44 && (
                        <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                          {booking.start_time.slice(0,5)} – {booking.end_time.slice(0,5)}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* "Click to book" hint on empty slots */}
                {canCreate && dayBookings.length === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    fontSize: '0.55rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.08)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    click to book
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
