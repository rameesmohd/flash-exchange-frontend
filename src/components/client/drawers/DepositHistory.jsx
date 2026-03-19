import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Typography } from 'antd';
import { Image } from 'antd';
import { ArrowLeft, DownloadIcon, FileText, X, ChevronDown, Share2 } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import EmptyBox from '../common/EmptyBox';

const { Text } = Typography;

/* ══════════════════════════════════════════════════════════════════
   STRATEGY:
   • Preview  → pure React/JSX rendered in the DOM  (always crisp)
   • Download → canvas drawn offscreen at 3× scale   (high-res PNG)
   No canvas is ever shown on screen, so blur is impossible.
══════════════════════════════════════════════════════════════════ */

/* ─── Receipt preview component (JSX) ─────────────────────────── */

const STATUS_MAP = {
  success: { bg: '#14532d', color: '#86efac', label: '✓  Completed' },
  pending: { bg: '#78350f', color: '#fde68a', label: '◎  Pending'   },
  failed:  { bg: '#7f1d1d', color: '#fca5a5', label: '✕  Failed'    },
};

const ReceiptPreview = ({ order }) => {
  const st      = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const isBank  = order.bankCard?.mode === 'bank';
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      })
    : '—';

  const BARS = [3,5,2,7,4,6,2,8,3,5,7,2,4,6,3,5,2,7,4,6,2,5,3,4,7,2,6,3,5,4];

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box',
    }}>
      {/* ── header ── */}
      <div style={{
        background: '#0c1628', padding: '18px 20px 18px', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 130, height: 130,
          borderRadius: '50%', background: 'rgba(26,58,110,0.45)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: -10, width: 80, height: 80,
          borderRadius: '50%', background: 'rgba(18,42,82,0.4)',
        }} />
        {/* accent stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'rgba(34,85,164,0.55)',
        }} />

        {/* label row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 10, position: 'relative',
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '2.5px',
            color: '#5a85c0', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Transaction Receipt</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* amount */}
        <div style={{
          fontSize: 32, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 14,
          position: 'relative',
        }}>
          ₹{Number(order.fiat).toLocaleString('en-IN')}
        </div>

        {/* status badge */}
        <div style={{
          display: 'inline-block', padding: '5px 14px', borderRadius: 20,
          fontSize: 12, fontWeight: 700, letterSpacing: '0.3px',
          background: st.bg, color: st.color, position: 'relative',
        }}>
          {st.label}
        </div>
      </div>

      {/* ── wave ── */}
      <div style={{ background: '#0c1628', lineHeight: 0 }}>
        <svg viewBox="0 0 360 22" style={{ display: 'block', width: '100%' }}>
          <path d="M0,0 C65,22 130,22 180,11 C230,0 295,0 360,22 L360,22 L0,22 Z" fill="#ffffff"/>
        </svg>
      </div>

      {/* ── body ── */}
      <div style={{ padding: '8px 20px 16px', background: '#fff' }}>

        {/* section label */}
        <SectionLabel>Transaction Details</SectionLabel>

        <TagRow label="Order ID" value={`#${order.orderId}`} />
        <TagRow label="UTR" value={order.TXID ? `#${order.TXID}` : 'Pending'} />
        <PlainRow label="Date & Time" value={dateStr} />
        <PlainRow label="Amount (INR)" value={`₹${Number(order.fiat).toLocaleString('en-IN')}`} mono last />

        <SectionLabel>{isBank ? 'Bank Details' : 'UPI Details'}</SectionLabel>

        {isBank ? (<>
          <PlainRow label="Account Name" value={order.bankCard.accountName} />
          <PlainRow label="Account No."  value={order.bankCard.accountNumber} mono />
          <PlainRow label="IFSC"         value={order.bankCard.ifsc} mono last />
        </>) : (<>
          <PlainRow label="Name"   value={order.bankCard?.accountName} />
          <PlainRow label="UPI ID" value={order.bankCard?.upi} mono last />
        </>)}

        {/* dashed line */}
        <div style={{
          borderTop: '1.5px dashed #e2e8f0', margin: '16px 0 12px',
        }} />

        {/* barcode */}
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 8 }}>
          {BARS.map((w, i) => (
            <div key={i} style={{
              width: w, height: 22, borderRadius: 1,
              background: `rgba(156,163,175,${0.38 + (i % 3) * 0.18})`,
            }} />
          ))}
        </div>

        {/* ref */}
        <div style={{
          textAlign: 'center', fontSize: 9, color: '#cbd5e1',
          fontFamily: 'monospace', letterSpacing: '1.5px',
        }}>
          {order.orderId}–{order._id?.slice(-6).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 9, fontWeight: 700, letterSpacing: '2px', color: '#94a3b8',
    textTransform: 'uppercase', padding: '12px 0 6px',
    borderBottom: '1px solid #edf2f7', marginBottom: 2,
  }}>
    {children}
  </div>
);

