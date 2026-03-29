'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import type { Invoice } from '@/types';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function BillingPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);

      const { data: invData } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user!.id)
        .order('issued_at', { ascending: false });

      if (invData) {
        const inv = invData as Invoice[];
        setInvoices(inv);
        const spent = inv.reduce((sum, i) => sum + i.total_inc_vat, 0);
        setTotalSpent(spent);
      }

      // Payment methods would come from a Stripe API route in production
      // For now we load from a profiles/payment_methods table if it exists
      const { data: pmData } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user!.id);

      if (pmData) setPaymentMethods(pmData as PaymentMethod[]);

      setLoading(false);
    }
    load();
  }, [user]);

  function handleRemoveCard(id: string) {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  }

  function handleAddCard() {
    // In production this would open a Stripe Elements modal
    alert('Add card functionality requires Stripe integration.');
  }

  function handleDownloadPDF(invoice: Invoice) {
    if (invoice.pdf_url) window.open(invoice.pdf_url, '_blank');
  }

  const statsData = [
    { label: 'Total Spent', value: `£${totalSpent.toFixed(2)}` },
    { label: 'Invoices Issued', value: String(invoices.length) },
    { label: 'Active Passes', value: '—' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p className="overline" style={{ marginBottom: '8px' }}>Member Portal</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--light)', letterSpacing: '-0.01em' }}>
          Billing Centre
        </h1>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: 'rgba(255,255,255,0.06)',
        marginBottom: '24px',
      }}>
        {statsData.map(stat => (
          <div
            key={stat.label}
            style={{
              background: 'var(--dark2)',
              padding: '28px 32px',
            }}
          >
            <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '10px' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--light)', letterSpacing: '-0.01em' }}>
              {loading ? '–' : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div style={{
        background: 'var(--dark2)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '24px',
      }}>
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p className="overline" style={{ marginBottom: '4px' }}>Saved</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--light)' }}>
              Payment Methods
            </h2>
          </div>
          <button
            className="btn-primary"
            onClick={handleAddCard}
            style={{ fontSize: '0.68rem', padding: '10px 18px' }}
          >
            + Add Card
          </button>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {!loading && paymentMethods.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <p style={{ color: 'var(--grey)', fontSize: '0.88rem' }}>
                No payment method saved
              </p>
              <button
                className="btn-secondary"
                onClick={handleAddCard}
                style={{ fontSize: '0.7rem', padding: '10px 18px' }}
              >
                Add Card →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentMethods.map(pm => (
                <div
                  key={pm.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '26px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--grey)', textTransform: 'uppercase' }}>
                        {pm.brand}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--light)', fontWeight: 500 }}>
                        {pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} ending {pm.last4}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--grey)', marginTop: '2px' }}>
                        Expires {pm.exp_month}/{pm.exp_year}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => handleRemoveCard(pm.id)}
                    style={{
                      fontSize: '0.64rem',
                      padding: '7px 14px',
                      borderColor: 'rgba(255,80,80,0.25)',
                      color: '#ff6b6b',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice History */}
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
            Invoice History
          </h2>
        </div>

        {!loading && invoices.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--grey)', fontSize: '0.88rem' }}>
              No invoices yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Invoice No.', 'Description', 'Date', 'Amount', 'PDF'].map((col, i) => (
                    <th
                      key={col}
                      style={{
                        padding: '12px 24px',
                        textAlign: i === 4 ? 'right' : 'left',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--grey)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, i) => (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom: i < invoices.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 24px', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {invoice.invoice_number}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--light)' }}>
                      {invoice.description}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--grey)', whiteSpace: 'nowrap' }}>
                      {formatDate(invoice.issued_at)}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.82rem', color: 'var(--light)', whiteSpace: 'nowrap' }}>
                      £{invoice.total_inc_vat.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => handleDownloadPDF(invoice)}
                        disabled={!invoice.pdf_url}
                        style={{
                          padding: '7px 14px',
                          fontSize: '0.64rem',
                          letterSpacing: '0.12em',
                          opacity: invoice.pdf_url ? 1 : 0.35,
                          cursor: invoice.pdf_url ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Download PDF
                      </button>
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
