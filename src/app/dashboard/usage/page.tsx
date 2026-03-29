'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import type { PassBalance } from '@/types';

interface UsageLogEntry {
  id: string;
  used_at: string;
  pass_type: 'full_day' | 'half_day';
  space_type: string;
  duration: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function PassBar({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)' }}>
          {label}
        </p>
        <span style={{ fontSize: '0.78rem', color: 'var(--light)', fontWeight: 500 }}>
          {used} of {total} passes used
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: 'var(--green)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--grey)', letterSpacing: '0.08em' }}>
          {used} used
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--grey)', letterSpacing: '0.08em' }}>
          {total - used} remaining
        </span>
      </div>
    </div>
  );
}

export default function UsagePage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [fullDayUsed, setFullDayUsed] = useState(0);
  const [fullDayTotal, setFullDayTotal] = useState(0);
  const [halfDayUsed, setHalfDayUsed] = useState(0);
  const [halfDayTotal, setHalfDayTotal] = useState(0);
  const [usageLog, setUsageLog] = useState<UsageLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);

      const [balancesRes, logRes] = await Promise.all([
        supabase
          .from('pass_balances')
          .select('*')
          .eq('user_id', user!.id),
        supabase
          .from('pass_usage_log')
          .select('*')
          .eq('user_id', user!.id)
          .order('used_at', { ascending: false }),
      ]);

      if (balancesRes.data) {
        let fdUsed = 0, fdTotal = 0, hdUsed = 0, hdTotal = 0;
        (balancesRes.data as PassBalance[]).forEach(b => {
          if (b.pass_type === 'full_day') {
            fdUsed += b.used_passes;
            fdTotal += b.total_passes;
          } else {
            hdUsed += b.used_passes;
            hdTotal += b.total_passes;
          }
        });
        setFullDayUsed(fdUsed);
        setFullDayTotal(fdTotal);
        setHalfDayUsed(hdUsed);
        setHalfDayTotal(hdTotal);
      }

      if (logRes.data) {
        setUsageLog(logRes.data as UsageLogEntry[]);
      }

      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="overline" style={{ marginBottom: '8px' }}>Member Portal</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '-0.01em' }}>
          Usage Tracker
        </h1>
      </div>

      {/* Pass Balance Bars */}
      <div style={{
        background: 'var(--dark2)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '32px',
        marginBottom: '24px',
      }}>
        <p className="overline" style={{ marginBottom: '24px' }}>Pass Balance</p>

        {loading ? (
          <div style={{ padding: '20px 0' }}>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', marginBottom: '32px' }} />
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
        ) : (
          <>
            <PassBar
              label="Full Day Passes"
              used={fullDayUsed}
              total={fullDayTotal}
            />
            <PassBar
              label="Half Day Passes"
              used={halfDayUsed}
              total={halfDayTotal}
            />
          </>
        )}

        {!loading && fullDayTotal === 0 && halfDayTotal === 0 && (
          <p style={{ color: 'var(--grey)', fontSize: '0.88rem', marginTop: '8px' }}>
            No passes purchased yet.{' '}
            <a href="/cowork" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
              Buy passes →
            </a>
          </p>
        )}
      </div>

      {/* Usage Log */}
      <div style={{
        background: 'var(--dark2)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p className="overline" style={{ marginBottom: '4px' }}>History</p>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--light)' }}>
            Pass Usage Log
          </h2>
        </div>

        {!loading && usageLog.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--grey)', fontSize: '0.88rem' }}>
              No pass usage recorded yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Pass Type', 'Space', 'Duration'].map(col => (
                    <th
                      key={col}
                      style={{
                        padding: '12px 32px',
                        textAlign: 'left',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--grey)',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usageLog.map((entry, i) => (
                  <tr
                    key={entry.id}
                    style={{
                      borderBottom: i < usageLog.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--light)' }}>
                      {formatDate(entry.used_at)}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--light)', textTransform: 'capitalize' }}>
                      {entry.pass_type.replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--grey)', textTransform: 'capitalize' }}>
                      {entry.space_type.replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '16px 32px', fontSize: '0.82rem', color: 'var(--grey)' }}>
                      {entry.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