const PlainRow = ({ label, value, mono, last }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: last ? 'none' : '1px solid #f1f5f9',
  }}>
    <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
    <span style={{
      fontSize: 12, color: '#111827', fontWeight: 600, textAlign: 'right',
      maxWidth: '60%', wordBreak: 'break-word',
      fontFamily: mono ? 'monospace' : 'inherit',
    }}>{value}</span>
  </div>
);

const TagRow = ({ label, value, last }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: last ? 'none' : '1px solid #f1f5f9',
  }}>
    <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
    <span style={{
      background: '#dbeafe', borderRadius: 5, padding: '3px 9px',
      fontFamily: 'monospace', fontSize: 11, color: '#1e40af', fontWeight: 700,
    }}>{value}</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   CANVAS RECEIPT — only used for download/share (never shown)
══════════════════════════════════════════════════════════════════ */

const SCALE = 3;
const W     = 360;
const PAD   = 24;
const FONT  = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
const MONO  = 'ui-monospace, "SF Mono", "Courier New", monospace';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function measure(ctx, text, font) {
  ctx.font = font;
  return ctx.measureText(String(text)).width;
}

function drawHeader(ctx, order, y) {
  const BADGE_H = 26, BADGE_R = 13;
  const LABEL_Y = 14, AMOUNT_Y = 32, BADGE_Y = 76;
  const H = BADGE_Y + BADGE_H + 14;

  const STATUS = {
    success: { bg: '#14532d', fg: '#86efac', text: '✓  Completed' },
    pending: { bg: '#78350f', fg: '#fde68a', text: '◎  Pending'   },
    failed:  { bg: '#7f1d1d', fg: '#fca5a5', text: '✕  Failed'    },
  };
  const st = STATUS[order.status] || STATUS.pending;
  ctx.font = `700 12px ${FONT}`;
  const badgeW = measure(ctx, st.text, `700 12px ${FONT}`) + 30;

  ctx.save();
  ctx.beginPath(); ctx.rect(0, y, W, H); ctx.clip();

  ctx.fillStyle = '#0c1628'; ctx.fillRect(0, y, W, H);

  const g1 = ctx.createRadialGradient(W * 0.88, y, 0, W * 0.88, y, W * 0.65);
  g1.addColorStop(0, 'rgba(28,60,124,0.95)'); g1.addColorStop(1, 'rgba(12,22,40,0)');
  ctx.fillStyle = g1; ctx.fillRect(0, y, W, H);

  const g2 = ctx.createRadialGradient(0, y + H, 0, 0, y + H, W * 0.5);
  g2.addColorStop(0, 'rgba(20,44,92,0.85)'); g2.addColorStop(1, 'rgba(12,22,40,0)');
  ctx.fillStyle = g2; ctx.fillRect(0, y, W, H);

  ctx.beginPath(); ctx.arc(W - 36, y - 22, 82, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(24,52,104,0.5)'; ctx.fill();

  ctx.beginPath(); ctx.arc(-8, y + H + 4, 46, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(16,38,80,0.42)'; ctx.fill();

  ctx.save(); ctx.globalAlpha = 0.04; ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(0, y + H); ctx.lineTo(W, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50, y + H); ctx.lineTo(W, y + 28); ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(34,85,164,0.55)'; ctx.fillRect(0, y, W, 2);
  ctx.restore();

  ctx.font = `700 9px ${FONT}`; ctx.fillStyle = '#5a85c0';
  ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  ctx.fillText('TRANSACTION RECEIPT', PAD, y + LABEL_Y);
  const lw = measure(ctx, 'TRANSACTION RECEIPT', `700 9px ${FONT}`);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + lw + 8, y + LABEL_Y + 5); ctx.lineTo(W - PAD, y + LABEL_Y + 5); ctx.stroke();

  ctx.font = `700 32px ${FONT}`; ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top'; ctx.fillText(`₹${Number(order.fiat).toLocaleString('en-IN')}`, PAD, y + AMOUNT_Y);

  roundRect(ctx, PAD, y + BADGE_Y, badgeW, BADGE_H, BADGE_R);
  ctx.fillStyle = st.bg; ctx.fill();
  ctx.font = `700 12px ${FONT}`; ctx.fillStyle = st.fg;
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText(st.text, PAD + 15, y + BADGE_Y + BADGE_H / 2);

  return H;
}

function drawWave(ctx, y) {
  const H = 22;
  ctx.fillStyle = '#0c1628'; ctx.fillRect(0, y, W, H);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.bezierCurveTo(W * 0.18, y + H, W * 0.36, y + H, W * 0.5, y + H / 2);
  ctx.bezierCurveTo(W * 0.64, y, W * 0.82, y, W, y + H);
  ctx.lineTo(W, y + H); ctx.lineTo(0, y + H); ctx.closePath();
  ctx.fillStyle = '#fff'; ctx.fill();
  return H;
}

function drawSectionLabel(ctx, label, y) {
  const H = 30;
  ctx.font = `700 9px ${FONT}`; ctx.fillStyle = '#94a3b8';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText(label.toUpperCase(), PAD, y + H / 2 - 2);
  ctx.strokeStyle = '#edf2f7'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, y + H - 1); ctx.lineTo(W - PAD, y + H - 1); ctx.stroke();
  return H;
}

