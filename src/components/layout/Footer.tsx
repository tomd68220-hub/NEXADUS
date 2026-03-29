import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark2)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '64px 48px 40px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--white)',
                marginBottom: '4px',
              }}>
                Gusto House
              </div>
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--green)',
              }}>
                Workspace & Studio
              </div>
            </div>
            <p style={{
              fontSize: '0.85rem',
              fontWeight: 300,
              color: 'var(--grey)',
              lineHeight: 1.7,
              maxWidth: '280px',
            }}>
              A cutting-edge workspace and thriving community in the heart of Collingham, Nottinghamshire.
            </p>
            <div style={{
              marginTop: '20px',
              fontSize: '0.78rem',
              fontWeight: 300,
              color: 'var(--grey)',
              lineHeight: 1.8,
            }}>
              <div>Green Way</div>
              <div>Collingham</div>
              <div>Nottinghamshire</div>
              <div>NG23 7DX</div>
            </div>
          </div>

          {/* Spaces */}
          <div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              marginBottom: '20px',
            }}>
              Spaces
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/cowork', label: 'Co-working Hot Desk' },
                { href: '/book', label: 'Training Room' },
                { href: '/book', label: 'Meeting Room' },
                { href: '/studio', label: 'Gusto House Studio' },
                { href: '/pricing', label: 'Pricing' },
              ].map(link => (
                <Link key={link.label} href={link.href} style={{
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 300,
                  color: 'var(--grey)',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              marginBottom: '20px',
            }}>
              Account
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/auth/signin', label: 'Sign In' },
                { href: '/auth/register', label: 'Create Account' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/dashboard/bookings', label: 'My Bookings' },
                { href: '/dashboard/billing', label: 'Billing' },
              ].map(link => (
                <Link key={link.label} href={link.href} style={{
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 300,
                  color: 'var(--grey)',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--green)',
              marginBottom: '20px',
            }}>
              Legal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Use' },
                { href: '/cookies', label: 'Cookie Policy' },
              ].map(link => (
                <Link key={link.label} href={link.href} style={{
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 300,
                  color: 'var(--grey)',
                  transition: 'color 0.2s',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 300,
            color: 'var(--mid)',
          }}>
            © {new Date().getFullYear()} Gusto House. All rights reserved.
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--mid)',
          }}>
            Collingham, Nottinghamshire
          </span>
        </div>
      </div>
    </footer>
  );
}
