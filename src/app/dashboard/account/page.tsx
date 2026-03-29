'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';

export default function AccountPage() {
  const { profile, user } = useAuth();
  const supabase = createClient();
  const { toasts, addToast, removeToast } = useToast();

  const [profileForm, setProfileForm] = useState({
    first_name: '', last_name: '', phone: '', company: '',
  });
  const [billingEmail, setBillingEmail] = useState('');
  const [prefs, setPrefs] = useState({
    booking_confirmations: true,
    credit_reminders: true,
    promotional: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
      });
      setBillingEmail(profile.invoice_email || profile.email || '');
    }
  }, [profile]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ ...profileForm, updated_at: new Date().toISOString() })
      .eq('id', user?.id);
    setSaving(false);
    if (error) addToast('Failed to save profile.', 'error');
    else addToast('Profile updated successfully.', 'success');
  }

  async function savePreferences(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ invoice_email: billingEmail })
      .eq('id', user?.id);
    setSaving(false);
    if (error) addToast('Failed to save preferences.', 'error');
    else addToast('Preferences saved.', 'success');
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
      <div style={{ marginBottom: '40px' }}>
        <div className="overline" style={{ marginBottom: '8px' }}>Settings</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 200, color: 'var(--white)' }}>My Account</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Profile */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '32px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--white)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>Profile Information</h2>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>First Name</label>
                <input style={inputStyle} value={profileForm.first_name} onChange={e => setProfileForm(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div>
                <label>Last Name</label>
                <input style={inputStyle} value={profileForm.last_name} onChange={e => setProfileForm(p => ({ ...p, last_name: e.target.value }))} />
              </div>
            </div>
            <div>
              <label>Email Address</label>
              <input style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} value={user?.email || ''} readOnly />
              <p style={{ fontSize: '0.72rem', color: 'var(--grey)', marginTop: '6px', fontWeight: 300 }}>Email cannot be changed here.</p>
            </div>
            <div>
              <label>Phone Number</label>
              <input style={inputStyle} type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+44 7xxx xxxxxx" />
            </div>
            <div>
              <label>Company / Organisation</label>
              <input style={inputStyle} value={profileForm.company} onChange={e => setProfileForm(p => ({ ...p, company: e.target.value }))} placeholder="Optional" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '32px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--white)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>Preferences</h2>
          <form onSubmit={savePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label>Billing Email</label>
              <input style={inputStyle} type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} placeholder="invoices@yourcompany.com" />
              <p style={{ fontSize: '0.72rem', color: 'var(--grey)', marginTop: '6px', fontWeight: 300 }}>Invoices will be sent to this address. Defaults to your account email.</p>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '16px' }}>Communication Preferences</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Toggle
                  checked={prefs.booking_confirmations}
                  onChange={v => setPrefs(p => ({ ...p, booking_confirmations: v }))}
                  label="Booking confirmations"
                />
                <Toggle
                  checked={prefs.credit_reminders}
                  onChange={v => setPrefs(p => ({ ...p, credit_reminders: v }))}
                  label="Credit expiry reminders"
                />
                <Toggle
                  checked={prefs.promotional}
                  onChange={v => setPrefs(p => ({ ...p, promotional: v }))}
                  label="Promotional emails"
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.2)', padding: '32px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#ff6b6b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>Danger Zone</h2>
        <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--grey)', lineHeight: 1.7, marginBottom: '20px' }}>
          Permanently delete your account and all associated data. This action cannot be undone. Any remaining pass balances will be forfeited.
        </p>
        <button
          onClick={() => confirm('Are you sure? This cannot be undone.') && addToast('Please contact us to delete your account.', 'info')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,80,80,0.4)',
            color: '#ff6b6b',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '12px 24px',
            cursor: 'pointer',
          }}
        >
          Delete Account
        </button>
      </div>
    </>
  );
}