function drawRow(ctx, label, value, y, mono, last = false) {
  const H = 36, mid = y + H / 2;
  ctx.font = `400 12px ${FONT}`; ctx.fillStyle = '#94a3b8';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(label, PAD, mid);
  ctx.font = `600 12px ${mono ? MONO : FONT}`; ctx.fillStyle = '#111827';
  ctx.textAlign = 'right'; ctx.fillText(String(value ?? ''), W - PAD, mid); ctx.textAlign = 'left';
  if (!last) { ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD, y + H); ctx.lineTo(W - PAD, y + H); ctx.stroke(); }
  return H;
}

function drawTagRow(ctx, label, value, y, last = false) {
  const H = 36, mid = y + H / 2;
  ctx.font = `400 12px ${FONT}`; ctx.fillStyle = '#94a3b8';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(label, PAD, mid);
  ctx.font = `700 11px ${MONO}`;
  const tw = measure(ctx, value, `700 11px ${MONO}`);
  const tW = tw + 20, tH = 22, tX = W - PAD - tW, tY = mid - tH / 2;
  roundRect(ctx, tX, tY, tW, tH, 5); ctx.fillStyle = '#dbeafe'; ctx.fill();
  ctx.fillStyle = '#1e40af'; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  ctx.fillText(value, W - PAD - 9, mid); ctx.textAlign = 'left';
  if (!last) { ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD, y + H); ctx.lineTo(W - PAD, y + H); ctx.stroke(); }
  return H;
}

function drawDashedLine(ctx, y) {
  ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke(); ctx.restore();
}

function drawBarcode(ctx, y) {
  const bars = [3,5,2,7,4,6,2,8,3,5,7,2,4,6,3,5,2,7,4,6,2,5,3,4,7,2,6,3,5,4];
  const totalW = bars.reduce((a, b) => a + b + 2, 0);
  let bx = (W - totalW) / 2;
  bars.forEach((bw, i) => {
    ctx.fillStyle = `rgba(156,163,175,${0.38 + (i % 3) * 0.18})`;
    ctx.fillRect(bx, y, bw, 22); bx += bw + 2;
  });
}

