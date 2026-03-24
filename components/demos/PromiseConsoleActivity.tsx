'use client';

const ACTIVITY_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
  *{box-sizing:border-box}body{margin:0;font:12px/1.5 system-ui,sans-serif;background:#111114;color:rgba(255,255,255,.82);padding:16px}
  h1{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0 0 12px}
  .row{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #1a1a1e;font-size:11px}
  .t{color:rgba(255,255,255,.28);flex-shrink:0;width:72px;font-family:ui-monospace,monospace}
  .m{color:rgba(255,255,255,.55)}
</style></head><body>
  <h1>Activity</h1>
  <div class="row"><span class="t">10:42a</span><span class="m">Webhook delivered — payment.confirmation</span></div>
  <div class="row"><span class="t">10:41a</span><span class="m">Ledger post — installment #4</span></div>
  <div class="row"><span class="t">10:39a</span><span class="m">Compliance screen — passed</span></div>
  <div class="row"><span class="t">10:38a</span><span class="m">ACH batch submitted</span></div>
  <p style="margin:14px 0 0;font-size:11px;color:rgba(255,255,255,.35)">Placeholder — paste Activity tab HTML into ACTIVITY_HTML in PromiseConsoleActivity.tsx</p>
</body></html>`;

export default function PromiseConsoleActivity() {
  return (
    <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      <iframe title="Promise Console activity" srcDoc={ACTIVITY_HTML} style={{ width: '100%', height: 860, border: 'none', display: 'block' }} />
    </div>
  );
}
