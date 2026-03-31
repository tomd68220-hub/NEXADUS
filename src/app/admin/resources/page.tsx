'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';

const ROOMS = [
  { key: 'training_room', label: 'Training Room', desc: 'Full-day training and workshops' },
  { key: 'hot_desk', label: 'Co-working Hot Desks', desc: 'Flexible daily desk access' },
  { key: 'meeting_room', label: 'Meeting Room', desc: 'Hourly meeting space' },
  { key: 'studio', label: 'Gusto House Studio', desc: 'Community and event space' },
];

export default function ResourcesPage() {
  const { toasts, addToast, removeToast } = useToast();

  const [roomStatus, setRoomStatus] = useState<Record<string, boolean>>({
    training_room: true, hot_desk: true, meeting_room: true, studio: true,
  });

  const [pricing, setPricing] = useState({
    training_half: 105, training_full: 185,
    meeting_hourly: 15,
    studio_hourly: 18,
    hotdesk_full: 15, hotdesk_half: 10,
  });

  const [banner, setBanner] = useState('');
  const [activeBanner, setActiveBanner] = useState('');
  const [savingPricing, setSavingPricing] = useState(false);

  async function toggleRoom(key: string, val: boolean) {
    setRoomStatus(prev => ({ ...prev, [key]: val }));
    addToast(`${ROOMS.find(r => r.key === key)?.label} is now ${val ? 'open' : 'closed'}.`, val ? 'success' : 'info');
  }

  async function savePricing(e: React.FormEvent) {
    e.preventDefault();
    setSavingPricing(true);
    await new Promise(r => setTimeout(r, 600));
    setSavingPricing(false);
    addToast('Pricing updated successfully.', 'success');
  }

  function publishBanner() {
    if (!banner.trim()) return;
    setActiveBanner(banner);
    setBanner('');
    addToast('Promotional banner published.', 'success');
  }

  function clearBanner() {
    setActiveBanner('');
    addToast('Banner cleared.', 'info');
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--light)',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 300,
    padding: '10px 14px',
    outline: 'none',
    fontSize: '0.9rem',
  } as const;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Active banner preview */}
      {activeBanner && (
        <div style={{ background: 'var(--green)', color: 'var(--dark)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{activeBanner}</span>
          <button onClick={clearBanner} style={{ background: 'none', border: 'none', color: 'var(--dark)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>× Clear</button>
        </div>
      )}

      {/* Room status */}
      <div style={{ marginBottom: '48px' }}>
        <div className="overline" style={{ marginBottom: '20px' }}>Room Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
          {ROOMS.map(room => (
            <div key={room.key} style={{ background: 'var(--dark2)', padding: '28px 24px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{room.label}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 300, color: 'var(--grey)', marginBottom: '20px' }}>{room.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: roomStatus[room.key] ? 'var(--green)' : '#ff6b6b',
                }}>
                  {roomStatus[room.key] ? '● Open' : '● Closed'}
                </span>
                <Toggle checked={roomStatus[room.key]} onChange={v => toggleRoom(room.key, v)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing overrides */}
      <div style={{ marginBottom: '48px' }}>
        <div className="overline" style={{ marginBottom: '20px' }}>Pricing Overrides</div>
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '32px' }}>
          <form onSubmit={savePricing} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>Training Room</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label>Half-Day Rate (£)</label>
                    <input style={inputStyle} type="number" value={pricing.training_half} onChange={e => setPricing(p => ({ ...p, training_half: +e.target.value }))} />
                  </div>
                  <div>
                    <label>Full-Day Rate (£)</label>
                    <input style={inputStyle} type="number" value={pricing.training_full} onChange={e => setPricing(p => ({ ...p, training_full: +e.target.value }))} />
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>Meeting Room & Studio</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label>Meeting Room Rate (£/hr)</label>
                    <input style={inputStyle} type="number" value={pricing.meeting_hourly} onChange={e => setPricing(p => ({ ...p, meeting_hourly: +e.target.value }))} />
                  </div>
                  <div>
                    <label>Studio Rate (£/hr)</label>
                    <input style={inputStyle} type="number" value={pricing.studio_hourly} onChange={e => setPricing(p => ({ ...p, studio_hourly: +e.target.value }))} />
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' }}>Hot Desk Passes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label>Full Day — Single Pass (£)</label>
                    <input style={inputStyle} type="number" value={pricing.hotdesk_full} onChange={e => setPricing(p => ({ ...p, hotdesk_full: +e.target.value }))} />
                  </div>
                  <div>
                    <label>Half Day — Single Pass (£)</label>
                    <input style={inputStyle} type="number" value={pricing.hotdesk_half} onChange={e => setPricing(p => ({ ...p, hotdesk_half: +e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button type="submit" disabled={savingPricing} className="btn-primary">
                {savingPricing ? 'Saving...' : 'Save Pricing Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Promotional banner */}
      <div>
        <div className="overline" style={{ marginBottom: '20px' }}>Promotional Banner</div>
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '32px' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.7, marginBottom: '20px' }}>
            Published banners appear at the top of all pages in a green bar. Keep messages concise.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input
              style={{ ...inputStyle, flexGrow: 1 }}
              value={banner}
              onChange={e => setBanner(e.target.value)}
              placeholder="e.g. 20% off all co-working passes this week — use code GUSTO20"
              maxLength={120}
            />
            <button onClick={publishBanner} className="btn-primary" disabled={!banner.trim()}>Publish</button>
            <button onClick={clearBanner} className="btn-secondary">Clear</button>
          </div>
          {activeBanner && (
            <div style={{ fontSize: '0.78rem', fontWeight: 300, color: 'var(--grey)' }}>
              Active banner: <span style={{ color: 'var(--green)', fontWeight: 600 }}>&quot;{activeBanner}&quot;</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
