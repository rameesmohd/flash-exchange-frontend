import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Typography } from 'antd';
import { Image } from 'antd';
import { ArrowLeft, DownloadIcon, FileText, X, ChevronDown, Share2 } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import EmptyBox from '../common/EmptyBox';

const { Text } = Typography;

const STYLES = `
/* ── list ── */
.eh-list { display:flex; flex-direction:column; gap:10px; padding:4px 0 24px; }

/* ── card ── */
.eh-card {
  background:#fff;
  border:1px solid #f0f2f5;
  border-radius:12px;
  overflow:hidden;
  transition:box-shadow .18s, border-color .18s;
}
.eh-card:hover { box-shadow:0 2px 12px rgba(0,0,0,.07); border-color:#e4e8ee; }

/* ── main row ── */
.eh-main {
  display:flex;
  align-items:center;
  gap:10px;
  padding:12px 14px;
  cursor:pointer;
  user-select:none;
  -webkit-tap-highlight-color:transparent;
}

/* ── icon ── */
.eh-icon {
  flex-shrink:0;
  width:38px; height:38px;
  border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  font-size:15px; font-weight:700;
  line-height:1;
}
.eh-icon-success { background:#ecfdf5; color:#16a34a; }
.eh-icon-pending { background:#fffbeb; color:#d97706; }
.eh-icon-failed  { background:#fef2f2; color:#dc2626; }

/* ── center ── */
.eh-center { flex:1; min-width:0; overflow:hidden; }
.eh-order-id {
  font-size:12px; font-weight:600; color:#1558b0;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.eh-date { font-size:11px; color:#94a3b8; margin-top:1px; }

/* ── status pill ── */
.eh-pill {
  display:inline-flex; align-items:center;
  padding:2px 7px; border-radius:20px;
  font-size:10px; font-weight:600; margin-top:3px;
}
.eh-pill-success { background:#ecfdf5; color:#16a34a; }
.eh-pill-pending { background:#fffbeb; color:#d97706; }
.eh-pill-failed  { background:#fef2f2; color:#dc2626; }

/* ── right ── */
.eh-right { text-align:right; flex-shrink:0; }
.eh-amount { font-size:15px; font-weight:700; color:#0f172a; line-height:1; }
.eh-usdt   { font-size:10px; color:#94a3b8; margin-top:2px; }

/* ── chevron ── */
.eh-chevron { color:#d1d5db; transition:transform .2s; flex-shrink:0; }
.eh-chevron.open { transform:rotate(180deg); }

/* ── thin progress ── */
.eh-prog-wrap { padding:0 14px 1px; }
.eh-prog-bg { background:#f1f5f9; border-radius:99px; height:3px; }
.eh-prog-fill { height:100%; border-radius:99px; transition:width .5s ease; }
.eh-prog-fill-success { background:linear-gradient(90deg,#22c55e,#86efac); }
.eh-prog-fill-pending { background:linear-gradient(90deg,#f59e0b,#fcd34d); }
.eh-prog-fill-failed  { background:#fca5a5; }

/* ── expand ── */
.eh-expand {
  border-top:1px solid #f5f7fa;
  padding:12px 14px 14px;
  animation:ehExpand .18s ease;
}
@keyframes ehExpand {
  from { opacity:0; transform:translateY(-4px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── detail grid ── */
.eh-detail-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}
.eh-detail-box {
  background:#f8fafc;
  border-radius:10px;
  padding:10px 11px;
  min-width:0;
}
.eh-detail-title {
  font-size:10px; font-weight:600; letter-spacing:1px;
  color:#94a3b8; text-transform:uppercase; margin-bottom:7px;
}
.eh-detail-row {
  display:flex; justify-content:space-between;
  align-items:flex-start; margin-bottom:4px; gap:4px;
}
.eh-detail-row:last-child { margin-bottom:0; }
.eh-detail-label { font-size:11px; color:#94a3b8; flex-shrink:0; }
.eh-detail-val {
  font-size:11px; color:#111827; font-weight:500;
  text-align:right; word-break:break-all; min-width:0;
  overflow:hidden;
}

/* ── countdown ── */
.eh-countdown {
  display:flex; align-items:center; gap:6px;
  background:#fff7ed; border:1px solid #fed7aa;
  border-radius:8px; padding:7px 11px;
  font-size:12px; font-weight:600; color:#ea580c;
  margin-bottom:10px; width:100%; box-sizing:border-box;
}

/* ── action buttons ── */
.eh-actions { display:flex; gap:8px; margin-top:10px; }
.eh-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
  border:none; border-radius:9px;
  padding:9px 0;
  font-size:12px; font-weight:600;
  cursor:pointer; transition:background .15s, opacity .15s;
  -webkit-tap-highlight-color:transparent;
}
.eh-btn-receipt { background:#0f172a; color:#fff; }
.eh-btn-receipt:hover { background:#1e293b; }
.eh-btn-receipt:active { opacity:.85; }

/* ── receipts ── */
.eh-receipts-label {
  font-size:10px; font-weight:600; letter-spacing:1px;
  color:#94a3b8; text-transform:uppercase;
  margin-top:12px; margin-bottom:6px;
  display:flex; justify-content:space-between; align-items:center;
}
.eh-receipts-strip {
  display:flex; flex-wrap:wrap; gap:6px;
  width:100%;
}
.eh-receipt-thumb {
  border:1px solid #e2e8f0; border-radius:8px; padding:4px;
  display:flex; flex-direction:column; align-items:center; gap:3px;
  flex-shrink:0;
}
.eh-receipt-dl { color:#64748b; display:flex; align-items:center; }

/* ══════════════════════════════════════════
   SLIP MODAL
   — slides up from bottom on mobile
   — centered dialog on tablet+
══════════════════════════════════════════ */
.slip-modal-backdrop {
  position:fixed; inset:0;
  background:rgba(0,0,0,.55);
  z-index:1200;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  /* no padding — let the sheet touch screen edges */
  animation:slipFadeIn .2s ease;
}
@keyframes slipFadeIn { from{opacity:0} to{opacity:1} }

/* tablet+ → centered dialog */
@media (min-width:560px) {
  .slip-modal-backdrop {
    align-items:center;
    padding:24px;
  }
}

.slip-modal-box {
  background:#fff;
  width:100%;
  max-width:440px;
  /* bottom sheet on mobile: full width, rounded top corners only */
  border-radius:20px 20px 0 0;
  /* limit height and make it scrollable — leave room at top for safe area */
  max-height:88vh;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
  position:relative;
  box-shadow:0 -6px 32px rgba(0,0,0,.16);
  animation:slipSlideUp .26s cubic-bezier(.32,1,.4,1);
}
@keyframes slipSlideUp {
  from { transform:translateY(72px); opacity:0; }
  to   { transform:translateY(0);    opacity:1; }
}

/* tablet+: regular rounded dialog */
@media (min-width:560px) {
  .slip-modal-box {
    border-radius:20px;
    max-height:92vh;
    box-shadow:0 24px 64px rgba(0,0,0,.22);
    animation:slipFadeIn .2s ease;
  }
}

/* drag-handle pill — only on mobile */
.slip-handle {
  width:38px; height:4px;
  background:#e2e8f0; border-radius:99px;
  margin:10px auto 0;
  display:block;
}
@media (min-width:560px) { .slip-handle { display:none; } }

/* close button */
.slip-close-btn {
  position:absolute; top:12px; right:12px;
  width:28px; height:28px; border-radius:50%;
  background:#f1f5f9; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  z-index:10; transition:background .15s; flex-shrink:0;
}
.slip-close-btn:hover { background:#e2e8f0; }

/* ────────────────────────────────────────
   THE PRINTABLE SLIP
   All colours are hardcoded (no CSS vars,
   no gradients that html2canvas can't read)
   so the captured PNG looks correct.
──────────────────────────────────────── */
.bank-slip {
  background:#ffffff;
  overflow:hidden;
  /* fixed width so html2canvas gets consistent layout */
  width:100%;
}

/* header — solid fallback colour so html2canvas renders it */
.slip-header {
  background:#0f172a;          /* solid base */
  padding:24px 22px 18px;
  position:relative;
  overflow:hidden;
}
/* decorative circles — solid, fully opaque so h2c picks them up */
.slip-header::before {
  content:''; position:absolute; top:-40px; right:-40px;
  width:130px; height:130px; border-radius:50%;
  background:#1a2e50;
  pointer-events:none;
}
.slip-header::after {
  content:''; position:absolute; bottom:-28px; left:24px;
  width:72px; height:72px; border-radius:50%;
  background:#162440;
  pointer-events:none;
}

.slip-bank-name {
  font-size:9px; font-weight:700; letter-spacing:2.5px;
  color:#6b8ab5; text-transform:uppercase; margin-bottom:6px;
  position:relative; z-index:1;
}
.slip-amount-main {
  font-size:32px; font-weight:700; color:#ffffff;
  letter-spacing:-1px; line-height:1;
  position:relative; z-index:1;
}

/* status badge — solid colours instead of rgba so h2c renders them */
.slip-status-badge {
  display:inline-block;
  padding:4px 12px; border-radius:20px;
  font-size:11px; font-weight:700; margin-top:12px; letter-spacing:.4px;
  position:relative; z-index:1;
}
.slip-status-success { background:#166534; color:#bbf7d0; }
.slip-status-pending { background:#854d0e; color:#fef08a; }
.slip-status-failed  { background:#7f1d1d; color:#fecaca; }

/* body */
.slip-body { padding:4px 22px 18px; background:#ffffff; }
.slip-section-label {
  font-size:9px; font-weight:700; letter-spacing:2px;
  color:#94a3b8; text-transform:uppercase;
  margin:16px 0 8px;
  border-bottom:1px solid #e2e8f0; padding-bottom:5px;
}
.slip-row {
  display:flex; justify-content:space-between;
  align-items:flex-start; padding:6px 0;
  border-bottom:1px solid #f8fafc;
}
.slip-row:last-child { border-bottom:none; }
.slip-row-label { font-size:12px; color:#94a3b8; font-weight:400; flex-shrink:0; }
.slip-row-value {
  font-size:12px; color:#0f172a; font-weight:600;
  text-align:right; max-width:58%; word-break:break-word;
}
.slip-row-value.mono { font-family:monospace; }
.slip-orderid {
  background:#eff6ff; border-radius:5px; padding:2px 7px;
  font-family:monospace; font-size:12px; color:#1558b0; font-weight:700;
  display:inline-block;
}
.slip-dotted { border:none; border-top:2px dashed #e2e8f0; margin:12px 0; }

/* footer */
.slip-footer {
  background:#f8fafc; border-top:1px solid #e2e8f0;
  padding:12px 22px; text-align:center;
}
.slip-footer-text { font-size:10px; color:#94a3b8; line-height:1.6; }
.slip-footer-ref {
  font-family:monospace; font-size:9px; color:#cbd5e1;
  margin-top:5px; letter-spacing:1.2px;
}

/* barcode */
.slip-barcode { display:flex; gap:2px; justify-content:center; margin:8px auto 3px; }
.slip-bar { height:24px; border-radius:1px; background:#cbd5e1; }

/* ── action buttons below slip ── */
.slip-actions {
  display:flex; gap:8px;
  padding:12px 16px 16px;
  /* add safe-area padding on notched phones */
  padding-bottom:calc(16px + env(safe-area-inset-bottom, 0px));
  box-sizing:border-box; width:100%;
  background:#fff;
  border-top:1px solid #f1f5f9;
}
.slip-action-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
  padding:12px 0; border-radius:11px; border:none; cursor:pointer;
  font-size:13px; font-weight:700;
  transition:opacity .15s, background .15s;
  -webkit-tap-highlight-color:transparent;
}
.slip-action-btn:disabled { opacity:.55; cursor:not-allowed; }
.slip-action-btn:active:not(:disabled) { opacity:.8; }
.slip-btn-download { background:#0f172a; color:#fff; }
.slip-btn-download:hover:not(:disabled) { background:#1e293b; }
.slip-btn-share { background:#f1f5f9; color:#0f172a; }
.slip-btn-share:hover:not(:disabled) { background:#e2e8f0; }

/* spinner */
.slip-spinner {
  width:15px; height:15px;
  border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff; border-radius:50%;
  animation:spin .7s linear infinite; flex-shrink:0;
}
.slip-spinner.dark {
  border-color:rgba(0,0,0,.15);
  border-top-color:#0f172a;
}
@keyframes spin { to{transform:rotate(360deg)} }
`;

