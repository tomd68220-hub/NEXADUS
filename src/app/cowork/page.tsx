'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES, FULL_DAY_BUNDLES, HALF_DAY_BUNDLES } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { AuthGateModal } from '@/components/ui/Modal';

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Buy a pass bundle',
    desc: 'Choose from single passes or multi-pass bundles. The more you buy, the less you pay per day.',
  },
  {
    num: '02',
    title: 'Turn up 9–5 weekdays',
    desc: 'Walk in any weekday between 9am and 5pm. No reservation required — just show up and get to work.',
  },
  {
    num: '03',
    title: 'No advance booking',
    desc: 'Hot desks are available on a first-come, first-served basis. Arrive, find a desk, and start.',
  },
  {
    num: '04',
    title: 'Use within 45 days',
    desc: 'All passes are valid for 45 days from purchase. Bundles can stack — top up before they expire.',
  },
];

const INCLUDED = [
  'High-speed WiFi',
  'Tea & coffee',
  'The Allotment Deli & Kitchen café onsite',
  'Onsite gym access',
  'Exercise classes',
  'Meeting room bookable separately',
  'Community events',
  'Professional calm environment',
];

const FAQS = [
  {
    q: 'Do I need to book in advance?',
    a: "No — co-working hot desks are walk-in only. Simply turn up between 9am and 5pm on any weekday and a desk will be available. No reservation, no fuss.",
  },
  {
    q: 'Can I stack multiple bundles?',
    a: 'Yes. You can purchase a new bundle at any time, even before your existing passes expire. All active passes are pooled together. Each bundle carries its own 45-day window from its purchase date.',
  },
  {
    q: 'What happens if my passes expire?',
    a: 'Any unused passes beyond the 45-day validity window expire automatically and are non-refundable. We recommend choosing a bundle size that matches your typical monthly usage.',
  },
  {
    q: 'Can I use half-day passes for a full day?',
    a: 'Half-day passes cover either the morning (9am–1pm) or afternoon (1pm–5pm) session. Two half-day passes can cover a full day, though a full-day pass purchased outright offers better value.',
  },
  {
    q: 'Is the meeting room included?',
    a: 'The meeting room is not included with co-working passes. It can be booked separately at £15/hr for the first 4 hours, then £10/hr thereafter, via the main booking page.',
  },
];

