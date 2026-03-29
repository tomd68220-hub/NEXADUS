'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES, FULL_DAY_BUNDLES, HALF_DAY_BUNDLES } from '@/types';

export default function PricingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ height: '50vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 48px' }}>
        <Image src={IMAGES.pricingHero} alt="Gusto House pricing" fill style={{ objectFit: 'cover' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.78)' }} />
        <div style={{ position: 'relative', maxWidth: '680px' }}>
          <div className="overline" style={{ marginBottom: '20px' }}>Transparent Pricing</div>
          <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', fontWeight: 200, color: 'var(--white)', lineHeight: 1.1, marginBottom: '16px' }}>
            Simple, honest pricing — <strong style={{ fontWeight: 600 }}>no hidden fees.</strong>
          </h1>
          <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            All prices are clearly listed. Book online, pay securely, receive your invoice automatically.
          </p>
        </div>
      </section>

      {/* Co-working passes */}
      <section className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>Co-working Passes</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 200, color: 'var(--white)', lineHeight: 1.2 }}>
              Flexible <strong style={{ fontWeight: 600 }}>hot desk</strong> access
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {/* Full day */}
            <div className="reveal" style={{ background: 'var(--dark2)' }}>
              <div className="img-hover" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                <Image src={IMAGES.fullDayPasses} alt="Full day passes" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(34,34,34,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '28px' }}>
                  <div className="overline" style={{ marginBottom: '6px' }}>Full Day Passes</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>09:00 – 17:00</div>
                </div>
              </div>
              <div style={{ padding: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Passes', 'Total', 'Per Day'].map(h => (
                        <th key={h} style={{ padding: '10px 0', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FULL_DAY_BUNDLES.map((b, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 0', fontSize: '0.88rem', fontWeight: 300, color: 'var(--light)' }}>
                          {b.passes === 1 ? 'Single' : `${b.passes}-pass`}
                        </td>
                        <td style={{ padding: '14px 0', fontSize: '0.88rem', fontWeight: 600, color: 'var(--green)' }}>£{b.price}</td>
                        <td style={{ padding: '14px 0', fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)' }}>£{b.perPass}/day</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/cowork" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary btn-full" style={{ width: '100%' }}>
                      Buy Full Day Passes
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Half day */}
            <div className="reveal" style={{ background: 'var(--dark2)' }}>
              <div className="img-hover" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                <Image src={IMAGES.halfDayPasses} alt="Half day passes" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(34,34,34,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '24px', left: '28px' }}>
                  <div className="overline" style={{ marginBottom: '6px' }}>Half Day Passes</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>AM 09:00–13:00 · PM 13:00–17:00</div>
                </div>
              </div>
              <div style={{ padding: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Passes', 'Total', 'Per Session'].map(h => (
                        <th key={h} style={{ padding: '10px 0', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HALF_DAY_BUNDLES.map((b, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 0', fontSize: '0.88rem', fontWeight: 300, color: 'var(--light)' }}>
                          {b.passes === 1 ? 'Single' : `${b.passes}-pass`}
                        </td>
                        <td style={{ padding: '14px 0', fontSize: '0.88rem', fontWeight: 600, color: 'var(--green)' }}>£{b.price}</td>
                        <td style={{ padding: '14px 0', fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)' }}>£{b.perPass}/session</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/cowork" style={{ textDecoration: 'none' }}>
                    <button className="btn-primary btn-full" style={{ width: '100%' }}>
                      Buy Half Day Passes
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <p style={{ marginTop: '16px', fontSize: '0.78rem', fontWeight: 300, color: 'var(--grey)', textAlign: 'center' }}>
            All passes valid for 45 days from date of purchase. Bundles can be stacked.
          </p>
        </div>
      </section>

      {/* Room hire */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>Room Hire</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 200, color: 'var(--white)', lineHeight: 1.2 }}>
              Book by the <strong style={{ fontWeight: 600 }}>hour or half-day</strong>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {/* Meeting Room */}
            <div className="reveal" style={{ background: 'var(--dark2)' }}>
              <div className="img-hover" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                <Image src={IMAGES.meetingRoomPricing} alt="Meeting Room" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '32px' }}>
                <div className="overline" style={{ marginBottom: '12px' }}>Meeting Room</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 200, color: 'var(--white)', marginBottom: '20px' }}>Up to <strong style={{ fontWeight: 600 }}>6 people</strong></h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { label: 'First 4 hours', rate: '£15 per hour' },
                    { label: 'After 4 hours', rate: '£10 per hour' },
                    { label: 'Minimum booking', rate: '1 hour' },
                    { label: 'Maximum booking', rate: '8 hours' },
                    { label: 'Tea & coffee', rate: 'Included' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--grey)' }}>{r.label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: r.rate.startsWith('£') ? 'var(--green)' : 'var(--light)' }}>{r.rate}</span>
                    </div>
                  ))}
                </div>
                <Link href="/book" style={{ textDecoration: 'none', display: 'block', marginTop: '24px' }}>
                  <button className="btn-secondary btn-full" style={{ width: '100%' }}>
                    Book Meeting Room
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
                  </button>
                </Link>
              </div>
            </div>

            {/* Training Room */}
            <div className="reveal" style={{ background: 'var(--dark2)' }}>
              <div className="img-hover" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                <Image src={IMAGES.trainingRoomPricing} alt="Training Room" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '32px' }}>
                <div className="overline" style={{ marginBottom: '12px' }}>Training Room</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 200, color: 'var(--white)', marginBottom: '20px' }}>Up to <strong style={{ fontWeight: 600 }}>14 delegates</strong></h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { label: 'Half-day (AM or PM)', rate: '£105' },
                    { label: 'Full day', rate: '£185' },
                    { label: 'AV & projector', rate: 'Included' },
                    { label: 'Video conferencing', rate: 'Included' },
                    { label: 'Tea & coffee', rate: 'Included' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--grey)' }}>{r.label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: r.rate.startsWith('£') ? 'var(--green)' : 'var(--light)' }}>{r.rate}</span>
                    </div>
                  ))}
                </div>
                <Link href="/book" style={{ textDecoration: 'none', display: 'block', marginTop: '24px' }}>
                  <button className="btn-secondary btn-full" style={{ width: '100%' }}>
                    Book Training Room
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>Studio Hire</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 200, color: 'var(--white)', lineHeight: 1.2 }}>
              Gusto House <strong style={{ fontWeight: 600 }}>Studio</strong>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            <div className="img-hover reveal" style={{ minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
              <Image src={IMAGES.studio} alt="Gusto House Studio" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="reveal" style={{ background: 'var(--dark2)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="overline" style={{ marginBottom: '16px' }}>Community Studio</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 200, color: 'var(--white)', marginBottom: '16px', lineHeight: 1.2 }}>
                Versatile space for <strong style={{ fontWeight: 600 }}>classes, workshops & events</strong>
              </h3>
              <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.8, marginBottom: '28px' }}>
                The Gusto House Studio is a bright, versatile community space suitable for exercise classes, parent & baby groups, workshops, retreats, and private events.
              </p>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 200, color: 'var(--green)', lineHeight: 1 }}>£18<span style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--grey)' }}> + VAT</span></div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--grey)', marginTop: '6px' }}>per hour (rate varies by session type)</div>
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.7, marginBottom: '28px' }}>
                Pricing varies based on session type, frequency, and duration. Get in touch to discuss your requirements and receive a tailored quote.
              </p>
              <Link href="/studio" style={{ textDecoration: 'none' }}>
                <button className="btn-primary btn-full" style={{ width: '100%' }}>
                  Enquire about the Studio
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ callout */}
      <div style={{ padding: '64px 48px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overline reveal" style={{ marginBottom: '16px' }}>Questions?</div>
        <h3 className="reveal" style={{ fontSize: '1.4rem', fontWeight: 200, color: 'var(--white)', marginBottom: '12px' }}>
          Have questions? <strong style={{ fontWeight: 600 }}>Get in touch.</strong>
        </h3>
        <p className="reveal" style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--grey)', marginBottom: '24px' }}>
          We&apos;re happy to help with any questions about pricing, availability, or facilities.
        </p>
        <a href="mailto:hello@gustohouse.co.uk" className="reveal" style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--green)',
          textDecoration: 'none',
        }}>
          hello@gustohouse.co.uk
        </a>
      </div>
    </>
  );
}
