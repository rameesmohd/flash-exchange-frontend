import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Typography } from 'antd';
import { Image } from 'antd';
import { ArrowLeft, DownloadIcon, FileText, X, ChevronDown, Share2 } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import EmptyBox from '../common/EmptyBox';

const { Text } = Typography;

/* ─────────────────────────────────────────────────────────────────── */
/*  Styles — uses system/antd default fonts, no custom imports        */
/* ─────────────────────────────────────────────────────────────────── */
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
}
.eh-detail-title {
  font-size:10px; font-weight:600; letter-spacing:1px;
  color:#94a3b8; text-transform:uppercase; margin-bottom:7px;
}
.eh-detail-row {
  display:flex; justify-content:space-between;
  align-items:flex-start; margin-bottom:4px; gap:6px;
}
.eh-detail-row:last-child { margin-bottom:0; }
.eh-detail-label { font-size:11px; color:#94a3b8; flex-shrink:0; }
.eh-detail-val {
  font-size:11px; color:#111827; font-weight:500;
  text-align:right; word-break:break-all; max-width:58%;
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
.eh-btn-receipt {
  background:#0f172a; color:#fff;
}
.eh-btn-receipt:hover { background:#1e293b; }
.eh-btn-receipt:active { opacity:.85; }

/* ── receipts ── */
.eh-receipts-label {
  font-size:10px; font-weight:600; letter-spacing:1px;
  color:#94a3b8; text-transform:uppercase;
  margin-top:12px; margin-bottom:6px;
  display:flex; justify-content:space-between; align-items:center;
}
.eh-receipts-strip { display:flex; flex-wrap:wrap; gap:6px; }
.eh-receipt-thumb {
  border:1px solid #e2e8f0; border-radius:8px; padding:4px;
  display:flex; flex-direction:column; align-items:center; gap:3px;
}
.eh-receipt-dl { color:#64748b; display:flex; align-items:center; }

/* ══════════════════════════════════════════
   SLIP MODAL
══════════════════════════════════════════ */
.slip-modal-backdrop {
  position:fixed; inset:0; background:rgba(0,0,0,.6);
  z-index:1200;
  display:flex; align-items:flex-end; justify-content:center;
  padding:0;
  animation:slipFadeIn .22s ease;
}
@media (min-width:520px) {
  .slip-modal-backdrop { align-items:center; padding:16px; }
}
@keyframes slipFadeIn { from { opacity:0; } to { opacity:1; } }

.slip-modal-box {
  background:#fff;
  border-radius:20px 20px 0 0;
  width:100%; max-width:420px;
  max-height:94vh; overflow-y:auto;
  position:relative;
  box-shadow:0 -8px 40px rgba(0,0,0,.18);
  animation:slipSlideUp .25s ease;
}
@media (min-width:520px) {
  .slip-modal-box {
    border-radius:20px;
    box-shadow:0 24px 64px rgba(0,0,0,.22);
    animation:slipFadeIn .22s ease;
  }
}
@keyframes slipSlideUp {
  from { transform:translateY(60px); opacity:0; }
  to   { transform:translateY(0);    opacity:1; }
}

/* drag handle pill */
.slip-handle {
  width:40px; height:4px; background:#e5e7eb;
  border-radius:99px; margin:12px auto 0;
}
@media (min-width:520px) { .slip-handle { display:none; } }

.slip-close-btn {
  position:absolute; top:14px; right:14px;
  width:30px; height:30px; border-radius:50%;
  background:#f3f4f6; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  z-index:10; transition:background .15s;
}
.slip-close-btn:hover { background:#e5e7eb; }

/* ── the slip itself ── */
.bank-slip { background:#fff; overflow:hidden; }

.slip-header {
  background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1558b0 100%);
  padding:26px 24px 20px;
  position:relative; overflow:hidden;
}
.slip-header::before {
  content:''; position:absolute; top:-40px; right:-40px;
  width:140px; height:140px; border-radius:50%;
  background:rgba(255,255,255,.05);
}
.slip-header::after {
  content:''; position:absolute; bottom:-30px; left:30px;
  width:80px; height:80px; border-radius:50%;
  background:rgba(255,255,255,.04);
}
.slip-bank-name {
  font-size:10px; font-weight:700; letter-spacing:2.5px;
  color:rgba(255,255,255,.5); text-transform:uppercase; margin-bottom:4px;
}
.slip-amount-main {
  font-size:34px; font-weight:700; color:#fff;
  letter-spacing:-1px; line-height:1;
}
.slip-status-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:4px 12px; border-radius:20px;
  font-size:11px; font-weight:700; margin-top:14px; letter-spacing:.5px;
}
.slip-status-success { background:rgba(34,197,94,.2); color:#4ade80; }
.slip-status-pending { background:rgba(251,191,36,.2); color:#fbbf24; }
.slip-status-failed  { background:rgba(239,68,68,.2);  color:#f87171; }

.slip-body { padding:4px 24px 20px; }
.slip-section-label {
  font-size:10px; font-weight:700; letter-spacing:2px;
  color:#94a3b8; text-transform:uppercase;
  margin:18px 0 9px; border-bottom:1px dashed #e2e8f0; padding-bottom:6px;
}
.slip-row {
  display:flex; justify-content:space-between;
  align-items:flex-start; padding:7px 0;
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
  background:#f1f5f9; border-radius:6px; padding:2px 8px;
  font-family:monospace; font-size:12px; color:#1558b0; font-weight:700;
}
.slip-dotted { border:none; border-top:2px dashed #e2e8f0; margin:14px 0; }
.slip-footer {
  background:#f8fafc; border-top:1px solid #e2e8f0;
  padding:14px 24px; text-align:center;
}
.slip-footer-text { font-size:10.5px; color:#94a3b8; line-height:1.6; }
.slip-footer-ref { font-family:monospace; font-size:10px; color:#cbd5e1; margin-top:6px; letter-spacing:1px; }
.slip-barcode { display:flex; gap:2px; justify-content:center; margin:10px auto 4px; }
.slip-bar { height:26px; border-radius:1px; background:#cbd5e1; }

/* ── slip action buttons ── */
.slip-actions {
  display:flex; gap:8px;
  padding:14px 20px 20px;
  box-sizing:border-box; width:100%;
}
.slip-action-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
  padding:12px 0; border-radius:11px; border:none; cursor:pointer;
  font-size:13px; font-weight:700; transition:opacity .15s, background .15s;
  -webkit-tap-highlight-color:transparent;
}
.slip-action-btn:active { opacity:.82; }
.slip-btn-download { background:#0f172a; color:#fff; }
.slip-btn-download:hover { background:#1e293b; }
.slip-btn-share { background:#f1f5f9; color:#0f172a; }
.slip-btn-share:hover { background:#e2e8f0; }

/* spinner */
.slip-spinner {
  width:16px; height:16px; border:2.5px solid rgba(255,255,255,.3);
  border-top-color:#fff; border-radius:50%;
  animation:spin .7s linear infinite; flex-shrink:0;
}
@keyframes spin { to { transform:rotate(360deg); } }
`;

/* ─── helpers ─────────────────────────────────────────────────────── */
const slipBadgeClass = (s) =>
  s === 'success' ? 'slip-status-success' : s === 'pending' ? 'slip-status-pending' : 'slip-status-failed';
const slipLabel = (s) =>
  s === 'success' ? '✓ Completed' : s === 'pending' ? '◎ Pending' : '✕ Failed';

const formatTimeLeft = (ms) => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t / 3600)).padStart(2, '0')}h ${String(Math.floor((t % 3600) / 60)).padStart(2, '0')}m ${String(t % 60).padStart(2, '0')}s`;
};

const BARS = [3, 5, 2, 7, 4, 6, 2, 8, 3, 5, 7, 2, 4, 6, 3, 5, 2, 7, 4, 6, 2, 5, 3, 4, 7, 2, 6, 3, 5, 4];
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

/* ─── capture slip as blob ─────────────────────────────────────────── */
async function captureSlip(el) {
  const h2c = await loadHtml2Canvas();
  const canvas = await h2c(el, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: el.offsetWidth,
    windowWidth: el.offsetWidth,
    logging: false,
  });
  return new Promise((res) => canvas.toBlob(res, 'image/png', 1));
}

/* ─── Transaction Slip ─────────────────────────────────────────────── */
const TransactionSlip = ({ order, onClose }) => {
  const slipRef = useRef(null);
  const [busy, setBusy] = useState(''); // 'download' | 'share' | ''

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : '—';

  /* ── Download to gallery / device ── */
  const handleDownload = async () => {
    setBusy('download');
    try {
      const blob = await captureSlip(slipRef.current);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `receipt_${order.orderId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setBusy('');
    }
  };

  /* ── Share (Web Share API — works on mobile for gallery/social) ── */
  const handleShare = async () => {
    setBusy('share');
    try {
      const blob = await captureSlip(slipRef.current);
      const file = new File([blob], `receipt_${order.orderId}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // Native share sheet — lets user save to gallery, WhatsApp, Instagram, etc.
        await navigator.share({
          title: `Transaction Receipt #${order.orderId}`,
          text: `₹${Number(order.fiat).toLocaleString('en-IN')} — Order #${order.orderId}`,
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback: share without file (text only)
        await navigator.share({
          title: `Transaction Receipt #${order.orderId}`,
          text: `₹${Number(order.fiat).toLocaleString('en-IN')} — Order #${order.orderId}`,
        });
      } else {
        // Desktop fallback: just download
        await handleDownload();
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
        {/* mobile drag handle */}
        <div className="slip-handle" />

        <button className="slip-close-btn" onClick={onClose}>
          <X size={14} color="#374151" />
        </button>

        {/* ── printable slip ── */}
        <div ref={slipRef} className="bank-slip">
          <div className="slip-header">
            <div className="slip-bank-name">Transaction Receipt</div>
            <div className="slip-amount-main">₹{Number(order.fiat).toLocaleString('en-IN')}</div>
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
              <span className="slip-orderid">{order.TXID ? `#${order.TXID}` : 'Pending'}</span>
            </div>
            <div className="slip-row">
              <span className="slip-row-label">Date & Time</span>
              <span className="slip-row-value" style={{ fontSize: 11 }}>{dateStr}</span>
            </div>
            <div className="slip-row">
              <span className="slip-row-label">Amount (INR)</span>
              <span className="slip-row-value mono">₹{Number(order.fiat).toLocaleString('en-IN')}</span>
            </div>

            <div className="slip-section-label">
              {order.bankCard?.mode === 'upi' ? 'UPI Details' : 'Bank Details'}
            </div>
            {order.bankCard?.mode === 'bank' ? (
              <>
                <div className="slip-row"><span className="slip-row-label">Account Name</span><span className="slip-row-value">{order.bankCard.accountName}</span></div>
                <div className="slip-row"><span className="slip-row-label">Account No.</span><span className="slip-row-value mono">{order.bankCard.accountNumber}</span></div>
                <div className="slip-row"><span className="slip-row-label">IFSC</span><span className="slip-row-value mono">{order.bankCard.ifsc}</span></div>
              </>
            ) : (
              <>
                <div className="slip-row"><span className="slip-row-label">Name</span><span className="slip-row-value">{order.bankCard?.accountName}</span></div>
                <div className="slip-row"><span className="slip-row-label">UPI ID</span><span className="slip-row-value mono">{order.bankCard?.upi}</span></div>
              </>
            )}

            <hr className="slip-dotted" />
            <Barcode />
            <div style={{ textAlign: 'center', fontSize: 10, color: '#cbd5e1', fontFamily: 'monospace', letterSpacing: 1.5, marginTop: 4 }}>
              {order.orderId}-{order._id?.slice(-6).toUpperCase()}
            </div>
          </div>

          <div className="slip-footer">
            <div className="slip-footer-text">Auto-generated transaction receipt.</div>
            <div className="slip-footer-ref">REF · {order._id?.slice(-12).toUpperCase()}</div>
          </div>
        </div>

        {/* ── action buttons ── */}
        <div className="slip-actions">
          <button
            className="slip-action-btn slip-btn-download"
            onClick={handleDownload}
            disabled={!!busy}
          >
            {busy === 'download'
              ? <><div className="slip-spinner" /> Saving…</>
              : <><DownloadIcon size={15} /> Save Image</>
            }
          </button>

          <button
            className="slip-action-btn slip-btn-share"
            onClick={handleShare}
            disabled={!!busy}
          >
            {busy === 'share'
              ? <><div className="slip-spinner" style={{ borderTopColor: '#0f172a', borderColor: 'rgba(0,0,0,.15)' }} /> Preparing…</>
              : <><Share2 size={15} /> Share</>
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
  const s = value.status;

  const dateLabel = value.createdAt
    ? new Date(value.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '';

  return (
    <div className="eh-card">
      {/* ── main row ── */}
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

      {/* ── thin progress bar ── */}
      <div className="eh-prog-wrap">
        <div className="eh-prog-bg">
          <div className={`eh-prog-fill eh-prog-fill-${s}`} style={{ width: pct + '%' }} />
        </div>
      </div>

      {/* ── expanded ── */}
      {open && (
        <div className="eh-expand">
          {s === 'pending' && timeLeft > 0 && (
            <div className="eh-countdown">
              ⏱ {formatTimeLeft(timeLeft)} remaining
            </div>
          )}

          <div className="eh-detail-grid">
            {/* Fund */}
            <div className="eh-detail-box">
              <div className="eh-detail-title">Fund</div>
              <div className="eh-detail-row">
                <span className="eh-detail-label">Type</span>
                <span className="eh-detail-val" style={{ textTransform: 'capitalize' }}>{value.fund?.type}</span>
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

            {/* Bank / UPI */}
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

          {/* View Receipt */}
          <div className="eh-actions">
            <button className="eh-btn eh-btn-receipt" onClick={() => onViewSlip(value)}>
              <FileText size={13} /> View Receipt
            </button>
          </div>

          {/* Receipts */}
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
                      width={48} height={48} src={r}
                      style={{ borderRadius: 6, objectFit: 'cover' }}
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
/*  Main Component                                                     */
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