function drawReceipt(order) {
  const isBank  = order.bankCard?.mode === 'bank';
  const HDR_H   = 116;
  const WAVE_H  = 22;
  const TOP_PAD = 10;
  const SEC1_H  = 30 + 36 * 4;
  const SEC2_H  = 30 + 36 * (isBank ? 3 : 2);
  const BOT     = 20 + 1 + 14 + 22 + 12 + 14 + 6;
  const TOTAL_H = HDR_H + WAVE_H + TOP_PAD + SEC1_H + 14 + SEC2_H + BOT;

  const canvas = document.createElement('canvas');
  canvas.width  = W * SCALE;
  canvas.height = TOTAL_H * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  roundRect(ctx, 0, 0, W, TOTAL_H, 16); ctx.fillStyle = '#fff'; ctx.fill();

  ctx.save(); roundRect(ctx, 0, 0, W, TOTAL_H, 16); ctx.clip();

  let cy = 0;
  cy += drawHeader(ctx, order, cy);
  cy += drawWave(ctx, cy);
  cy += TOP_PAD;
  cy += drawSectionLabel(ctx, 'Transaction Details', cy);
  cy += drawTagRow(ctx, 'Order ID', `#${order.orderId}`, cy);
  cy += drawTagRow(ctx, 'UTR', order.TXID ? `#${order.TXID}` : 'Pending', cy);
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true })
    : '—';
  cy += drawRow(ctx, 'Date & Time', dateStr, cy, false);
  cy += drawRow(ctx, 'Amount (INR)', `₹${Number(order.fiat).toLocaleString('en-IN')}`, cy, true, true);
  cy += 14;
  cy += drawSectionLabel(ctx, isBank ? 'Bank Details' : 'UPI Details', cy);
  if (isBank) {
    cy += drawRow(ctx, 'Account Name', order.bankCard.accountName,  cy, false);
    cy += drawRow(ctx, 'Account No.',  order.bankCard.accountNumber, cy, true);
    cy += drawRow(ctx, 'IFSC',         order.bankCard.ifsc,          cy, true, true);
  } else {
    cy += drawRow(ctx, 'Name',   order.bankCard?.accountName, cy, false);
    cy += drawRow(ctx, 'UPI ID', order.bankCard?.upi,         cy, true, true);
  }
  cy += 20; drawDashedLine(ctx, cy); cy += 1;
  cy += 14; drawBarcode(ctx, cy); cy += 22;
  cy += 12;
  ctx.font = `400 9px ${MONO}`; ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText(`${order.orderId}–${order._id?.slice(-6).toUpperCase()}`, W / 2, cy);

  ctx.restore();
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  roundRect(ctx, 0, 0, W, TOTAL_H, 16); ctx.stroke();

  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise(res => canvas.toBlob(res, 'image/png', 1));
}

