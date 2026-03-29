'use client';

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '12px' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 200, color: 'var(--green)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', fontWeight: 300, color: 'var(--grey)', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, label }: { data: { label: string; value: number; max: number }[]; label: string }) {
  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '20px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '120px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--grey)', fontWeight: 600 }}>{d.value}</div>
            <div
              className="chart-bar"
              style={{ width: '100%', height: `${(d.value / d.max) * 100}%`, minHeight: '4px' }}
            />
            <div style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grey)', textAlign: 'center' }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SPACES = [
  { key: 'Training Room', stats: [{ label: 'Bookings This Month', value: '12' }, { label: 'Revenue (MTD)', value: '£1,785' }, { label: 'Avg Delegates', value: '8' }, { label: 'Utilisation', value: '68%' }], chart1: [{ label: 'Mon', value: 8, max: 14 }, { label: 'Tue', value: 12, max: 14 }, { label: 'Wed', value: 6, max: 14 }, { label: 'Thu', value: 10, max: 14 }, { label: 'Fri', value: 14, max: 14 }] },
  { key: 'Co-working', stats: [{ label: 'Passes Sold (MTD)', value: '87' }, { label: 'Revenue (MTD)', value: '£1,044' }, { label: 'Unique Members', value: '34' }, { label: 'Avg Daily Occupancy', value: '11' }], chart1: [{ label: 'Mon', value: 11, max: 20 }, { label: 'Tue', value: 14, max: 20 }, { label: 'Wed', value: 9, max: 20 }, { label: 'Thu', value: 13, max: 20 }, { label: 'Fri', value: 8, max: 20 }] },
  { key: 'Meeting Room', stats: [{ label: 'Bookings This Month', value: '28' }, { label: 'Revenue (MTD)', value: '£390' }, { label: 'Avg Duration', value: '2.4 hrs' }, { label: 'Peak Time', value: '10:00–12:00' }], chart1: [{ label: '9', value: 3, max: 6 }, { label: '10', value: 6, max: 6 }, { label: '11', value: 5, max: 6 }, { label: '12', value: 2, max: 6 }, { label: '14', value: 4, max: 6 }, { label: '15', value: 3, max: 6 }] },
  { key: 'Studio', stats: [{ label: 'Enquiries (MTD)', value: '9' }, { label: 'Confirmed Hours', value: '42 hrs' }, { label: 'Revenue (MTD)', value: '£756' }, { label: 'Returning Clients', value: '5' }], chart1: [{ label: 'Mon', value: 3, max: 8 }, { label: 'Tue', value: 5, max: 8 }, { label: 'Wed', value: 8, max: 8 }, { label: 'Thu', value: 6, max: 8 }, { label: 'Fri', value: 4, max: 8 }] },
];

export default function AdminAnalyticsPage() {
  return (
    <>
      {/* Overall stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '48px' }}>
        <StatCard label="Total Revenue (MTD)" value="£3,975" sub="+12% vs last month" />
        <StatCard label="Active Members" value="47" sub="3 new this month" />
        <StatCard label="Avg Occupancy" value="64%" sub="Across all spaces" />
        <StatCard label="Bookings This Month" value="131" sub="Training + Meeting rooms" />
      </div>

      {/* Overall charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '64px' }}>
        <BarChart
          label="Revenue by Space (£)"
          data={[
            { label: 'Training', value: 178, max: 200 },
            { label: 'Co-work', value: 104, max: 200 },
            { label: 'Meeting', value: 39, max: 200 },
            { label: 'Studio', value: 75, max: 200 },
          ]}
        />
        <BarChart
          label="Peak Booking Hours"
          data={[
            { label: '9', value: 12, max: 25 },
            { label: '10', value: 25, max: 25 },
            { label: '11', value: 21, max: 25 },
            { label: '12', value: 14, max: 25 },
            { label: '13', value: 8, max: 25 },
            { label: '14', value: 18, max: 25 },
            { label: '15', value: 15, max: 25 },
            { label: '16', value: 9, max: 25 },
          ]}
        />
        <BarChart
          label="Monthly Revenue Trend (£k)"
          data={[
            { label: 'Oct', value: 28, max: 50 },
            { label: 'Nov', value: 31, max: 50 },
            { label: 'Dec', value: 22, max: 50 },
            { label: 'Jan', value: 34, max: 50 },
            { label: 'Feb', value: 38, max: 50 },
            { label: 'Mar', value: 40, max: 50 },
          ]}
        />
      </div>

      {/* Per-space sections */}
      {SPACES.map((space, si) => (
        <div key={si} style={{ marginBottom: '64px' }}>
          <div className="overline" style={{ marginBottom: '20px' }}>{space.key}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }}>
            {space.stats.map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <BarChart label={`${space.key} — Weekday Activity`} data={space.chart1} />
            <BarChart
              label={`${space.key} — Monthly Revenue (£)`}
              data={[
                { label: 'Nov', value: 60, max: 200 },
                { label: 'Dec', value: 45, max: 200 },
                { label: 'Jan', value: 80, max: 200 },
                { label: 'Feb', value: 95, max: 200 },
                { label: 'Mar', value: 110, max: 200 },
              ]}
            />
          </div>
        </div>
      ))}
    </>
  );
}