/* ─── helpers ─────────────────────────────────────────────────────── */
const slipBadgeClass = (s) =>
  s === 'success' ? 'slip-status-success'
  : s === 'pending' ? 'slip-status-pending'
  : 'slip-status-failed';

const slipLabel = (s) =>
  s === 'success' ? '✓ Completed'
  : s === 'pending' ? '◎ Pending'
  : '✕ Failed';

const formatTimeLeft = (ms) => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t / 3600)).padStart(2,'0')}h ${String(Math.floor((t % 3600) / 60)).padStart(2,'0')}m ${String(t % 60).padStart(2,'0')}s`;
};

const BARS = [3,5,2,7,4,6,2,8,3,5,7,2,4,6,3,5,2,7,4,6,2,5,3,4,7,2,6,3,5,4];
const Barcode = () => (
  <div className="slip-barcode">
    {BARS.map((w, i) => (
      <div key={i} className="slip-bar" style={{ width: w + 'px', opacity: 0.35 + (i % 3) * 0.2 }} />
    ))}
  </div>
);

/* ─── load html2canvas lazily ─────────────────────────────────────── */
function loadHtml2Canvas() {
  return new Promise((resolve) => {
    if (window.html2canvas) return resolve(window.html2canvas);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = () => resolve(window.html2canvas);
    document.head.appendChild(s);
  });
}

/* ─── capture slip as PNG blob ───────────────────────────────────── */
async function captureSlip(el) {
  const h2c = await loadHtml2Canvas();

  // Temporarily fix the element width for a consistent capture
  const originalMaxHeight = el.style.maxHeight;
  el.style.maxHeight = 'none';

  const canvas = await h2c(el, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: el.scrollWidth,
    height: el.scrollHeight,
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
    logging: false,
    // Force inline all styles so computed values are used
    onclone: (doc) => {
      // Replace any remaining CSS var() or gradient backgrounds
      // with solid equivalents in the cloned document
      const header = doc.querySelector('.slip-header');
      if (header) {
        header.style.background = '#0f172a';
        header.style.backgroundColor = '#0f172a';
      }
      // Ensure badge text colours are explicit
      const badges = doc.querySelectorAll('.slip-status-badge');
      badges.forEach((b) => {
        if (b.classList.contains('slip-status-success')) {
          b.style.background = '#166534';
          b.style.backgroundColor = '#166534';
          b.style.color = '#bbf7d0';
        } else if (b.classList.contains('slip-status-pending')) {
          b.style.background = '#854d0e';
          b.style.backgroundColor = '#854d0e';
          b.style.color = '#fef08a';
        } else {
          b.style.background = '#7f1d1d';
          b.style.backgroundColor = '#7f1d1d';
          b.style.color = '#fecaca';
        }
      });
    },
  });

  el.style.maxHeight = originalMaxHeight;

  return new Promise((res) => canvas.toBlob(res, 'image/png', 1));
}

/* ─── Transaction Slip ─────────────────────────────────────────────── */
const TransactionSlip = ({ order, onClose }) => {
  const slipRef   = useRef(null);
  const [busy, setBusy] = useState(''); // 'download' | 'share'

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : '—';

  const doCapture = async () => {
    const blob = await captureSlip(slipRef.current);
    return blob;
  };

  /* Save to device / gallery */
  const handleDownload = async () => {
    setBusy('download');
    try {
      const blob = await doCapture();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `receipt_${order.orderId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setBusy('');
    }
  };

  /* Native share sheet (WhatsApp / Instagram / gallery / etc.) */
  const handleShare = async () => {
    setBusy('share');
    try {
      const blob = await doCapture();
      const file = new File([blob], `receipt_${order.orderId}.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Receipt #${order.orderId}`,
          text: `₹${Number(order.fiat).toLocaleString('en-IN')} — Order #${order.orderId}`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Receipt #${order.orderId}`,
          text: `₹${Number(order.fiat).toLocaleString('en-IN')} — Order #${order.orderId}`,
        });
      } else {
        // Desktop fallback
        await handleDownload();
        return;
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share failed:', err);
    } finally {
      setBusy('');
    }
  };

  return (
    <div
      className="slip-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="slip-modal-box">
        <div className="slip-handle" />
        <button className="slip-close-btn" onClick={onClose}>
          <X size={13} color="#374151" />
        </button>

        {/* ── capturable slip ── */}
        <div ref={slipRef} className="bank-slip">
          <div className="slip-header">
            <div className="slip-bank-name">Transaction Receipt</div>
            <div className="slip-amount-main">
              ₹{Number(order.fiat).toLocaleString('en-IN')}
            </div>
            <div className={`slip-status-badge ${slipBadgeClass(order.status)}`}>
              {slipLabel(order.status)}
            </div>
          </div>

          <div className="slip-body">
            <div className="slip-section-label">Transaction Details</div>
            <div className="slip-row">
              <span className="slip-row-label">Order ID</span>
              <span className="slip-orderid">#{order.orderId}</span>
            </div>
            <div className="slip-row">
              <span className="slip-row-label">UTR</span>
              <span className="slip-orderid">
                {order.TXID ? `#${order.TXID}` : 'Pending'}
              </span>
            </div>
            <div className="slip-row">
              <span className="slip-row-label">Date &amp; Time</span>
              <span className="slip-row-value" style={{ fontSize: 11 }}>{dateStr}</span>
            </div>
            <div className="slip-row">
              <span className="slip-row-label">Amount (INR)</span>
              <span className="slip-row-value mono">
                ₹{Number(order.fiat).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="slip-section-label">
              {order.bankCard?.mode === 'upi' ? 'UPI Details' : 'Bank Details'}
            </div>
            {order.bankCard?.mode === 'bank' ? (
              <>
                <div className="slip-row">
                  <span className="slip-row-label">Account Name</span>
                  <span className="slip-row-value">{order.bankCard.accountName}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-row-label">Account No.</span>
                  <span className="slip-row-value mono">{order.bankCard.accountNumber}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-row-label">IFSC</span>
                  <span className="slip-row-value mono">{order.bankCard.ifsc}</span>
                </div>
              </>
            ) : (
              <>
                <div className="slip-row">
                  <span className="slip-row-label">Name</span>
                  <span className="slip-row-value">{order.bankCard?.accountName}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-row-label">UPI ID</span>
                  <span className="slip-row-value mono">{order.bankCard?.upi}</span>
                </div>
              </>
            )}

            <hr className="slip-dotted" />
            <Barcode />
            <div style={{ textAlign:'center', fontSize:9, color:'#cbd5e1', fontFamily:'monospace', letterSpacing:1.5, marginTop:3 }}>
              {order.orderId}-{order._id?.slice(-6).toUpperCase()}
            </div>
          </div>

          <div className="slip-footer">
            <div className="slip-footer-text">Auto-generated transaction receipt.</div>
            <div className="slip-footer-ref">REF · {order._id?.slice(-12).toUpperCase()}</div>
          </div>
        </div>

        {/* ── buttons (outside capture area) ── */}
        <div className="slip-actions">
          <button
            className="slip-action-btn slip-btn-download"
            onClick={handleDownload}
            disabled={!!busy}
          >
            {busy === 'download'
              ? <><div className="slip-spinner" /> Saving…</>
              : <><DownloadIcon size={14} /> Save Image</>
            }
          </button>
          <button
            className="slip-action-btn slip-btn-share"
            onClick={handleShare}
            disabled={!!busy}
          >
            {busy === 'share'
              ? <><div className="slip-spinner dark" /> Preparing…</>
              : <><Share2 size={14} /> Share</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Single Order Card ─────────────────────────────────────────── */
const OrderCard = ({ value, timeLeft, onViewSlip }) => {
  const [open, setOpen] = useState(false);
  const pct = Math.round((value.fulfilledRatio || 0) * 100);
  const s   = value.status;

  const dateLabel = value.createdAt
    ? new Date(value.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '';

  return (
    <div className="eh-card">
      {/* main row */}
      <div className="eh-main" onClick={() => setOpen((o) => !o)}>
        <div className={`eh-icon eh-icon-${s}`}>
          {s === 'success' ? '✓' : s === 'pending' ? '◎' : '✕'}
        </div>
        <div className="eh-center">
          <div className="eh-order-id">#{value.orderId}</div>
          <div className="eh-date">{dateLabel}</div>
          <span className={`eh-pill eh-pill-${s}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        </div>
        <div className="eh-right">
          <div className="eh-amount">₹{Number(value.fiat).toLocaleString('en-IN')}</div>
          <div className="eh-usdt">{value.usdt} USDT</div>
        </div>
        <ChevronDown size={16} className={`eh-chevron${open ? ' open' : ''}`} />
      </div>

      {/* progress bar */}
      <div className="eh-prog-wrap">
        <div className="eh-prog-bg">
          <div className={`eh-prog-fill eh-prog-fill-${s}`} style={{ width: pct + '%' }} />
        </div>
      </div>

      {/* expanded */}
      {open && (
        <div className="eh-expand">
          {s === 'pending' && timeLeft > 0 && (
            <div className="eh-countdown">⏱ {formatTimeLeft(timeLeft)} remaining</div>
          )}

          <div className="eh-detail-grid">
            <div className="eh-detail-box">
              <div className="eh-detail-title">Fund</div>
              <div className="eh-detail-row">
                <span className="eh-detail-label">Type</span>
                <span className="eh-detail-val" style={{ textTransform:'capitalize' }}>{value.fund?.type}</span>
              </div>
              <div className="eh-detail-row">
                <span className="eh-detail-label">Rate</span>
                <span className="eh-detail-val">₹{value.fund?.rate}</span>
              </div>
              <div className="eh-detail-row">
                <span className="eh-detail-label">Fulfilled</span>
                <span className="eh-detail-val">₹{Number(value.fulfilledFiat).toLocaleString('en-IN')}</span>
              </div>
              <div className="eh-detail-row">
                <span className="eh-detail-label">Progress</span>
                <span className="eh-detail-val">{pct}%</span>
              </div>
            </div>

            <div className="eh-detail-box">
              <div className="eh-detail-title">
                {value.bankCard?.mode === 'upi' ? 'UPI' : 'Bank'}
              </div>
              {value.bankCard?.mode === 'bank' ? (
                <>
                  <div className="eh-detail-row">
                    <span className="eh-detail-label">Name</span>
                    <span className="eh-detail-val">{value.bankCard.accountName}</span>
                  </div>
                  <div className="eh-detail-row">
                    <span className="eh-detail-label">Acc No.</span>
                    <span className="eh-detail-val">{value.bankCard.accountNumber}</span>
                  </div>
                  <div className="eh-detail-row">
                    <span className="eh-detail-label">IFSC</span>
                    <span className="eh-detail-val">{value.bankCard.ifsc}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="eh-detail-row">
                    <span className="eh-detail-label">Name</span>
                    <span className="eh-detail-val">{value.bankCard?.accountName}</span>
                  </div>
                  <div className="eh-detail-row">
                    <span className="eh-detail-label">UPI ID</span>
                    <span className="eh-detail-val">{value.bankCard?.upi}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="eh-actions">
            <button className="eh-btn eh-btn-receipt" onClick={() => onViewSlip(value)}>
              <FileText size={13} /> View Receipt
            </button>
          </div>

          {value.receipts?.length > 0 && (
            <>
              <div className="eh-receipts-label">
                <span>Receipts</span>
                <span>₹{value.fulfilledFiat} / ₹{value.fiat}</span>
              </div>
              <div className="eh-receipts-strip">
                {value.receipts.map((r, i) => (
                  <div key={i} className="eh-receipt-thumb">
                    <Image
                      width={44} height={44} src={r}
                      style={{ borderRadius: 6, objectFit: 'cover', display: 'block' }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    />
                    <a href={r} download target="_blank" rel="noopener noreferrer" className="eh-receipt-dl">
                      <DownloadIcon size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
const App = ({ open, setOpenDrawer }) => {
  const [loading, setLoading]               = useState(false);
  const [orders, setOrders]                 = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [slipOrder, setSlipOrder]           = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await usersGet('/order');
      if (response.success) {
        setOrders(response.orders);
        const timers = {};
        response.orders.forEach((order) => {
          const maxTime = order?.fund?.maxFulfillmentTime;
          const expiry  = new Date(order.createdAt).getTime() + (maxTime ?? 3) * 60 * 60 * 1000;
          timers[order._id] = Math.max(expiry - Date.now(), 0);
        });
        setRemainingTimes(timers);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (open) fetchOrders(); }, [open]);

  useEffect(() => {
    const t = setInterval(() => {
      setRemainingTimes((prev) => {
        const u = {};
        for (const id in prev) u[id] = Math.max(prev[id] - 1000, 0);
        return u;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <Drawer
        closable
        destroyOnClose
        placement="right"
        width="100%"
        loading={loading}
        getContainer={false}
        open={open}
        onClose={setOpenDrawer}
        closeIcon={<ArrowLeft size={20} />}
        title={<Text strong style={{ fontSize: 15 }}>Exchange History</Text>}
      >
        {orders.length ? (
          <div className="eh-list">
            {orders.map((value) => (
              <OrderCard
                key={value._id}
                value={value}
                timeLeft={remainingTimes[value._id]}
                onViewSlip={setSlipOrder}
              />
            ))}
          </div>
        ) : (
          <EmptyBox />
        )}
      </Drawer>

      {slipOrder && (
        <TransactionSlip
          order={slipOrder}
          onClose={() => setSlipOrder(null)}
        />
      )}
    </>
  );
};

export default App;