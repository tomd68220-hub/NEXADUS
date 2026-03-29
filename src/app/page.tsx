'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/types';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animation observer
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Hero scale on load
    if (heroRef.current) {
      heroRef.current.style.transform = 'scale(1.05)';
      heroRef.current.style.transition = 'transform 1.8s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => {
        if (heroRef.current) heroRef.current.style.transform = 'scale(1)';
      }, 100);
    }
  }, []);

  const spaces = [
    {
      name: 'Training Room',
      description: 'Up to 14 delegates. Full AV, video conferencing, tea & coffee.',
      price: '£105',
      unit: 'half-day',
      image: IMAGES.trainingRoom,
      href: '/book',
    },
    {
      name: 'Co-working Hot Desk',
      description: 'Flexible desk access. 9–5 weekdays. No advance booking needed.',
      price: 'From £8',
      unit: 'per day',
      image: IMAGES.coworking,
      href: '/cowork',
    },
    {
      name: 'Meeting Room',
      description: 'Up to 6 people. Quiet, focused space with tea & coffee.',
      price: '£15',
      unit: 'per hour',
      image: IMAGES.meetingRoom,
      href: '/book',
    },
    {
      name: 'Gusto House Studio',
      description: 'Versatile community studio. Classes, workshops, events & more.',
      price: '£18+VAT',
      unit: 'per hour',
      image: IMAGES.studio,
      href: '/studio',
    },
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Instant Reservations',
      desc: 'Book training rooms and meeting spaces online, instantly. No waiting, no back-and-forth.',
    },
    {
      icon: '🎟',
      title: 'Flexible Credit Bundles',
      desc: 'Purchase co-working pass bundles that fit your usage. Valid for 45 days.',
    },
    {
      icon: '🕘',
      title: '9–5 Weekday Access',
      desc: 'Productive hours in a calm, professional environment, Monday through Friday.',
    },
    {
      icon: '🌿',
      title: 'Calm Surroundings',
      desc: 'Set in the Collingham countryside — a productive escape from city noise.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 48px 80px',
      }}>
        <div ref={heroRef} style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={IMAGES.hero}
            alt="Gusto House"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.4) 50%, rgba(26,26,26,0.2) 100%)',
        }} />

        <div style={{ position: 'relative', maxWidth: '680px' }}>
          <div className="overline" style={{ marginBottom: '24px' }}>
            Workspace & Studio — Collingham, Nottinghamshire
          </div>
          <h1 style={{
            fontSize: 'clamp(2.4rem,5vw,4rem)',
            fontWeight: 200,
            lineHeight: 1.1,
            color: 'var(--white)',
            marginBottom: '24px',
          }}>
            A cutting-edge workspace and{' '}
            <strong style={{ fontWeight: 600 }}>thriving community</strong>
          </h1>
          <p style={{
            fontSize: '1rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
            marginBottom: '36px',
            maxWidth: '520px',
          }}>
            Purpose-built workspaces, flexible co-working, and a versatile studio — all in the heart of Collingham. Work smarter, connect locally, grow together.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/book" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Book a Space</button>
            </Link>
            <Link href="/cowork" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">View Co-working</button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '48px',
          right: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}>
            Scroll
          </span>
          <div style={{
            width: '1px',
            height: '60px',
            background: 'rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '40%',
              background: 'var(--green)',
              animation: 'scrollLine 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollLine {
          0% { top: -40%; }
          100% { top: 140%; }
        }
      `}</style>

      {/* Features Grid */}
      <section className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '56px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>Why Gusto House</div>
            <h2 style={{
              fontSize: 'clamp(2rem,4vw,3.2rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
            }}>
              Everything you need to{' '}
              <strong style={{ fontWeight: 600 }}>work well</strong>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {features.map((f, i) => (
              <div key={i} className="reveal" style={{
                background: 'var(--dark2)',
                padding: '40px 32px',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--white)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  color: 'var(--grey)',
                  lineHeight: 1.7,
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal" style={{ marginBottom: '48px' }}>
            <div className="overline" style={{ marginBottom: '16px' }}>Our Spaces</div>
            <h2 style={{
              fontSize: 'clamp(2rem,4vw,3.2rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
            }}>
              Four distinct spaces,{' '}
              <strong style={{ fontWeight: 600 }}>one community</strong>
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {spaces.map((space, i) => (
              <Link key={i} href={space.href} style={{ textDecoration: 'none' }}>
                <div className="reveal img-hover" style={{
                  background: 'var(--dark2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.7s var(--ease)' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.1) 60%)',
                    }} />
                  </div>
                  <div style={{ padding: '28px 32px', position: 'relative' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px',
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--white)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}>
                        {space.name}
                      </h3>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: 'var(--green)',
                        }}>
                          {space.price}
                        </div>
                        <div style={{
                          fontSize: '0.68rem',
                          fontWeight: 500,
                          color: 'var(--grey)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}>
                          {space.unit}
                        </div>
                      </div>
                    </div>
                    <p style={{
                      fontSize: '0.84rem',
                      fontWeight: 300,
                      color: 'var(--grey)',
                      lineHeight: 1.6,
                    }}>
                      {space.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '20px',
                      color: 'var(--green)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}>
                      View Space
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About + How it works */}
      <section className="section" style={{ background: 'var(--dark2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
          <div className="reveal">
            <div className="overline" style={{ marginBottom: '20px' }}>About Gusto House</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
              fontWeight: 200,
              color: 'var(--white)',
              lineHeight: 1.2,
              marginBottom: '24px',
            }}>
              More than a workspace —{' '}
              <strong style={{ fontWeight: 600 }}>a community hub</strong>
            </h2>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.8,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <p>
                Gusto House is a purpose-built workspace and community venue nestled in the village of Collingham, Nottinghamshire. Designed with both focus and flexibility in mind, it's a place where professionals, freelancers, and local organisations come together.
              </p>
              <p>
                From productive co-working sessions to full-day training events and studio hire, Gusto House provides the space and amenities you need — with the calm of the Nottinghamshire countryside right outside your window.
              </p>
              <p>
                On-site you'll find The Allotment Deli & Kitchen café, a gym, and regular exercise classes — making it more than just a workspace.
              </p>
            </div>
          </div>

          <div className="reveal">
            <div className="overline" style={{ marginBottom: '20px' }}>How It Works</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { step: '01', title: 'Create an account', desc: 'Sign up in minutes — no subscription, no commitment.' },
                { step: '02', title: 'Choose your space', desc: 'Browse co-working passes or book a training or meeting room.' },
                { step: '03', title: 'Pay securely online', desc: 'Stripe-powered checkout with invoice generated automatically.' },
                { step: '04', title: 'Turn up and work', desc: 'Walk in during 9–5 weekday hours and make the most of it.' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '24px',
                  padding: '28px 0',
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: 'var(--green)',
                    paddingTop: '3px',
                    flexShrink: 0,
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--white)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '6px',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '0.84rem',
                      fontWeight: 300,
                      color: 'var(--grey)',
                      lineHeight: 1.6,
                    }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            {[
              { value: '4', label: 'Distinct Spaces' },
              { value: '45', label: 'Day Credit Window' },
              { value: '14', label: 'People Max Capacity' },
              { value: '9–5', label: 'Mon–Fri Access' },
            ].map((stat, i) => (
              <div key={i} className="reveal" style={{
                background: 'var(--dark2)',
                padding: '48px 40px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 'clamp(2.5rem,5vw,4rem)',
                  fontWeight: 200,
                  color: 'var(--green)',
                  lineHeight: 1,
                  marginBottom: '12px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--grey)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: '80px 48px',
        background: 'var(--dark2)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div className="overline reveal" style={{ marginBottom: '20px' }}>Ready to get started?</div>
          <h2 className="reveal" style={{
            fontSize: 'clamp(2rem,4vw,3.2rem)',
            fontWeight: 200,
            color: 'var(--white)',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}>
            Your next great workday <strong style={{ fontWeight: 600 }}>starts here</strong>
          </h2>
          <div className="reveal" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Create Free Account</button>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">View Pricing</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