export default function CoworkPage() {
  const { session, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'full' | 'half'>('full');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const bundles = activeTab === 'full' ? FULL_DAY_BUNDLES : HALF_DAY_BUNDLES;

  function handlePurchase() {
    if (!session) {
      setAuthModalOpen(true);
    } else {
      window.location.href = '/dashboard/passes';
    }
  }

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        height: '60vh',
        minHeight: '480px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 48px 72px',
      }}>
        <Image
          src={IMAGES.coworkHero}
          alt="Co-working at Gusto House"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(26,26,26,0.94) 0%, rgba(26,26,26,0.55) 50%, rgba(26,26,26,0.2) 100%)',
        }} />
        <div style={{ position: 'relative', maxWidth: '700px' }}>
          <div className="overline" style={{ marginBottom: '20px' }}>Co-working Hot Desk</div>
          <h1 style={{
            fontSize: 'clamp(2.2rem,5vw,3.8rem)',
            fontWeight: 200,
            lineHeight: 1.1,
            color: 'var(--white)',
            marginBottom: '20px',
          }}>
            Work flexibly.{' '}
            <strong style={{ fontWeight: 600 }}>Pay only for what you use.</strong>
          </h1>
          <p style={{
            fontSize: '1rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.75,
            maxWidth: '520px',
            marginBottom: '36px',
          }}>
            No monthly commitments. No wasted days. Buy a pass bundle, turn up whenever you need to, and use your passes within 45 days — it really is that simple.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Pass Bundles
            </button>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">See All Pricing</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PASS BALANCE WIDGET (logged-in users only) ──────────────────── */}
      {!loading && session && (
        <section style={{ padding: '48px 48px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              border: '1px solid var(--green)',
              padding: '36px 40px',
              background: 'rgba(192,219,38,0.04)',
            }}>
              <div className="overline" style={{ marginBottom: '12px' }}>Your current pass balance</div>
              <p style={{
                fontSize: '0.84rem',
                fontWeight: 300,
                color: 'var(--grey)',
                marginBottom: '28px',
                lineHeight: 1.6,
              }}>
                45-day validity from purchase. Passes expire automatically after the validity window.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1px',
                background: 'rgba(255,255,255,0.06)',
              }}>
                {[
                  { label: 'Full Day passes remaining', count: '0' },
                  { label: 'Half Day passes remaining', count: '0' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'var(--dark2)', padding: '28px 32px' }}>
                    <div style={{
                      fontSize: 'clamp(2rem,4vw,3rem)',
                      fontWeight: 200,
                      color: 'var(--green)',
                      lineHeight: 1,
                      marginBottom: '8px',
                    }}>
                      {item.count}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--grey)',
                    }}>
                      {item.label}
                    </div>
                  </div>
                ))}
                <div style={{
                  background: 'var(--dark2)',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--grey)',
                    marginBottom: '8px',
                  }}>
                    Validity
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--light)' }}>
                    45-day validity from purchase
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '56px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>How It Works</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem,4vw,3rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
            }}>
              Four simple steps to{' '}
              <strong style={{ fontWeight: 600 }}>your ideal workday</strong>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="reveal" style={{ background: 'var(--dark2)', padding: '40px 32px' }}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: 'var(--green)',
                  marginBottom: '20px',
                }}>
                  {step.num}
                </div>
                <h3 style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.84rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark2)', paddingTop: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>What's Included</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem,4vw,3rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
            }}>
              Everything you need,{' '}
              <strong style={{ fontWeight: 600 }}>nothing you don't</strong>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {INCLUDED.map((item, i) => (
              <div key={i} className="reveal" style={{
                background: 'var(--dark)',
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--green)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 300, color: 'var(--light)', lineHeight: 1.5 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 45-DAY INFO PANEL ───────────────────────────────────────────── */}
      <section className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{
            background: 'rgba(192,219,38,0.06)',
            border: '1px solid rgba(192,219,38,0.2)',
            padding: '56px 48px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'start',
            }}>
              <div>
                <div className="overline" style={{ marginBottom: '20px' }}>45-Day Validity Window</div>
                <h2 style={{
                  fontSize: 'clamp(1.6rem,3vw,2.4rem)',
                  fontWeight: 200,
                  color: 'var(--white)',
                  lineHeight: 1.2,
                  marginBottom: '20px',
                }}>
                  Buy once, use at{' '}
                  <strong style={{ fontWeight: 600 }}>your own pace</strong>
                </h2>
                <p style={{
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.8,
                }}>
                  Every pass bundle you purchase is valid for 45 days from the date of purchase. Whether you work every day or just a handful of times a month, the validity window gives you real flexibility without pressure.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  {
                    title: 'Bundles can stack',
                    desc: "Run low before your 45 days are up? Simply purchase another bundle. Passes pool together and the new bundle carries its own 45-day window.",
                  },
                  {
                    title: 'No carry-over after expiry',
                    desc: 'Passes not used within 45 days of purchase expire automatically. We recommend choosing a bundle size matching your typical monthly attendance.',
                  },
                  {
                    title: 'Shared accounts coming soon',
                    desc: 'We are working on team accounts so organisations can purchase and manage passes for multiple team members under a single billing account.',
                  },
                ].map((point, i) => (
                  <div key={i} style={{ paddingLeft: '20px', borderLeft: '2px solid var(--green)' }}>
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--white)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}>
                      {point.title}
                    </div>
                    <p style={{ fontSize: '0.84rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.6 }}>
                      {point.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUNDLE PURCHASE SECTION ─────────────────────────────────────── */}
      <section id="bundles" className="section" style={{ background: 'var(--dark2)', paddingTop: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>Pass Bundles</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem,4vw,3rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
              marginBottom: '36px',
            }}>
              Choose your{' '}
              <strong style={{ fontWeight: 600 }}>pass bundle</strong>
            </h2>

            {/* Tab Toggle */}
            <div style={{
              display: 'inline-flex',
              border: '1px solid rgba(255,255,255,0.12)',
              marginBottom: '48px',
            }}>
              {(['full', 'half'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? 'var(--green)' : 'transparent',
                    color: activeTab === tab ? 'var(--dark)' : 'var(--grey)',
                    border: 'none',
                    padding: '12px 28px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s var(--ease)',
                  }}
                >
                  {tab === 'full' ? 'Full Day' : 'Half Day'}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {bundles.map((bundle, i) => {
              const isPopular = bundle.passes === 8;
              return (
                <div key={i} className="reveal" style={{
                  background: isPopular ? 'rgba(192,219,38,0.08)' : 'var(--dark)',
                  padding: '36px 28px',
                  position: 'relative',
                  border: isPopular ? '1px solid rgba(192,219,38,0.25)' : 'none',
                }}>
                  {isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      background: 'var(--green)',
                      color: 'var(--dark)',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      padding: '6px',
                    }}>
                      Most Popular
                    </div>
                  )}
                  <div style={{ paddingTop: isPopular ? '28px' : '0' }}>
                    <div style={{
                      fontSize: 'clamp(2rem,3vw,2.8rem)',
                      fontWeight: 200,
                      color: 'var(--green)',
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}>
                      {bundle.passes}
                    </div>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--grey)',
                      marginBottom: '24px',
                    }}>
                      {bundle.passes === 1 ? 'Pass' : 'Passes'}
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: 'var(--white)',
                      marginBottom: '4px',
                    }}>
                      £{bundle.price}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 400,
                      color: 'var(--grey)',
                      marginBottom: '28px',
                    }}>
                      £{bundle.perPass} per {activeTab === 'full' ? 'day' : 'session'}
                    </div>
                    <button
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={handlePurchase}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="reveal" style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.78rem',
            fontWeight: 300,
            color: 'var(--grey)',
            lineHeight: 1.6,
          }}>
            All passes valid for 45 days from purchase. Non-refundable and non-transferable. Access 9am–5pm Monday–Friday. Gym and café are on-site amenities subject to their own terms.
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ───────────────────────────────────────────────── */}
      <section className="section">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>FAQ</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem,4vw,3rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
            }}>
              Common questions,{' '}
              <strong style={{ fontWeight: 600 }}>straight answers</strong>
            </h2>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="reveal" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '28px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '24px',
                  }}
                >
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    color: openFaq === i ? 'var(--green)' : 'var(--white)',
                    lineHeight: 1.4,
                    transition: 'color 0.2s var(--ease)',
                    letterSpacing: '0.02em',
                  }}>
                    {faq.q}
                  </span>
                  <span style={{
                    color: 'var(--green)',
                    flexShrink: 0,
                    fontSize: '1.4rem',
                    lineHeight: 1,
                    transition: 'transform 0.3s var(--ease)',
                    display: 'inline-block',
                    transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{
                    paddingBottom: '28px',
                    fontSize: '0.88rem',
                    fontWeight: 300,
                    color: 'var(--grey)',
                    lineHeight: 1.8,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: '56px', textAlign: 'center' }}>
            <p style={{
              fontSize: '0.9rem',
              fontWeight: 300,
              color: 'var(--grey)',
              marginBottom: '24px',
            }}>
              Still have questions? We&apos;re happy to help.
            </p>
            <a href="mailto:hello@gustohouse.co.uk" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">Get in Touch</button>
            </a>
          </div>
        </div>
      </section>

      {/* Auth Gate Modal */}
      {authModalOpen && (
        <AuthGateModal
          onClose={() => setAuthModalOpen(false)}
          redirectPath="/cowork"
        />
      )}
    </>
  );
}
