'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Usage Tracker',
    href: '/dashboard/usage',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12L5 7L8 9L12 4L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M1 15H15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Bookings',
    href: '/dashboard/bookings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="3" width="14" height="12" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 7H15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 1V5M11 1V5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'Billing Centre',
    href: '/dashboard/billing',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="3" width="14" height="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 7H15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 10H7" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: 'My Account',
    href: '/dashboard/account',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14C2 11.24 4.686 9 8 9C11.314 9 14 11.24 14 14" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/auth/signin?redirect=/dashboard');
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              background: 'var(--green)',
              margin: '0 auto 16px',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(1.5); }
            }
          `}</style>
          <p style={{ color: 'var(--grey)', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const userEmail = profile?.email || session.user.email || '';
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : userEmail;

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          background: 'var(--dark2)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '32px 28px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: 'var(--dark)', fontWeight: 800, fontSize: '0.9rem' }}>G</span>
            </div>
            <span style={{ color: 'var(--light)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.1em' }}>
              GUSTO HOUSE
            </span>
          </div>
          <p style={{
            fontSize: '0.64rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--grey)',
            marginLeft: '38px',
          }}>
            Member Portal
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 0' }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '13px 28px',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: active ? 600 : 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--dark)' : 'var(--grey)',
                  background: active ? 'var(--green)' : 'transparent',
                  transition: 'all 0.15s',
                  borderLeft: active ? 'none' : '2px solid transparent',
                }}
              >
                <span style={{ color: active ? 'var(--dark)' : 'var(--grey)', flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '0.04em', marginBottom: '2px' }}>
              {displayName}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--grey)', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </p>
          </div>
          <button
            onClick={signOut}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.68rem' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '40px',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
