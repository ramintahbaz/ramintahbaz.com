'use client';
import { useState } from 'react';
import type { CSSProperties } from 'react';

type Tab = 'overview' | 'disbursements' | 'recipients' | 'programs' | 'compliance';

const BATCHES = [
  { id: 'B-102', program: 'Utility Relief', payments: 2841, total: '$1,420,500', date: '3/7 9:14a', status: 'Complete' },
  { id: 'B-101', program: 'Rent Assistance', payments: 1204, total: '$963,200', date: '3/6 2:30p', status: 'Complete' },
  { id: 'B-100', program: 'Benefits', payments: 389, total: '$194,500', date: '3/6 10:05a', status: 'Complete' },
  { id: 'B-099', program: 'Utility Relief', payments: 3102, total: '$1,551,000', date: '3/5 11:48a', status: '3 ret.' },
  { id: 'B-098', program: 'Rent Assistance', payments: 892, total: '$713,600', date: '3/4 3:20p', status: 'Complete' },
];

const RECIPIENTS = [
  { id: 'RCP-00421', program: 'Utility Relief', lastPayment: 'Mar 7, 2025', amount: '$500', progress: '8/10', status: 'Active' },
  { id: 'RCP-00398', program: 'Rent Assistance', lastPayment: 'Mar 6, 2025', amount: '$800', progress: '3/6', status: 'Active' },
  { id: 'RCP-00284', program: 'Benefits', lastPayment: 'Mar 5, 2025', amount: '$250', progress: '12/12', status: 'Complete' },
  { id: 'RCP-00501', program: 'Utility Relief', lastPayment: 'Feb 28, 2025', amount: '$500', progress: '3/10', status: 'Review' },
];

const AUDIT_LOG = [
  { date: 'Mar 31', event: 'Q1 federal report submitted — accepted by HHS' },
  { date: 'Feb 28', event: 'Annual eligibility re-verification complete — 52,841 records' },
  { date: 'Feb 15', event: 'LIHEAP draw request #4 approved — $3.1M' },
  { date: 'Feb 3', event: 'State audit initiated — 120 records sampled' },
  { date: 'Jan 28', event: 'State audit closed — no findings' },
  { date: 'Jan 10', event: 'ERA program data exported to Treasury portal' },
];

const STATUS_COLOR: Record<string, string> = {
  Active: '#4ade80',
  Complete: 'rgba(255,255,255,0.4)',
  Review: '#facc15',
  'Near limit': '#f87171',
  'On track': '#4ade80',
};

const NAV: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'disbursements', label: 'Disbursements' },
  { id: 'recipients', label: 'Recipients' },
  { id: 'programs', label: 'Programs' },
  { id: 'compliance', label: 'Compliance' },
];

