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

.eh-card {
  background:#fff; border:1px solid #f0f2f5;
  border-radius:12px; overflow:hidden;
  transition:box-shadow .18s, border-color .18s;
}
.eh-card:hover { box-shadow:0 2px 12px rgba(0,0,0,.07); border-color:#e4e8ee; }
.eh-main {
  display:flex; align-items:center; gap:10px;
  padding:12px 14px; cursor:pointer;
  user-select:none; -webkit-tap-highlight-color:transparent;
}
.eh-icon {
  flex-shrink:0; width:38px; height:38px; border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  font-size:15px; font-weight:700; line-height:1;
}
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
.eh-usdt   { font-size:10px; color:#94a3b8; margin-top:2px; }
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
.eh-countdown {
  display:flex; align-items:center; gap:6px;
  background:#fff7ed; border:1px solid #fed7aa; border-radius:8px;
  padding:7px 11px; font-size:12px; font-weight:600; color:#ea580c;
  margin-bottom:10px; width:100%; box-sizing:border-box;
}
.eh-actions { display:flex; gap:8px; margin-top:10px; }
.eh-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
  border:none; border-radius:9px; padding:9px 0;
  font-size:12px; font-weight:600; cursor:pointer;
  transition:background .15s, opacity .15s; -webkit-tap-highlight-color:transparent;
}
.eh-btn-receipt { background:#0f172a; color:#fff; }
.eh-btn-receipt:hover { background:#1e293b; }
.eh-receipts-label {
  font-size:10px; font-weight:600; letter-spacing:1px; color:#94a3b8;
  text-transform:uppercase; margin-top:12px; margin-bottom:6px;
  display:flex; justify-content:space-between; align-items:center;
}
.eh-receipts-strip { display:flex; flex-wrap:wrap; gap:6px; width:100%; }
.eh-receipt-thumb {
  border:1px solid #e2e8f0; border-radius:8px; padding:4px;
  display:flex; flex-direction:column; align-items:center; gap:3px; flex-shrink:0;
}
.eh-receipt-dl { color:#64748b; display:flex; align-items:center; }

/* ════════════════════════════════════════
   SLIP MODAL
════════════════════════════════════════ */
.slip-backdrop {
  position:fixed; inset:0; background:rgba(0,0,0,.6);
  z-index:1200; display:flex; align-items:flex-end; justify-content:center;
  animation:slipFadeIn .2s ease;
}
@keyframes slipFadeIn { from{opacity:0} to{opacity:1} }
@media (min-width:540px) { .slip-backdrop { align-items:center; padding:20px; } }

.slip-sheet {
  width:100%; max-width:400px; background:#fff;
  border-radius:22px 22px 0 0; max-height:92vh;
  display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 -4px 30px rgba(0,0,0,.15);
  animation:sheetUp .28s cubic-bezier(.32,1,.4,1);
}
@keyframes sheetUp { from{transform:translateY(80px);opacity:0} to{transform:translateY(0);opacity:1} }
@media (min-width:540px) {
  .slip-sheet { border-radius:22px; animation:slipFadeIn .2s ease; box-shadow:0 20px 60px rgba(0,0,0,.22); }
}
.slip-topbar {
  flex-shrink:0; display:flex; align-items:center; justify-content:center;
  padding:10px 16px 4px; position:relative;
}
.slip-handle { width:36px; height:4px; background:#e2e8f0; border-radius:99px; }
@media (min-width:540px) { .slip-handle { display:none; } }
.slip-close {
  position:absolute; right:16px; top:8px;
  width:28px; height:28px; border-radius:50%;
  background:#f1f5f9; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:background .15s;
}
.slip-close:hover { background:#e2e8f0; }
.slip-scroll { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; }
.slip-card-wrap { padding:12px 12px 0; display:flex; justify-content:center; }

/* ── THE SLIP CARD ── */
.slip-card {
  width:340px; max-width:100%;
  background:#ffffff; border-radius:16px;
  overflow:hidden; border:1px solid #e2e8f0;
  box-sizing:border-box;
}

/* ── HEADER — SVG background, fully contained, no pseudo overflow ── */
.slip-hd {
  position:relative;
  background:#0c1628;
  padding:22px 20px 20px;
  overflow:hidden; /* clips the SVG circles perfectly */
}
/* The SVG decorative layer sits behind content via z-index */
.slip-hd-bg {
  position:absolute; inset:0; width:100%; height:100%;
  pointer-events:none;
}
/* All text content sits above the SVG */
.slip-hd-content { position:relative; z-index:1; }
.slip-hd-label {
  font-size:9px; font-weight:700; letter-spacing:2.5px;
  color:#4e7ab5; text-transform:uppercase; margin-bottom:10px;
  display:flex; align-items:center; gap:6px;
}
.slip-hd-label-line {
  flex:1; height:1px; background:rgba(255,255,255,.08);
}
.slip-hd-amount {
  font-size:32px; font-weight:700; color:#ffffff;
  letter-spacing:-0.5px; line-height:1; margin-bottom:4px;
}
.slip-hd-subamt {
  font-size:11px; color:#4e7ab5; margin-bottom:14px; letter-spacing:.2px;
}
/* badge — inline element, solid bg, no box artifacts */
.slip-badge {
  display:inline-flex; align-items:center; gap:5px;
  padding:5px 13px; border-radius:20px;
  font-size:11px; font-weight:700; letter-spacing:.3px;
  /* no border, no box-shadow — just flat solid colour */
}
.slip-badge-success { background:#14532d; color:#86efac; }
.slip-badge-pending { background:#78350f; color:#fde68a; }
.slip-badge-failed  { background:#7f1d1d; color:#fca5a5; }

/* ── wavy SVG separator ── */
.slip-wave-wrap {
  background:#0c1628; /* matches header, so the wave starts on dark */
  line-height:0;
}
.slip-wave-wrap svg { display:block; width:100%; }

/* body */
.slip-bd { padding:2px 20px 16px; background:#ffffff; }
.slip-section {
  font-size:9px; font-weight:700; letter-spacing:2px; color:#94a3b8;
  text-transform:uppercase; padding:12px 0 6px;
  border-bottom:1px solid #f1f5f9; margin-bottom:2px;
}
.slip-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:7px 0; border-bottom:1px solid #f8fafc;
}
.slip-row:last-of-type { border-bottom:none; }
.slip-lbl { font-size:12px; color:#94a3b8; flex-shrink:0; }
.slip-val { font-size:12px; color:#111827; font-weight:600; text-align:right; max-width:60%; word-break:break-word; }
.slip-val.mono { font-family:monospace; letter-spacing:.3px; }
.slip-tag {
  background:#eff6ff; border-radius:5px; padding:2px 8px;
  font-family:monospace; font-size:11px; color:#1d4ed8; font-weight:700;
  display:inline-block; letter-spacing:.3px;
}
.slip-dash { border:none; border-top:1.5px dashed #e2e8f0; margin:12px 0 10px; }
.slip-barcode { display:flex; gap:2px; justify-content:center; margin-bottom:4px; }
.slip-bar { height:22px; border-radius:1px; background:#d1d5db; }
.slip-ref { text-align:center; font-size:9px; color:#cbd5e1; font-family:monospace; letter-spacing:1.5px; }
.slip-ft { background:#f8fafc; border-top:1px solid #e2e8f0; padding:10px 20px; text-align:center; }
.slip-ft-text { font-size:9.5px; color:#94a3b8; }
.slip-ft-ref { font-family:monospace; font-size:8.5px; color:#cbd5e1; margin-top:3px; letter-spacing:1px; }

/* action buttons */
.slip-actions {
  flex-shrink:0; display:flex; gap:8px;
  padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));
  background:#fff; border-top:1px solid #f1f5f9;
}
.slip-act-btn {
  flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
  padding:11px 0; border-radius:11px; border:none; cursor:pointer;
  font-size:13px; font-weight:700;
  transition:opacity .15s, background .15s; -webkit-tap-highlight-color:transparent;
}
.slip-act-btn:disabled { opacity:.5; cursor:not-allowed; }
.slip-act-btn:active:not(:disabled) { opacity:.78; }
.slip-act-dl { background:#0f172a; color:#fff; }
.slip-act-dl:hover:not(:disabled) { background:#1e293b; }
.slip-act-sh { background:#f1f5f9; color:#0f172a; }
.slip-act-sh:hover:not(:disabled) { background:#e2e8f0; }
.slip-spin {
  width:14px; height:14px; border-radius:50%;
  border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
  animation:spin .7s linear infinite; flex-shrink:0;
}
.slip-spin.dark { border-color:rgba(0,0,0,.12); border-top-color:#111; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

/* ─── helpers ──────────────────────────────────────────────────────── */
const badgeClass = (s) =>
  s === 'success' ? 'slip-badge-success'
  : s === 'pending' ? 'slip-badge-pending'
  : 'slip-badge-failed';

const badgeLabel = (s) =>
  s === 'success' ? '✓  Completed'
  : s === 'pending' ? '◎  Pending'
  : '✕  Failed';

const formatTimeLeft = (ms) => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t/3600)).padStart(2,'0')}h ${String(Math.floor((t%3600)/60)).padStart(2,'0')}m ${String(t%60).padStart(2,'0')}s`;
};

const BARS = [3,5,2,7,4,6,2,8,3,5,7,2,4,6,3,5,2,7,4,6,2,5,3,4,7,2,6,3,5,4];
const Barcode = () => (
  <div className="slip-barcode">
    {BARS.map((w,i) => <div key={i} className="slip-bar" style={{width:w+'px', opacity:0.4+(i%3)*0.18}} />)}
  </div>
);

/* ─── SVG header background — fully contained, no bleed ──────────── */
const SlipHeaderBg = () => (
  <svg
    className="slip-hd-bg"
    viewBox="0 0 340 130"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* gradient mesh */}
    <defs>
      <radialGradient id="rg1" cx="85%" cy="15%" r="55%">
        <stop offset="0%" stopColor="#1e4080" stopOpacity="1"/>
        <stop offset="100%" stopColor="#0c1628" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="rg2" cx="10%" cy="90%" r="40%">
        <stop offset="0%" stopColor="#163060" stopOpacity="1"/>
        <stop offset="100%" stopColor="#0c1628" stopOpacity="0"/>
      </radialGradient>
    </defs>
    {/* base gradient layer */}
    <rect width="340" height="130" fill="url(#rg1)"/>
    <rect width="340" height="130" fill="url(#rg2)"/>
    {/* big circle top-right — clipped inside viewBox, cannot bleed */}
    <circle cx="300" cy="-10" r="90" fill="#1a3a6e" opacity="0.55"/>
    {/* small circle bottom-left */}
    <circle cx="30" cy="120" r="52" fill="#122a52" opacity="0.5"/>
    {/* subtle diagonal stripe */}
    <line x1="0" y1="130" x2="340" y2="0" stroke="#ffffff" strokeWidth="0.4" opacity="0.04"/>
    <line x1="60" y1="130" x2="340" y2="40" stroke="#ffffff" strokeWidth="0.4" opacity="0.04"/>
    {/* top accent bar */}
    <rect x="0" y="0" width="340" height="2" fill="#2255a4" opacity="0.6"/>
  </svg>
);

/* ─── lazy html2canvas ─────────────────────────────────────────────── */
function loadH2C() {
  return new Promise((res) => {
    if (window.html2canvas) return res(window.html2canvas);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = () => res(window.html2canvas);
    document.head.appendChild(s);
  });
}

async function captureCard(el) {
  const h2c = await loadH2C();
  return new Promise((res, rej) => {
    h2c(el, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: el.offsetWidth,
      height: el.offsetHeight,
      logging: false,
      onclone(doc) {
        const card = doc.querySelector('.slip-card');
        if (card) { card.style.width = el.offsetWidth + 'px'; card.style.margin = '0'; }

        /* force header bg */
        const hd = doc.querySelector('.slip-hd');
        if (hd) hd.style.backgroundColor = '#0c1628';

        /* force badge colours */
        const badge = doc.querySelector('.slip-badge');
        if (badge) {
          const map = {
            'slip-badge-success': ['#14532d','#86efac'],
            'slip-badge-pending': ['#78350f','#fde68a'],
            'slip-badge-failed' : ['#7f1d1d','#fca5a5'],
          };
          for (const [cls, [bg, fg]] of Object.entries(map)) {
            if (badge.classList.contains(cls)) {
              badge.style.backgroundColor = bg;
              badge.style.color = fg;
              break;
            }
          }
        }

        /* force tags */
        doc.querySelectorAll('.slip-tag').forEach(t => {
          t.style.backgroundColor = '#eff6ff';
          t.style.color = '#1d4ed8';
        });

        /* wave wrapper bg */
        const ww = doc.querySelector('.slip-wave-wrap');
        if (ww) ww.style.backgroundColor = '#0c1628';

        /* footer */
        const ft = doc.querySelector('.slip-ft');
        if (ft) ft.style.backgroundColor = '#f8fafc';
      },
    })
    .then(canvas => canvas.toBlob(blob => res(blob), 'image/png', 1))
    .catch(rej);
  });
}

/* ─── TransactionSlip ──────────────────────────────────────────────── */
const TransactionSlip = ({ order, onClose }) => {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState('');

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day:'2-digit', month:'short', year:'numeric',
        hour:'2-digit', minute:'2-digit', hour12:true,
      })
    : '—';

  const capture = () => captureCard(cardRef.current);

  const handleDownload = async () => {
    setBusy('dl');
    try {
      const blob = await capture();
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href:url, download:`receipt_${order.orderId}.png` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch(e) { console.error(e); }
    finally { setBusy(''); }
  };

  const handleShare = async () => {
    setBusy('sh');
    try {
      const blob = await capture();
      const file = new File([blob], `receipt_${order.orderId}.png`, { type:'image/png' });
      if (navigator.canShare?.({ files:[file] })) {
        await navigator.share({ title:`Receipt #${order.orderId}`, files:[file] });
      } else if (navigator.share) {
        await navigator.share({ title:`Receipt #${order.orderId}`,
          text:`₹${Number(order.fiat).toLocaleString('en-IN')} — Order #${order.orderId}` });
      } else {
        await handleDownload(); return;
      }
    } catch(e) { if (e.name !== 'AbortError') console.error(e); }
    finally { setBusy(''); }
  };

  return (
    <div className="slip-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="slip-sheet">

        <div className="slip-topbar">
          <div className="slip-handle" />
          <button className="slip-close" onClick={onClose}>
            <X size={13} color="#374151" />
          </button>
        </div>

        <div className="slip-scroll">
          <div className="slip-card-wrap">
            <div ref={cardRef} className="slip-card">

              {/* ── HEADER with inline SVG bg ── */}
              <div className="slip-hd">
                <SlipHeaderBg />
                <div className="slip-hd-content">
                  <div className="slip-hd-label">
                    Transaction Receipt
                    <span className="slip-hd-label-line" />
                  </div>
                  <div className="slip-hd-amount">
                    ₹{Number(order.fiat).toLocaleString('en-IN')}
                  </div>
                  <div className={`slip-badge ${badgeClass(order.status)}`}>
                    {badgeLabel(order.status)}
                  </div>
                </div>
              </div>

              {/* ── body ── */}
              <div className="slip-bd">
                <div className="slip-section">Transaction Details</div>
                <div className="slip-row">
                  <span className="slip-lbl">Order ID</span>
                  <span className="slip-tag">#{order.orderId}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-lbl">UTR</span>
                  <span className="slip-tag">{order.TXID ? `#${order.TXID}` : 'Pending'}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-lbl">Date &amp; Time</span>
                  <span className="slip-val" style={{fontSize:11}}>{dateStr}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-lbl">Amount (INR)</span>
                  <span className="slip-val mono">₹{Number(order.fiat).toLocaleString('en-IN')}</span>
                </div>

                <div className="slip-section">
                  {order.bankCard?.mode === 'upi' ? 'UPI Details' : 'Bank Details'}
                </div>
                {order.bankCard?.mode === 'bank' ? (<>
                  <div className="slip-row"><span className="slip-lbl">Account Name</span><span className="slip-val">{order.bankCard.accountName}</span></div>
                  <div className="slip-row"><span className="slip-lbl">Account No.</span><span className="slip-val mono">{order.bankCard.accountNumber}</span></div>
                  <div className="slip-row"><span className="slip-lbl">IFSC</span><span className="slip-val mono">{order.bankCard.ifsc}</span></div>
                </>) : (<>
                  <div className="slip-row"><span className="slip-lbl">Name</span><span className="slip-val">{order.bankCard?.accountName}</span></div>
                  <div className="slip-row"><span className="slip-lbl">UPI ID</span><span className="slip-val mono">{order.bankCard?.upi}</span></div>
                </>)}

                <hr className="slip-dash" />
                <Barcode />
                <div className="slip-ref">{order.orderId}–{order._id?.slice(-6).toUpperCase()}</div>
              </div>

            </div>
          </div>
          <div style={{height:16}} />
        </div>

        <div className="slip-actions">
          <button className="slip-act-btn slip-act-dl" onClick={handleDownload} disabled={!!busy}>
            {busy==='dl' ? <><div className="slip-spin"/>Saving…</> : <><DownloadIcon size={14}/>Save Image</>}
          </button>
          <button className="slip-act-btn slip-act-sh" onClick={handleShare} disabled={!!busy}>
            {busy==='sh' ? <><div className="slip-spin dark"/>Preparing…</> : <><Share2 size={14}/>Share</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── OrderCard ────────────────────────────────────────────────────── */
const OrderCard = ({ value, timeLeft, onViewSlip }) => {
  const [open, setOpen] = useState(false);
  const pct = Math.round((value.fulfilledRatio || 0) * 100);
  const s   = value.status;
  const dateLabel = value.createdAt
    ? new Date(value.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
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
        <ChevronDown size={16} className={`eh-chevron${open?' open':''}`} />
      </div>

      <div className="eh-prog-wrap">
        <div className="eh-prog-bg">
          <div className={`eh-prog-fill eh-prog-fill-${s}`} style={{width:pct+'%'}} />
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
              <FileText size={13} /> View Receipt
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
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" />
                  <a href={r} download target="_blank" rel="noopener noreferrer" className="eh-receipt-dl">
                    <DownloadIcon size={12} />
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

/* ═══════════════════════════════════════════════════════════════════ */
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
    } catch(e) { console.log(e); }
    finally { setLoading(false); }
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
                  timeLeft={remainingTimes[v._id]} onViewSlip={setSlipOrder} />
              ))}
            </div>
          : <EmptyBox/>
        }
      </Drawer>
      {slipOrder && <TransactionSlip order={slipOrder} onClose={() => setSlipOrder(null)} />}
    </>
  );
};

export default App;