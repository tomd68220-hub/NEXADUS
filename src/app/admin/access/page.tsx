'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';
import type { UserRole } from '@/types';

interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  access_hours: string;
  studio_access: boolean;
  anytime_access: boolean;
  is_suspended: boolean;
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'external', access_hours: '9–5', studio_access: false, anytime_access: false, is_suspended: false },
  { id: '2', name: 'James Wright', email: 'james@freelance.co.uk', role: 'internal', access_hours: '9–5', studio_access: true, anytime_access: false, is_suspended: false },
  { id: '3', name: 'Cheryl Roebuck', email: 'cheryl@purelyphysical.com', role: 'studio', access_hours: '8–18', studio_access: true, anytime_access: true, is_suspended: false },
  { id: '4', name: 'Tom Davis', email: 'tom@startupco.io', role: 'external', access_hours: '9–5', studio_access: false, anytime_access: false, is_suspended: true },
];

const ROLE_LABELS: Record<UserRole, string> = {
  external: 'External',
  internal: 'Internal',
  studio: 'Studio',
  admin: 'Admin',
};

export default function AccessControlPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  function toggleSuspend(id: string) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, is_suspended: !m.is_suspended } : m));
    const member = members.find(m => m.id === id);
    addToast(`${member?.name} has been ${member?.is_suspended ? 'unsuspended' : 'suspended'}.`, 'info');
  }

  function toggleStudio(id: string) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, studio_access: !m.studio_access } : m));
    const member = members.find(m => m.id === id);
    addToast(`Studio access ${member?.studio_access ? 'revoked for' : 'granted to'} ${member?.name}.`, 'success');
  }

  function toggleAnytime(id: string, val: boolean) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, anytime_access: val } : m));
  }

  function sendInvite() {
    if (!inviteEmail) return;
    addToast(`Invitation sent to ${inviteEmail}.`, 'success');
    setInviteEmail('');
    setShowInvite(false);
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div className="overline" style={{ marginBottom: '8px' }}>Member Management</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 200, color: 'var(--white)' }}>
            Access <strong style={{ fontWeight: 600 }}>Control</strong>
          </h2>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} className="btn-primary">
          + Invite New Member
        </button>
      </div>

      {showInvite && (
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flexGrow: 1 }}>
            <label>Invite by Email</label>
            <input
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--light)', fontFamily: 'Raleway, sans-serif', fontWeight: 300, padding: '12px 16px', outline: 'none', fontSize: '0.9rem' }}
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="member@email.com"
            />
          </div>
          <button onClick={sendInvite} className="btn-primary">Send Invite</button>
          <button onClick={() => setShowInvite(false)} className="btn-secondary">Cancel</button>
        </div>
      )}

      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Member', 'Role', 'Access Hours', 'Studio Access', '9–5 Override', 'Actions'].map(h => (
                <th key={h} style={{ padding: '16px 20px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: member.is_suspended ? 0.5 : 1 }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--white)' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 300, color: 'var(--grey)' }}>{member.email}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 10px',
                    background: member.role === 'admin' ? 'rgba(192,219,38,0.15)' : 'rgba(255,255,255,0.06)',
                    color: member.role === 'admin' ? 'var(--green)' : 'var(--grey)',
                  }}>
                    {ROLE_LABELS[member.role]}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 300, color: 'var(--grey)' }}>{member.access_hours}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: member.studio_access ? 'var(--green)' : 'var(--grey)' }}>
                    {member.studio_access ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <Toggle checked={member.anytime_access} onChange={v => toggleAnytime(member.id, v)} />
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => toggleStudio(member.id)}
                      style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--grey)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                      Studio
                    </button>
                    <button
                      onClick={() => toggleSuspend(member.id)}
                      style={{
                        padding: '6px 12px', background: 'transparent',
                        border: `1px solid ${member.is_suspended ? 'rgba(192,219,38,0.3)' : 'rgba(255,80,80,0.3)'}`,
                        color: member.is_suspended ? 'var(--green)' : '#ff6b6b',
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      {member.is_suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
