'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface AuthGateModalProps {
  onClose: () => void;
  redirectPath?: string;
}

export function AuthGateModal({ onClose, redirectPath = '' }: AuthGateModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const params = redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--dark2)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '48px',
          maxWidth: '440px',
          width: '100%',
        }}
      >
        <div className="overline" style={{ marginBottom: '16px' }}>
          Account Required
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem,3vw,2rem)',
          fontWeight: 200,
          lineHeight: 1.2,
          marginBottom: '16px',
          color: 'var(--white)',
        }}>
          Sign in to <strong style={{ fontWeight: 600 }}>continue</strong>
        </h2>
        <p style={{
          fontSize: '0.9rem',
          fontWeight: 300,
          color: 'var(--grey)',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          You need an account to book a space or purchase co-working passes. It only takes a minute to get set up.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href={`/auth/register${params}`} style={{ textDecoration: 'none' }}>
            <button className="btn-primary btn-full" style={{ width: '100%' }}>
              Create Account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </button>
          </Link>
          <Link href={`/auth/signin${params}`} style={{ textDecoration: 'none' }}>
            <button className="btn-secondary btn-full" style={{ width: '100%' }}>
              Sign In
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </button>
          </Link>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--grey)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginTop: '20px',
            padding: '0',
            width: '100%',
            textAlign: 'center',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ onClose, children, title }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--dark2)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {title && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--white)',
              letterSpacing: '0.06em',
            }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--grey)',
                cursor: 'pointer',
                fontSize: '1.4rem',
                lineHeight: 1,
                padding: '0',
              }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
