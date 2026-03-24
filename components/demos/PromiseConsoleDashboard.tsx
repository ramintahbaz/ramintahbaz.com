'use client';

/** Replace with full dashboard markup when ready; iframe keeps styles isolated from the case study page. */
const DASHBOARD_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
  *{box-sizing:border-box}body{margin:0;font:13px/1.45 system-ui,sans-serif;background:#111114;color:rgba(255,255,255,.88);padding:20px}
  .shell{border:1px solid #2e3033;border-radius:10px;overflow:hidden;background:#111114}
  .bar{display:flex;gap:8px;padding:10px 14px;border-bottom:1px solid #1e2023;background:#161619;font-size:11px;color:rgba(255,255,255,.45)}
  .bar b{color:rgba(255,255,255,.75)}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:14px}
  .kpi{background:#161619;border:1px solid #1e2023;border-radius:6px;padding:10px 12px}
  .kpi .l{font-size:10px;color:rgba(255,255,255,.4);margin-bottom:4px}
  .kpi .v{font-size:17px;font-weight:500;color:#fff}
</style></head><body><div class="shell"><div class="bar"><b>Promise Console</b><span>·</span><span>Account</span><span>Payments</span><span>Compliance</span></div><div class="grid">
  <div class="kpi"><div class="l">Plan status</div><div class="v">Active</div></div>
  <div class="kpi"><div class="l">Next installment</div><div class="v">Mar 14</div></div>
  <div class="kpi"><div class="l">Ledger balance</div><div class="v">$1,240.00</div></div>
  <div class="kpi"><div class="l">ACH</div><div class="v">Scheduled</div></div>
</div></div><p style="margin:12px 14px 16px;font-size:11px;color:rgba(255,255,255,.35)">Placeholder — paste full dashboard HTML into DASHBOARD_HTML in PromiseConsoleDashboard.tsx</p></body></html>`;

export default function PromiseConsoleDashboard() {
  return (
    <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <iframe title="Promise Console dashboard" srcDoc={DASHBOARD_HTML} style={{ width: '100%', height: 680, border: 'none', display: 'block' }} />
    </div>
  );
}