export function PromiseWebsiteDashboard() {
  const [tab, setTab] = useState<Tab>('overview');

  const cell: CSSProperties = {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    padding: '10px 12px',
    borderBottom: '1px solid #1A1A1E',
  };
  const th: CSSProperties = {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: 400,
    letterSpacing: '0.06em',
    borderBottom: '1px solid #1E2023',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        background: '#111114',
        border: '1px solid #2E3033',
        borderRadius: 10,
        overflow: 'hidden',
        fontFamily: 'var(--font-geist-sans), sans-serif',
        height: 420,
        minHeight: 420,
        maxHeight: 420,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    >
      {/* Sidebar — fixed column; nav scrolls inside if needed */}
      <div
        style={{
          width: 180,
          borderRight: '1px solid #1E2023',
          padding: '20px 12px',
          flexShrink: 0,
          minHeight: 0,
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', marginBottom: 20, paddingLeft: 10 }}>Promise</div>
        {NAV.map(n => (
          <button
            key={n.id}
            type="button"
            onClick={() => setTab(n.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left' as const,
              padding: '7px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontFamily: 'inherit',
              border: 'none',
              background: tab === n.id ? '#1E2023' : 'transparent',
              color: tab === n.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
              marginBottom: 2,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Content — scrolls inside the fixed-height shell (minHeight:0 is required for flex overflow) */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          padding: '20px 24px',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >

        {tab === 'overview' && (
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>California · Q1 2025</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Total distributed', value: '$18.4M', delta: '↑ 12% vs last quarter' },
                { label: 'Households reached', value: '52,841', delta: '↑ 8% vs last quarter' },
                { label: 'Avg. time to payment', value: '1.6d', delta: '↓ 0.4d faster' },
                { label: 'Payment success rate', value: '99.2%', delta: '↑ 0.3%' },
              ].map(k => (
                <div key={k.label} style={{ background: '#161619', borderRadius: 8, padding: '14px 16px', border: '1px solid #1E2023' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: 'white', letterSpacing: '-0.02em' }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>{k.delta}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.06em' }}>RECENT ACTIVITY</div>
            {[
              { msg: 'Batch #102 processed — 2,841 payments sent', time: '4 min ago' },
              { msg: '412 applications pending eligibility review', time: '31 min ago' },
              { msg: 'DHCS eligibility sync complete', time: '2 hr ago' },
              { msg: 'March program funds fully allocated — $6.2M', time: '5 hr ago' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '8px 0', borderBottom: '1px solid #1A1A1E' }}>
                <span>{a.msg}</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginLeft: 16 }}>{a.time}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'disbursements' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {[{ l: 'Sent this month', v: '$6.2M' }, { l: 'Payments processed', v: '18,204' }, { l: 'Failed / returned', v: '143' }].map(s => (
                <div key={s.l} style={{ background: '#161619', borderRadius: 8, padding: '12px 16px', border: '1px solid #1E2023', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: 'white', letterSpacing: '-0.02em' }}>{s.v}</div>
                </div>
              ))}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Batch ID', 'Program', 'Payments', 'Total', 'Sent', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {BATCHES.map(b => (
                  <tr key={b.id}>
                    <td style={{ ...cell, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, whiteSpace: 'nowrap' }}>{b.id}</td>
                    <td style={cell}>{b.program}</td>
                    <td style={cell}>{b.payments.toLocaleString()}</td>
                    <td style={cell}>{b.total}</td>
                    <td style={{ ...cell, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', fontSize: 11 }}>{b.date}</td>
                    <td style={{ ...cell, whiteSpace: 'nowrap' }}><span style={{ color: b.status === 'Complete' ? '#4ade80' : '#facc15' }}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'recipients' && (
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>52,841 total · Updated 2 hr ago</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['ID', 'Program', 'Last payment', 'Amount', 'Payments', 'Status'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {RECIPIENTS.map(r => (
                  <tr key={r.id}>
                    <td style={{ ...cell, fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>{r.id}</td>
                    <td style={cell}>{r.program}</td>
                    <td style={{ ...cell, color: 'rgba(255,255,255,0.4)' }}>{r.lastPayment}</td>
                    <td style={cell}>{r.amount}</td>
                    <td style={{ ...cell, color: 'rgba(255,255,255,0.4)' }}>{r.progress}</td>
                    <td style={cell}><span style={{ color: STATUS_COLOR[r.status] ?? 'white' }}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'programs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Utility Relief', sub: 'CA LIHEAP 2025', budget: '$12.5M', disbursed: '$8.9M', pct: 71, enrolled: '35,902', status: 'On track' },
              { name: 'Rent Assistance', sub: 'ERA 2025', budget: '$4.8M', disbursed: '$3.74M', pct: 78, enrolled: '4,672', status: 'Near limit' },
              { name: 'Benefits', sub: 'General assistance', budget: '$1.8M', disbursed: '$1.1M', pct: 61, enrolled: '4,402', status: 'Active' },
            ].map(p => (
              <div key={p.name} style={{ background: '#161619', borderRadius: 8, padding: '16px 18px', border: '1px solid #1E2023' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{p.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: STATUS_COLOR[p.status] ?? 'white' }}>{p.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 24, marginBottom: 10 }}>
                  {[{ l: 'Budget', v: p.budget }, { l: 'Disbursed', v: p.disbursed }, { l: 'Enrolled', v: p.enrolled }].map(s => (
                    <div key={s.l}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.l}</div>
                      <div style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#1E2023', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: p.pct > 75 ? '#facc15' : '#4ade80', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{p.pct}% utilized</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'compliance' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {[{ l: 'Payments auditable', v: '100%' }, { l: 'Compliance flags', v: '0' }, { l: 'Next report due', v: 'Mar 31' }].map(s => (
                <div key={s.l} style={{ background: '#161619', borderRadius: 8, padding: '12px 16px', border: '1px solid #1E2023', flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: s.l === 'Compliance flags' ? '#4ade80' : 'white', letterSpacing: '-0.02em' }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, letterSpacing: '0.06em' }}>AUDIT LOG · Q1 2025</div>
            {AUDIT_LOG.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, fontSize: 12, padding: '9px 0', borderBottom: '1px solid #1A1A1E' }}>
                <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11 }}>{e.date}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{e.event}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
