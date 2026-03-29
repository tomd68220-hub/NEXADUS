'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
};

function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getStrengthLabel(score: number): { label: string; color: string } {
  if (score <= 1) return { label: 'Weak', color: '#ff6b6b' };
  if (score <= 2) return { label: 'Fair', color: '#ffa94d' };
  if (score <= 3) return { label: 'Good', color: '#c0db26' };
  return { label: 'Strong', color: '#51cf66' };
}

export default function RegisterPage() {
  const supabase = createClient();

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(passwordStrength);

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({
        ...prev,
        [field]: field === 'agreedToTerms' ? e.target.checked : e.target.value,
      }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.agreedToTerms) {
      setError('You must agree to the Terms of Use and Privacy Policy.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          company: form.company || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        company: form.company || null,
        role: 'external',
        studio_access: false,
        anytime_access: false,
        is_suspended: false,
      });
    }

    setLoading(false);
    setSuccess(true);
  }

  async function handleOAuth(provider: 'google' | 'azure' | 'linkedin_oidc') {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
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

  if (success) {
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
        <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          <div style={{
            background: 'var(--dark2)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '48px 40px',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(192,219,38,0.12)',
              border: '1px solid rgba(192,219,38,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '1.5rem',
            }}>
              ✓
            </div>
            <p className="overline" style={{ marginBottom: '12px' }}>Account Created</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--light)', marginBottom: '16px' }}>
              Check your email
            </h2>
            <p style={{ color: 'var(--grey)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '32px' }}>
              We&apos;ve sent a confirmation link to <strong style={{ color: 'var(--light)' }}>{form.email}</strong>.
              Please click the link to activate your account and start using Gusto House.
            </p>
            <Link href="/auth/signin" className="btn-primary" style={{ justifyContent: 'center' }}>
              Back to Sign In →
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      <div style={{ width: '100%', maxWidth: '480px' }}>

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
          <p className="overline" style={{ marginBottom: '12px' }}>Get Started</p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '36px', lineHeight: 1.2, color: 'var(--light)' }}>
            Create your account
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

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  placeholder="Jane"
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  placeholder="Smith"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="company">Company (Optional)</label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={handleChange('company')}
                placeholder="Your organisation"
                autoComplete="organization"
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Minimum 8 characters"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Password strength */}
            {form.password && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '3px',
                        background: i <= passwordStrength ? strengthColor : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.68rem', color: strengthColor, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {strengthLabel}
                </span>
              </div>
            )}

            <div style={{ marginBottom: '28px' }}>
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Repeat your password"
                required
                autoComplete="new-password"
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ color: '#ff6b6b', fontSize: '0.72rem', marginTop: '6px', letterSpacing: '0.04em' }}>
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '32px' }}>
              <input
                id="terms"
                type="checkbox"
                checked={form.agreedToTerms}
                onChange={handleChange('agreedToTerms')}
                style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px', cursor: 'pointer' }}
              />
              <label
                htmlFor="terms"
                style={{ fontSize: '0.75rem', color: 'var(--grey)', textTransform: 'none', letterSpacing: '0.02em', cursor: 'pointer', marginBottom: 0 }}
              >
                I agree to the{' '}
                <Link href="/terms" style={{ color: 'var(--green)', textDecoration: 'none' }}>Terms of Use</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: 'var(--green)', textDecoration: 'none' }}>Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'var(--grey)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              or sign up with
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
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}
          >
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