/* ══ STYLES ══ */
const STYLES = `
.eh-list { display:flex; flex-direction:column; gap:10px; padding:4px 0 24px; }
.eh-card { background:#fff; border:1px solid #f0f2f5; border-radius:12px; overflow:hidden; transition:box-shadow .18s, border-color .18s; }
.eh-card:hover { box-shadow:0 2px 12px rgba(0,0,0,.07); border-color:#e4e8ee; }
.eh-main { display:flex; align-items:center; gap:10px; padding:12px 14px; cursor:pointer; user-select:none; -webkit-tap-highlight-color:transparent; }
.eh-icon { flex-shrink:0; width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; line-height:1; }
.eh-icon-success { background:#ecfdf5; color:#16a34a; }
.eh-icon-pending { background:#fffbeb; color:#d97706; }
.eh-icon-failed  { background:#fef2f2; color:#dc2626; }
.eh-center { flex:1; min-width:0; overflow:hidden; }
.eh-order-id { font-size:12px; font-weight:600; color:#1558b0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.eh-date { font-size:11px; color:#94a3b8; margin-top:1px; }
.eh-pill { display:inline-flex; align-items:center; padding:2px 7px; border-radius:20px; font-size:10px; font-weight:600; margin-top:3px; }
.eh-pill-success { background:#ecfdf5; color:#16a34a; }
.eh-pill-pending { background:#fffbeb; color:#d97706; }
.eh-pill-failed  { background:#fef2f2; color:#dc2626; }
.eh-right { text-align:right; flex-shrink:0; }
.eh-amount { font-size:15px; font-weight:700; color:#0f172a; line-height:1; }
.eh-usdt { font-size:10px; color:#94a3b8; margin-top:2px; }
.eh-chevron { color:#d1d5db; transition:transform .2s; flex-shrink:0; }
.eh-chevron.open { transform:rotate(180deg); }
.eh-prog-wrap { padding:0 14px 1px; }
.eh-prog-bg { background:#f1f5f9; border-radius:99px; height:3px; }
.eh-prog-fill { height:100%; border-radius:99px; transition:width .5s ease; }
.eh-prog-fill-success { background:linear-gradient(90deg,#22c55e,#86efac); }
.eh-prog-fill-pending { background:linear-gradient(90deg,#f59e0b,#fcd34d); }
.eh-prog-fill-failed  { background:#fca5a5; }
.eh-expand { border-top:1px solid #f5f7fa; padding:12px 14px 14px; animation:ehExpand .18s ease; }
@keyframes ehExpand { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
.eh-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.eh-detail-box { background:#f8fafc; border-radius:10px; padding:10px 11px; min-width:0; }
.eh-detail-title { font-size:10px; font-weight:600; letter-spacing:1px; color:#94a3b8; text-transform:uppercase; margin-bottom:7px; }
.eh-detail-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; gap:4px; }
.eh-detail-row:last-child { margin-bottom:0; }
.eh-detail-label { font-size:11px; color:#94a3b8; flex-shrink:0; }
.eh-detail-val { font-size:11px; color:#111827; font-weight:500; text-align:right; word-break:break-all; min-width:0; overflow:hidden; }
.eh-countdown { display:flex; align-items:center; gap:6px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:7px 11px; font-size:12px; font-weight:600; color:#ea580c; margin-bottom:10px; width:100%; box-sizing:border-box; }
.eh-actions { display:flex; gap:8px; margin-top:10px; }
.eh-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:none; border-radius:9px; padding:9px 0; font-size:12px; font-weight:600; cursor:pointer; transition:background .15s, opacity .15s; -webkit-tap-highlight-color:transparent; }
.eh-btn-receipt { background:#0f172a; color:#fff; }
.eh-btn-receipt:hover { background:#1e293b; }
.eh-receipts-label { font-size:10px; font-weight:600; letter-spacing:1px; color:#94a3b8; text-transform:uppercase; margin-top:12px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; }
.eh-receipts-strip { display:flex; flex-wrap:wrap; gap:6px; width:100%; }
.eh-receipt-thumb { border:1px solid #e2e8f0; border-radius:8px; padding:4px; display:flex; flex-direction:column; align-items:center; gap:3px; flex-shrink:0; }
.eh-receipt-dl { color:#64748b; display:flex; align-items:center; }
.slip-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:1200; display:flex; align-items:flex-end; justify-content:center; animation:slipFadeIn .2s ease; }
@keyframes slipFadeIn { from{opacity:0} to{opacity:1} }
@media (min-width:540px) { .slip-backdrop { align-items:center; padding:20px; } }
.slip-sheet { width:100%; max-width:420px; background:#f8fafc; border-radius:22px 22px 0 0; max-height:92vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 -4px 30px rgba(0,0,0,.15); animation:sheetUp .28s cubic-bezier(.32,1,.4,1); }
@keyframes sheetUp { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
@media (min-width:540px) { .slip-sheet { border-radius:22px; animation:slipFadeIn .2s ease; box-shadow:0 20px 60px rgba(0,0,0,.22); } }
.slip-topbar { flex-shrink:0; display:flex; align-items:center; justify-content:center; padding:10px 16px 4px; position:relative; background:#f8fafc; }
.slip-handle { width:36px; height:4px; background:#e2e8f0; border-radius:99px; }
@media (min-width:540px) { .slip-handle { display:none; } }
.slip-close { position:absolute; right:16px; top:8px; width:28px; height:28px; border-radius:50%; background:#e2e8f0; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.slip-close:hover { background:#d1d5db; }
.slip-scroll { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:8px 16px 0; }
.slip-actions { flex-shrink:0; display:flex; gap:8px; padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px)); background:#f8fafc; border-top:1px solid #e2e8f0; }
.slip-act-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:11px 0; border-radius:11px; border:none; cursor:pointer; font-size:13px; font-weight:700; transition:opacity .15s, background .15s; -webkit-tap-highlight-color:transparent; }
.slip-act-btn:disabled { opacity:.5; cursor:not-allowed; }
.slip-act-btn:active:not(:disabled) { opacity:.78; }
.slip-act-dl { background:#0f172a; color:#fff; }
.slip-act-dl:hover:not(:disabled) { background:#1e293b; }
.slip-act-sh { background:#e2e8f0; color:#0f172a; }
.slip-act-sh:hover:not(:disabled) { background:#d1d5db; }
.slip-spin { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; flex-shrink:0; }
.slip-spin.dark { border-color:rgba(0,0,0,.12); border-top-color:#111; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

const formatTimeLeft = (ms) => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t/3600)).padStart(2,'0')}h ${String(Math.floor((t%3600)/60)).padStart(2,'0')}m ${String(t%60).padStart(2,'0')}s`;
};

