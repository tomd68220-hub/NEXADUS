'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
    }
  }

  async function handleOAuth(provider: 'google' | 'azure' | 'linkedin_oidc') {
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}` },
    });
    if (error) setError(error.message);
  }

  const gridPattern = `repeating-linear-gradient(
    0deg,
    transparent,
    transparent 39px,
    rgba(255,255,255,0.025) 39px,
    rgba(255,255,255,0.025) 40px
  ),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 39px,
    rgba(255,255,255,0.025) 39px,
    rgba(255,255,255,0.025) 40px
  )`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        backgroundImage: gridPattern,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--dark)', fontWeight: 800, fontSize: '1rem' }}>G</span>
            </div>
            <span style={{ color: 'var(--light)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.1em' }}>
              GUSTO HOUSE
            </span>
          </div>
          <p style={{ color: 'var(--grey)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Member Portal
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--dark2)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '48px 40px',
        }}>
          <p className="overline" style={{ marginBottom: '12px' }}>Welcome Back</p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '36px', lineHeight: 1.2, color: 'var(--light)' }}>
            Sign in to your account
          </h1>

          {error && (
            <div style={{
              background: 'rgba(255,80,80,0.1)',
              border: '1px solid rgba(255,80,80,0.25)',
              color: '#ff6b6b',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '28px' }}>
              <Link
                href="/auth/forgot-password"
                style={{
                  color: 'var(--grey)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'var(--grey)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleOAuth('google')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>G</span>
              Continue with Google
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleOAuth('azure')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>M</span>
              Continue with Microsoft
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleOAuth('linkedin_oidc')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>in</span>
              Continue with LinkedIn
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleOAuth('azure')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Az</span>
              Continue with Azure AD
            </button>
          </div>
        </div>

        {/* Footer link */}
        <p style={{
          textAlign: 'center',
          marginTop: '28px',
          color: 'var(--grey)',
          fontSize: '0.78rem',
          letterSpacing: '0.06em',
        }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}
          >
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--grey)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading...</span>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
