'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const TABS = [
  { href: '/staff/bookings', label: 'Bookings & Calendar' },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '8px', height: '8px', background: 'var(--green)', animation: 'pulse 1s infinite' }} />
      </div>
    );
  }

  if (profile && !['internal', 'studio', 'admin'].includes(profile.role)) {
    return (
      <div style={{ paddingTop: '72px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="overline" style={{ marginBottom: '12px' }}>Access Denied</p>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--light)', marginBottom: '12px' }}>Staff Area</h2>
          <p style={{ color: 'var(--grey)', fontSize: '0.88rem' }}>You need a staff account to access this area.</p>
          <Link href="/dashboard" className="btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh' }}>
      <div style={{ background: 'var(--dark2)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ padding: '32px 0 0' }}>
            <div className="overline" style={{ marginBottom: '8px' }}>Staff Portal</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 200, color: 'var(--white)', marginBottom: '24px' }}>
              Gusto House <strong style={{ fontWeight: 600 }}>Staff</strong>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map(tab => {
              const active = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '16px 28px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--green)' : 'var(--grey)',
                    borderBottom: active ? '2px solid var(--green)' : '2px solid transparent',
                    cursor: 'pointer',
                    marginBottom: '-1px',
                  }}>
                    {tab.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px' }}>
        {children}
      </div>
    </div>
  );
}
