'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, profile, signOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/cowork', label: 'Co-working' },
    { href: '/book', label: 'Book a Room' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/studio', label: 'Studio' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        transition: 'background 0.3s var(--ease), border-bottom 0.3s var(--ease)',
        background: scrolled ? 'rgba(26,26,26,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1,
        }}>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--white)',
          }}>
            Gusto House
          </span>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--green)',
          }}>
            Workspace & Studio
          </span>
        </div>
      </Link>

      {/* Centre nav links */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '36px',
      }} className="hidden md:flex">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              textDecoration: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: pathname === link.href ? 'var(--green)' : 'rgba(255,255,255,0.7)',
              transition: 'color 0.2s var(--ease)',
              paddingBottom: '2px',
              borderBottom: pathname === link.href ? '1px solid var(--green)' : '1px solid transparent',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {profile?.role === 'admin' && (
              <Link href="/admin" style={{
                textDecoration: 'none',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--green)',
              }}>
                Admin
              </Link>
            )}
            <Link href="/dashboard" style={{
              textDecoration: 'none',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)',
              transition: 'color 0.2s',
            }}>
              Dashboard
            </Link>
            <button
              onClick={signOut}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <Link href="/auth/signin" style={{
              textDecoration: 'none',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)',
              padding: '10px 18px',
              borderRight: '1px solid rgba(255,255,255,0.15)',
              transition: 'color 0.2s',
              whiteSpace: 'nowrap',
            }}>
              Sign In
            </Link>
            <Link href="/auth/register" style={{
              textDecoration: 'none',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--dark)',
              background: 'var(--green)',
              padding: '10px 18px',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
            }}>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
