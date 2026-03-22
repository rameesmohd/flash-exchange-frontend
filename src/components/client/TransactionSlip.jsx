// components/TransactionSlip.jsx
// Replace the old TransactionSlip in ExchangeHistory.jsx with this.
// Import ReceiptSelector instead of the old inline ReceiptPreview.
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DownloadIcon, Share2 } from 'lucide-react';
import ReceiptSelector from './receipts/ReceiptSelector';

/* ══════════════════════════════════════════════════════════════════
   Canvas download — only used for download/share (never shown).
   The canvas renderer picks the same design logic as the JSX preview.
   For simplicity we render the JSX into a hidden div, then use
   html2canvas (add: npm i html2canvas) to screenshot it at 3x.
   This way we never need to maintain two separate drawing paths.
══════════════════════════════════════════════════════════════════ */

async function renderReceiptToBlob(order) {
  // Lazy-import html2canvas so it doesn't bloat the main bundle
  const { default: html2canvas } = await import('html2canvas');

  // Create a hidden host
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-9999px;top:0;width:360px;background:#fff;z-index:-1;';
  document.body.appendChild(host);

  // Render the JSX receipt into it via a temporary React root
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(host);

  await new Promise(resolve => {
    root.render(<ReceiptSelector order={order} />);
    // Give React one tick to paint
    setTimeout(resolve, 120);
  });

  const canvas = await html2canvas(host, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#fff',
    logging: false,
  });

  root.unmount();
  document.body.removeChild(host);

  return new Promise(res => canvas.toBlob(res, 'image/png', 1));
}

/* ── Styles ── */
const STYLES = `
.slip-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:2000; display:flex; align-items:flex-end; justify-content:center; animation:slipFadeIn .2s ease; }
@keyframes slipFadeIn { from{opacity:0} to{opacity:1} }
@media (min-width:540px) { .slip-backdrop { align-items:center; padding:20px; } }
.slip-sheet { width:100%; max-width:420px; background:#f8fafc; border-radius:22px 22px 0 0; max-height:88vh; display:flex; flex-direction:column; box-shadow:0 -4px 30px rgba(0,0,0,.15); animation:sheetUp .28s cubic-bezier(.32,1,.4,1); overflow:hidden; }
@keyframes sheetUp { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
@media (min-width:540px) { .slip-sheet { border-radius:22px; animation:slipFadeIn .2s ease; box-shadow:0 20px 60px rgba(0,0,0,.22); } }
.slip-topbar { flex-shrink:0; display:flex; align-items:center; justify-content:center; padding:10px 16px 4px; background:#f8fafc; }
.slip-handle { width:36px; height:4px; background:#e2e8f0; border-radius:99px; }
@media (min-width:540px) { .slip-handle { display:none; } }
.slip-scroll { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:8px 16px 0; }
.slip-actions { flex-shrink:0; display:flex; gap:8px; padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px)); background:#f8fafc; border-top:1px solid #e2e8f0; }
.slip-act-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:11px 0; border-radius:11px; border:none; cursor:pointer; font-size:13px; font-weight:700; transition:opacity .15s, background .15s; -webkit-tap-highlight-color:transparent; }
.slip-act-btn:disabled { opacity:.5; cursor:not-allowed; }
.slip-act-btn:active:not(:disabled) { opacity:.78; }
.slip-act-dl { background:#0f172a; color:#fff; }
.slip-act-dl:hover:not(:disabled) { background:#1e293b; }
.slip-act-sh { background:#e2e8f0; color:#0f172a; }
.slip-act-sh:hover:not(:disabled) { background:#d1d5db; }
.slip-act-cl { background:#e2e8f0; color:#0f172a; max-width:80px; }
.slip-spin { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; flex-shrink:0; }
.slip-spin.dark { border-color:rgba(0,0,0,.12); border-top-color:#111; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

const TransactionSlip = ({ order, onClose }) => {
  const [busy, setBusy] = useState('');

  const getBlob = () => renderReceiptToBlob(order);

  const handleDownload = async () => {
    setBusy('dl');
    try {
      const blob = await getBlob();
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), {
        href: url, download: `receipt_${order.orderId}_${order.fund?.code || ''}.png`,
      });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch(e) { console.error(e); }
    finally { setBusy(''); }
  };

  const handleShare = async () => {
    setBusy('sh');
    try {
      const blob = await getBlob();
      const file = new File([blob], `receipt_${order.orderId}.png`, { type:'image/png' });
      if (navigator.canShare?.({ files:[file] })) {
        await navigator.share({ title:`Receipt #${order.orderId}`, files:[file] });
      } else if (navigator.share) {
        await navigator.share({ title:`Receipt #${order.orderId}`, text:`₹${Number(order.fiat).toLocaleString('en-IN')} — #${order.orderId}` });
      } else {
        await handleDownload(); return;
      }
    } catch(e) { if (e.name !== 'AbortError') console.error(e); }
    finally { setBusy(''); }
  };

  return ReactDOM.createPortal(
    <>
      <style>{STYLES}</style>
      <div className="slip-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="slip-sheet">
          <div className="slip-topbar">
            <div className="slip-handle"/>
          </div>

          {/* Preview — uses ReceiptSelector to pick the right template */}
          <div className="slip-scroll">
            <ReceiptSelector order={order} />
            <div style={{ height:12 }} />
          </div>

          <div className="slip-actions">
            <button className="slip-act-btn slip-act-dl" onClick={handleDownload} disabled={!!busy}>
              {busy==='dl'
                ? <><div className="slip-spin"/>Saving…</>
                : <><DownloadIcon size={14}/>Save</>}
            </button>
            <button className="slip-act-btn slip-act-sh" onClick={handleShare} disabled={!!busy}>
              {busy==='sh'
                ? <><div className="slip-spin dark"/>Preparing…</>
                : <><Share2 size={14}/>Share</>}
            </button>
            <button className="slip-act-btn slip-act-cl" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default TransactionSlip;