'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/types';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

const SESSION_TYPES = [
  'Exercise/Fitness Class',
  'Parent & Baby Group',
  'Art Workshop',
  'Drama/Performing Arts',
  'Weekend Retreat',
  'Community Gathering',
  'Private Event',
  'Other',
];

const FREQUENCIES = ['One-off', 'Weekly', 'Fortnightly', 'Monthly', 'Block booking'];
const ATTENDEES = ['1–10', '11–20', '21–30', '30+'];

export default function StudioPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', company: '',
    session_type: '', frequency: '',
    preferred_start: '', preferred_end: '',
    attendees: '', brief: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/studio-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      addToast('Your enquiry has been sent! We\'ll be in touch shortly.', 'success');
    } catch {
      addToast('Something went wrong. Please try again or email us directly.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--light)',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 300,
    padding: '12px 16px',
    outline: 'none',
    fontSize: '0.9rem',
  } as const;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Hero */}
      <section style={{ height: '70vh', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 48px 80px' }}>
        <Image src={IMAGES.studio} alt="Gusto House Studio" fill style={{ objectFit: 'cover' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.35) 60%)' }} />
        <div style={{ position: 'relative', maxWidth: '680px' }}>
          <div className="overline" style={{ marginBottom: '20px' }}>Gusto House Studio</div>
          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 200, color: 'var(--white)', lineHeight: 1.1, marginBottom: '20px' }}>
            A versatile space for <strong style={{ fontWeight: 600 }}>your community</strong>
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '520px' }}>
            Classes, workshops, retreats and gatherings. The studio is available to hire by the hour — enquire below to discuss your needs.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#enquiry" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Enquire Now</button>
            </a>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">View Pricing</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main 2-column */}
      <section className="section" id="enquiry">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>

          {/* Left: info */}
          <div className="reveal">
            <div className="overline" style={{ marginBottom: '20px' }}>About the Studio</div>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, color: 'var(--white)', lineHeight: 1.2, marginBottom: '24px' }}>
              A bright, calm space for <strong style={{ fontWeight: 600 }}>community use</strong>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
                The Gusto House Studio is a spacious, purpose-built community space available for hire by the hour. It&apos;s designed to accommodate a wide range of group activities — from fitness classes and parent & baby groups to art workshops, drama sessions, weekend retreats, and private events.
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
                The studio benefits from the same welcoming, professional environment as the rest of Gusto House, with access to on-site café, gym facilities, and ample car parking.
              </p>
            </div>

            {/* Session types */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '16px' }}>Suitable for</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SESSION_TYPES.map(s => (
                  <span key={s} style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--grey)',
                  }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Rate */}
            <div style={{ padding: '24px', background: 'rgba(192,219,38,0.06)', border: '1px solid rgba(192,219,38,0.2)', marginBottom: '36px' }}>
              <div className="overline" style={{ marginBottom: '10px' }}>Studio Rate</div>
              <div style={{ fontSize: '2rem', fontWeight: 200, color: 'var(--green)', lineHeight: 1 }}>£18 <span style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--grey)' }}>+ VAT per hour</span></div>
              <p style={{ fontSize: '0.8rem', fontWeight: 300, color: 'var(--grey)', marginTop: '8px', lineHeight: 1.6 }}>Rates vary based on session type, frequency, and duration. Block bookings available at preferential rates.</p>
            </div>

            {/* Testimonial */}
            <blockquote style={{
              borderLeft: '3px solid var(--green)',
              paddingLeft: '24px',
              margin: '0',
            }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 300, color: 'var(--light)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '16px' }}>
                &ldquo;Thank you for all your hard work — the studio is lovely, always clean and a lovely calm vibe. My class attendees love coming into reception before the class, and nothing seems to be too much trouble.&rdquo;
              </p>
              <footer style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--green)' }}>
                Cheryl Roebuck — Purely Physical
              </footer>
            </blockquote>
          </div>

          {/* Right: enquiry form */}
          <div className="reveal">
            <div className="overline" style={{ marginBottom: '20px' }}>Enquiry Form</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 200, color: 'var(--white)', marginBottom: '32px', lineHeight: 1.3 }}>
              Tell us about your <strong style={{ fontWeight: 600 }}>requirements</strong>
            </h2>

            {submitted ? (
              <div style={{ padding: '48px 40px', background: 'rgba(192,219,38,0.06)', border: '1px solid rgba(192,219,38,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>✓</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 200, color: 'var(--white)', marginBottom: '12px' }}>Enquiry sent!</h3>
                <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.7 }}>
                  Thanks for getting in touch. We&apos;ll review your enquiry and get back to you within 1–2 working days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>Name *</label>
                    <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} required placeholder="Your full name" />
                  </div>
                  <div>
                    <label>Email *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <label>Company / Organisation <span style={{ color: 'var(--grey)', fontWeight: 300, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span></label>
                  <input style={inputStyle} value={form.company} onChange={e => update('company', e.target.value)} placeholder="Company or organisation name" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>Session Type *</label>
                    <select style={inputStyle} value={form.session_type} onChange={e => update('session_type', e.target.value)} required>
                      <option value="">Select type...</option>
                      {SESSION_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Frequency *</label>
                    <select style={inputStyle} value={form.frequency} onChange={e => update('frequency', e.target.value)} required>
                      <option value="">Select frequency...</option>
                      {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>Preferred Start Date</label>
                    <input style={inputStyle} type="date" value={form.preferred_start} onChange={e => update('preferred_start', e.target.value)} />
                  </div>
                  <div>
                    <label>Preferred End Date <span style={{ color: 'var(--grey)', fontWeight: 300, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span></label>
                    <input style={inputStyle} type="date" value={form.preferred_end} onChange={e => update('preferred_end', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label>Expected Attendees *</label>
                  <select style={inputStyle} value={form.attendees} onChange={e => update('attendees', e.target.value)} required>
                    <option value="">Select range...</option>
                    {ATTENDEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label>Project Brief *</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical' }}
                    rows={5}
                    value={form.brief}
                    onChange={e => update('brief', e.target.value)}
                    required
                    placeholder="Tell us more about your session — what you need, any special requirements, your vision for the space..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-full"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Enquiry'}
                  {!loading && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* What's possible */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>What&apos;s Possible</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 200, color: 'var(--white)' }}>
              A space for <strong style={{ fontWeight: 600 }}>every occasion</strong>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {[
              { icon: '🏋️', title: 'Exercise & Fitness', desc: 'Yoga, pilates, HIIT, dance, martial arts, personal training groups. Sprung floor suitable for most fitness disciplines.' },
              { icon: '🎨', title: 'Workshops & Classes', desc: 'Art, craft, drama, performing arts, wellness workshops, educational sessions, and skill-based group activities.' },
              { icon: '🤝', title: 'Community Events', desc: 'Parent & baby groups, community gatherings, private events, weekend retreats, conferences, and networking.' },
            ].map((item, i) => (
              <div key={i} className="reveal" style={{ background: 'var(--dark2)', padding: '40px 32px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