/* ─── TransactionSlip modal ────────────────────────────────────── */
const TransactionSlip = ({ order, onClose }) => {
  const [busy, setBusy] = useState('');

  const getBlob = () => {
    const c = drawReceipt(order);
    return canvasToBlob(c);
  };

  const handleDownload = async () => {
    setBusy('dl');
    try {
      const blob = await getBlob();
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `receipt_${order.orderId}.png` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch(e) { console.error(e); } finally { setBusy(''); }
  };

  const handleShare = async () => {
    setBusy('sh');
    try {
      const blob = await getBlob();
      const file = new File([blob], `receipt_${order.orderId}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `Receipt #${order.orderId}`, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: `Receipt #${order.orderId}`, text: `₹${Number(order.fiat).toLocaleString('en-IN')} — #${order.orderId}` });
      } else {
        await handleDownload(); return;
      }
    } catch(e) { if (e.name !== 'AbortError') console.error(e); } finally { setBusy(''); }
  };

  return (
    <div className="slip-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slip-sheet">
        <div className="slip-topbar">
          <div className="slip-handle"/>
          <button className="slip-close" onClick={onClose}><X size={13} color="#374151"/></button>
        </div>

        {/* ── Preview: pure React JSX — always pixel-perfect ── */}
        <div className="slip-scroll">
          <ReceiptPreview order={order} />
          <div style={{ height: 12 }}/>
        </div>

        <div className="slip-actions">
          <button className="slip-act-btn slip-act-dl" onClick={handleDownload} disabled={!!busy}>
            {busy === 'dl' ? <><div className="slip-spin"/>Saving…</> : <><DownloadIcon size={14}/>Save Image</>}
          </button>
          <button className="slip-act-btn slip-act-sh" onClick={handleShare} disabled={!!busy}>
            {busy === 'sh' ? <><div className="slip-spin dark"/>Preparing…</> : <><Share2 size={14}/>Share</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── OrderCard ─────────────────────────────────────────────────── */
const OrderCard = ({ value, timeLeft, onViewSlip }) => {
  const [open, setOpen] = useState(false);
  const pct = Math.round((value.fulfilledRatio || 0) * 100);
  const s   = value.status;
  const dateLabel = value.createdAt
    ? new Date(value.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="eh-card">
      <div className="eh-main" onClick={() => setOpen(o => !o)}>
        <div className={`eh-icon eh-icon-${s}`}>{s==='success'?'✓':s==='pending'?'◎':'✕'}</div>
        <div className="eh-center">
          <div className="eh-order-id">#{value.orderId}</div>
          <div className="eh-date">{dateLabel}</div>
          <span className={`eh-pill eh-pill-${s}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
        </div>
        <div className="eh-right">
          <div className="eh-amount">₹{Number(value.fiat).toLocaleString('en-IN')}</div>
          <div className="eh-usdt">{value.usdt} USDT</div>
        </div>
        <ChevronDown size={16} className={`eh-chevron${open?' open':''}`}/>
      </div>
      <div className="eh-prog-wrap">
        <div className="eh-prog-bg">
          <div className={`eh-prog-fill eh-prog-fill-${s}`} style={{width:pct+'%'}}/>
        </div>
      </div>
      {open && (
        <div className="eh-expand">
          {s==='pending' && timeLeft>0 && (
            <div className="eh-countdown">⏱ {formatTimeLeft(timeLeft)} remaining</div>
          )}
          <div className="eh-detail-grid">
            <div className="eh-detail-box">
              <div className="eh-detail-title">Fund</div>
              <div className="eh-detail-row"><span className="eh-detail-label">Type</span><span className="eh-detail-val" style={{textTransform:'capitalize'}}>{value.fund?.type}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Rate</span><span className="eh-detail-val">₹{value.fund?.rate}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Fulfilled</span><span className="eh-detail-val">₹{Number(value.fulfilledFiat).toLocaleString('en-IN')}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Progress</span><span className="eh-detail-val">{pct}%</span></div>
            </div>
            <div className="eh-detail-box">
              <div className="eh-detail-title">{value.bankCard?.mode==='upi'?'UPI':'Bank'}</div>
              {value.bankCard?.mode==='bank' ? (<>
                <div className="eh-detail-row"><span className="eh-detail-label">Name</span><span className="eh-detail-val">{value.bankCard.accountName}</span></div>
                <div className="eh-detail-row"><span className="eh-detail-label">Acc No.</span><span className="eh-detail-val">{value.bankCard.accountNumber}</span></div>
                <div className="eh-detail-row"><span className="eh-detail-label">IFSC</span><span className="eh-detail-val">{value.bankCard.ifsc}</span></div>
              </>) : (<>
                <div className="eh-detail-row"><span className="eh-detail-label">Name</span><span className="eh-detail-val">{value.bankCard?.accountName}</span></div>
                <div className="eh-detail-row"><span className="eh-detail-label">UPI ID</span><span className="eh-detail-val">{value.bankCard?.upi}</span></div>
              </>)}
            </div>
          </div>
          <div className="eh-actions">
            <button className="eh-btn eh-btn-receipt" onClick={() => onViewSlip(value)}>
              <FileText size={13}/> View Receipt
            </button>
          </div>
          {value.receipts?.length > 0 && (<>
            <div className="eh-receipts-label">
              <span>Receipts</span>
              <span>₹{value.fulfilledFiat} / ₹{value.fiat}</span>
            </div>
            <div className="eh-receipts-strip">
              {value.receipts.map((r,i) => (
                <div key={i} className="eh-receipt-thumb">
                  <Image width={44} height={44} src={r}
                    style={{borderRadius:6, objectFit:'cover', display:'block'}}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="/>
                  <a href={r} download target="_blank" rel="noopener noreferrer" className="eh-receipt-dl">
                    <DownloadIcon size={12}/>
                  </a>
                </div>
              ))}
            </div>
          </>)}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
const App = ({ open, setOpenDrawer }) => {
  const [loading, setLoading]               = useState(false);
  const [orders, setOrders]                 = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [slipOrder, setSlipOrder]           = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await usersGet('/order');
      if (res.success) {
        setOrders(res.orders);
        const timers = {};
        res.orders.forEach(o => {
          const mx = o?.fund?.maxFulfillmentTime;
          timers[o._id] = Math.max(new Date(o.createdAt).getTime() + (mx??3)*3600000 - Date.now(), 0);
        });
        setRemainingTimes(timers);
      }
    } catch(e) { console.log(e); } finally { setLoading(false); }
  };

  useEffect(() => { if (open) fetchOrders(); }, [open]);

  useEffect(() => {
    const t = setInterval(() => {
      setRemainingTimes(prev => {
        const u={};
        for(const id in prev) u[id]=Math.max(prev[id]-1000,0);
        return u;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <Drawer
        closable destroyOnClose placement="right" width="100%"
        loading={loading} getContainer={false} open={open} onClose={setOpenDrawer}
        closeIcon={<ArrowLeft size={20}/>}
        title={<Text strong style={{fontSize:15}}>Exchange History</Text>}
      >
        {orders.length
          ? <div className="eh-list">
              {orders.map(v => (
                <OrderCard key={v._id} value={v}
                  timeLeft={remainingTimes[v._id]} onViewSlip={setSlipOrder}/>
              ))}
            </div>
          : <EmptyBox/>
        }
      </Drawer>
      {slipOrder && <TransactionSlip order={slipOrder} onClose={() => setSlipOrder(null)}/>}
    </>
  );
};

export default App;