import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Drawer, Typography } from 'antd';
import { Image } from 'antd';
import { ArrowLeft, DownloadIcon, FileText, ChevronDown, Share2 } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import EmptyBox from '../common/EmptyBox';

import GatewayReceipt from '../receipts/GatewayReceipt';
import CleanReceipt   from '../receipts/CleanReceipt';
import BankReceipt    from '../receipts/BankReceipt';

const { Text } = Typography;

const ReceiptSelector = ({ order }) => {
  switch (order?.fund?.fundType) {
    case 'clean': return <CleanReceipt   order={order} />;
    case 'bank':  return <BankReceipt    order={order} />;
    default:      return <GatewayReceipt order={order} />;
  }
};

/* ══════════════════════════════════════════════════════════════════
   CANVAS HELPERS
══════════════════════════════════════════════════════════════════ */
const SCALE = 3;
const W     = 360;
const PAD   = 24;
const FONT  = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
const MONO  = 'ui-monospace, "SF Mono", "Courier New", monospace';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
function msr(ctx, text, font) { ctx.font = font; return ctx.measureText(String(text)).width; }

function drawSectionLabel(ctx, label, y) {
  const H = 30;
  ctx.font=`700 9px ${FONT}`; ctx.fillStyle='#94a3b8';
  ctx.textBaseline='middle'; ctx.textAlign='left';
  ctx.fillText(label.toUpperCase(), PAD, y+H/2-2);
  ctx.strokeStyle='#edf2f7'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(PAD,y+H-1); ctx.lineTo(W-PAD,y+H-1); ctx.stroke();
  return H;
}
function drawRow(ctx, label, value, y, mono, last=false) {
  const H=36, mid=y+H/2;
  ctx.font=`400 12px ${FONT}`; ctx.fillStyle='#94a3b8';
  ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillText(label, PAD, mid);
  ctx.font=`600 12px ${mono?MONO:FONT}`; ctx.fillStyle='#111827';
  ctx.textAlign='right'; ctx.fillText(String(value??''), W-PAD, mid); ctx.textAlign='left';
  if(!last){ ctx.strokeStyle='#f1f5f9'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD,y+H); ctx.lineTo(W-PAD,y+H); ctx.stroke(); }
  return H;
}
function drawTagRow(ctx, label, value, y, last=false) {
  const H=36, mid=y+H/2;
  ctx.font=`400 12px ${FONT}`; ctx.fillStyle='#94a3b8';
  ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillText(label, PAD, mid);
  ctx.font=`700 11px ${MONO}`;
  const tw=msr(ctx,value,`700 11px ${MONO}`);
  const tW=tw+20, tH=22, tX=W-PAD-tW, tY=mid-tH/2;
  roundRect(ctx,tX,tY,tW,tH,5); ctx.fillStyle='#dbeafe'; ctx.fill();
  ctx.fillStyle='#1e40af'; ctx.textBaseline='middle'; ctx.textAlign='right';
  ctx.fillText(value, W-PAD-9, mid); ctx.textAlign='left';
  if(!last){ ctx.strokeStyle='#f1f5f9'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD,y+H); ctx.lineTo(W-PAD,y+H); ctx.stroke(); }
  return H;
}
function drawDashedLine(ctx, y) {
  ctx.save(); ctx.setLineDash([5,5]); ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(PAD,y); ctx.lineTo(W-PAD,y); ctx.stroke(); ctx.restore();
}
function drawBarcode(ctx, y) {
  const bars=[3,5,2,7,4,6,2,8,3,5,7,2,4,6,3,5,2,7,4,6,2,5,3,4,7,2,6,3,5,4];
  const totalW=bars.reduce((a,b)=>a+b+2,0); let bx=(W-totalW)/2;
  bars.forEach((bw,i)=>{ ctx.fillStyle=`rgba(156,163,175,${0.38+(i%3)*0.18})`; ctx.fillRect(bx,y,bw,22); bx+=bw+2; });
}
function drawPaymentRows(ctx, order, cy) {
  if (order.bankCard?.mode === 'bank') {
    cy+=drawRow(ctx,'Account Name', order.bankCard.accountName, cy, false);
    cy+=drawRow(ctx,'Account',      order.bankCard.accountNumber, cy, true);
    cy+=drawRow(ctx,'IFSC',         order.bankCard.ifsc, cy, true, true);
  } else {
    cy+=drawRow(ctx,'Name',   order.bankCard?.accountName, cy, false);
    cy+=drawRow(ctx,'UPI ID', order.bankCard?.upi, cy, true, true);
  }
  return cy;
}
function fmtDate(order) {
  return order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})
    : '—';
}

/* ── Canvas: Gateway (unchanged) ── */
function drawGatewayReceipt(order) {
  const isBank = order.bankCard?.mode === 'bank';
  const code   = order.fund?.code || 'GW';
  const ST = {
    success:{bg:'#14532d',fg:'#86efac',text:'✓  Completed'},
    pending:{bg:'#78350f',fg:'#fde68a',text:'◎  Pending'},
    failed: {bg:'#7f1d1d',fg:'#fca5a5',text:'✕  Failed'},
  };
  const st=ST[order.status]||ST.pending;
  const HDR_H=116, WAVE_H=22, TOP_PAD=10;
  const SEC1_H=30+36*5, SEC2_H=30+36*(isBank?3:2);
  const BOT=20+1+14+22+12+14+6;
  const TOTAL_H=HDR_H+WAVE_H+TOP_PAD+SEC1_H+14+SEC2_H+BOT;
  const canvas=document.createElement('canvas');
  canvas.width=W*SCALE; canvas.height=TOTAL_H*SCALE;
  const ctx=canvas.getContext('2d'); ctx.scale(SCALE,SCALE);
  roundRect(ctx,0,0,W,TOTAL_H,16); ctx.fillStyle='#fff'; ctx.fill();
  ctx.save(); roundRect(ctx,0,0,W,TOTAL_H,16); ctx.clip();
  let cy=0;
  (()=>{
    const BADGE_H=26,BADGE_R=13,BADGE_Y=76,H=HDR_H;
    ctx.save(); ctx.beginPath(); ctx.rect(0,cy,W,H); ctx.clip();
    ctx.fillStyle='#0c1628'; ctx.fillRect(0,cy,W,H);
    const g1=ctx.createRadialGradient(W*.88,cy,0,W*.88,cy,W*.65);
    g1.addColorStop(0,'rgba(28,60,124,0.95)'); g1.addColorStop(1,'rgba(12,22,40,0)');
    ctx.fillStyle=g1; ctx.fillRect(0,cy,W,H);
    ctx.beginPath(); ctx.arc(W-36,cy-22,82,0,Math.PI*2);
    ctx.fillStyle='rgba(24,52,104,0.5)'; ctx.fill();
    ctx.fillStyle='rgba(34,85,164,0.55)'; ctx.fillRect(0,cy,W,2);
    ctx.restore();
    ctx.font=`700 9px ${MONO}`; const cw=msr(ctx,code,`700 9px ${MONO}`)+16;
    roundRect(ctx,W-PAD-cw,cy+12,cw,18,4);
    ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#93c5fd'; ctx.textBaseline='middle'; ctx.textAlign='center';
    ctx.fillText(code,W-PAD-cw/2,cy+21); ctx.textAlign='left';
    ctx.font=`700 9px ${FONT}`; ctx.fillStyle='#5a85c0';
    ctx.textBaseline='top'; ctx.fillText('TRANSACTION RECEIPT',PAD,cy+14);
    ctx.font=`700 32px ${FONT}`; ctx.fillStyle='#fff';
    ctx.textBaseline='top'; ctx.fillText(`₹${Number(order.fiat).toLocaleString('en-IN')}`,PAD,cy+32);
    ctx.font=`700 12px ${FONT}`;
    const bw=msr(ctx,st.text,`700 12px ${FONT}`)+30;
    roundRect(ctx,PAD,cy+BADGE_Y,bw,BADGE_H,BADGE_R);
    ctx.fillStyle=st.bg; ctx.fill();
    ctx.fillStyle=st.fg; ctx.textBaseline='middle'; ctx.textAlign='left';
    ctx.fillText(st.text,PAD+15,cy+BADGE_Y+BADGE_H/2);
    cy+=H;
  })();
  ctx.fillStyle='#0c1628'; ctx.fillRect(0,cy,W,22);
  ctx.beginPath(); ctx.moveTo(0,cy);
  ctx.bezierCurveTo(W*.18,cy+22,W*.36,cy+22,W*.5,cy+11);
  ctx.bezierCurveTo(W*.64,cy,W*.82,cy,W,cy+22);
  ctx.lineTo(W,cy+22); ctx.lineTo(0,cy+22); ctx.closePath();
  ctx.fillStyle='#fff'; ctx.fill(); cy+=22;
  cy+=TOP_PAD;
  cy+=drawSectionLabel(ctx,'Transaction Details',cy);
  cy+=drawTagRow(ctx,'Order ID',`#${order.orderId}`,cy);
  cy+=drawTagRow(ctx,'Ref Code',code,cy);
  cy+=drawRow(ctx,'UTR',order.UTR||'Pending',cy,true);
  cy+=drawRow(ctx,'Date & Time',fmtDate(order),cy,false);
  cy+=drawRow(ctx,'Amount (INR)',`₹${Number(order.fiat).toLocaleString('en-IN')}`,cy,true,true);
  cy+=14;
  cy+=drawSectionLabel(ctx,order.bankCard?.mode==='bank'?'Bank Details':'UPI Details',cy);
  cy=drawPaymentRows(ctx,order,cy);
  cy+=20; drawDashedLine(ctx,cy); cy+=1;
  cy+=14; drawBarcode(ctx,cy); cy+=22; cy+=12;
  ctx.font=`400 9px ${MONO}`; ctx.fillStyle='#cbd5e1';
  ctx.textAlign='center'; ctx.textBaseline='top';
  ctx.fillText(`${code}–${order.orderId}–${order._id?.slice(-6).toUpperCase()}`,W/2,cy);
  ctx.restore();
  ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1;
  roundRect(ctx,0,0,W,TOTAL_H,16); ctx.stroke();
  return canvas;
}

/* ── Canvas: Clean — synced to updated CleanReceipt.jsx ──
   Changes from JSX:
   - Removed "Ref Code" row (kept code chip in banner only)
   - Order ID shows `#orderId-code` format
   - No separate Ref Code row
   - Footer ref block retained
───────────────────────────────────────────────────────── */
function drawCleanReceipt(order) {
  const isBank = order.bankCard?.mode === 'bank';
  const code   = order.fund?.code || 'CF';
  const ST = {
    success:{color:'#16a34a',bg:'#f0fdf4',icon:'✓',label:'Payment Successful'},
    pending:{color:'#d97706',bg:'#fffbeb',icon:'◌',label:'Processing'},
    failed: {color:'#dc2626',bg:'#fef2f2',icon:'✕',label:'Payment Failed'},
  };
  const st=ST[order.status]||ST.pending;
  const rows2=isBank?3:2;
  // Rows: Order ID, UTR, Amount = 3 rows (removed Ref Code row)
  const BANNER_H=140, BODY_TOP=8;
  const TOTAL_H=BANNER_H+BODY_TOP+30+36*3+12+30+36*rows2+14+28+16;
  const canvas=document.createElement('canvas');
  canvas.width=W*SCALE; canvas.height=TOTAL_H*SCALE;
  const ctx=canvas.getContext('2d'); ctx.scale(SCALE,SCALE);
  roundRect(ctx,0,0,W,TOTAL_H,16); ctx.fillStyle='#fff'; ctx.fill();
  ctx.save(); roundRect(ctx,0,0,W,TOTAL_H,16); ctx.clip();

  // Banner bg
  ctx.fillStyle=st.bg; ctx.fillRect(0,0,W,BANNER_H);
  ctx.strokeStyle=st.color+'22'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(0,BANNER_H); ctx.lineTo(W,BANNER_H); ctx.stroke();
  // Fund code chip top-right
  ctx.font=`700 9px ${MONO}`; const cw=msr(ctx,code,`700 9px ${MONO}`)+16;
  roundRect(ctx,W-PAD-cw,12,cw,18,4); ctx.fillStyle='#f1f5f9'; ctx.fill();
  ctx.fillStyle='#64748b'; ctx.textBaseline='middle'; ctx.textAlign='center';
  ctx.fillText(code,W-PAD-cw/2,21); ctx.textAlign='left';
  // Icon circle
  ctx.beginPath(); ctx.arc(W/2,52,26,0,Math.PI*2);
  ctx.fillStyle=st.color; ctx.fill();
  ctx.font=`700 20px ${FONT}`; ctx.fillStyle='#fff';
  ctx.textBaseline='middle'; ctx.textAlign='center'; ctx.fillText(st.icon,W/2,52);
  // Status label
  ctx.font=`700 12px ${FONT}`; ctx.fillStyle=st.color;
  ctx.textBaseline='top'; ctx.fillText(st.label,W/2,85);
  // Amount
  ctx.font=`800 28px ${FONT}`; ctx.fillStyle='#0f172a';
  ctx.fillText(`₹${Number(order.fiat).toLocaleString('en-IN')}`,W/2,104);
  // Date
  ctx.font=`400 10px ${FONT}`; ctx.fillStyle='#94a3b8';
  const ds = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})
    : '—';
  ctx.fillText(ds,W/2,133);
  ctx.textAlign='left';

  // Body
  let cy=BANNER_H+BODY_TOP;
  const secLabel=(label)=>{
    ctx.font=`700 9px ${FONT}`; ctx.fillStyle='#94a3b8';
    ctx.textBaseline='middle'; ctx.textAlign='left';
    ctx.fillText(label.toUpperCase(),PAD,cy+14); cy+=30;
  };

  secLabel('Transaction');
  // Order ID with code suffix: #orderId-code (matches JSX)
  cy+=drawTagRow(ctx,'Order ID',`#${order.orderId}${code?`-${code}`:''}`,cy);
  cy+=drawRow(ctx,'UTR Number',order.UTR||'Pending',cy,true);
  cy+=drawRow(ctx,'Amount',`₹${Number(order.fiat).toLocaleString('en-IN')}`,cy,true,true);
  cy+=12;

  secLabel(isBank?'Bank Account':'UPI');
  cy=drawPaymentRows(ctx,order,cy);

  // Footer ref box
  cy+=14;
  roundRect(ctx,PAD,cy,W-PAD*2,28,8); ctx.fillStyle='#f8fafc'; ctx.fill();
  ctx.font=`400 8px ${MONO}`; ctx.fillStyle='#94a3b8';
  ctx.textBaseline='middle'; ctx.textAlign='center';
  ctx.fillText(`${code} · ${order.orderId} · ${order._id?.slice(-6).toUpperCase()}`,W/2,cy+14);
  ctx.textAlign='left';

  ctx.restore();
  ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1;
  roundRect(ctx,0,0,W,TOTAL_H,16); ctx.stroke();
  return canvas;
}

/* ── Canvas: Bank — synced to updated BankReceipt.jsx ──
   Changes from JSX:
   - No "Transaction Ref" row — removed
   - Order ID shows `#orderId(code)` format
   - Removed separate "Fund Code" row
   - "Debit Amount" moved inside Transaction Details section
   - No separate "Amount Summary" section
   - Footer: refNo + "system generated advice"
───────────────────────────────────────────────────────── */
function drawBankReceipt(order) {
  const isBank = order.bankCard?.mode === 'bank';
  const code   = order.fund?.code || 'BT';
  const now    = order.createdAt ? new Date(order.createdAt) : new Date();
  const refNo  = `${code}${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${order._id?.slice(-8).toUpperCase()}`;
  const dStr   = now.toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'});
  const tStr   = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const ST = {
    success:{color:'#15803d',label:'SUCCESS',dot:'#16a34a',bg:'#f0fdf4'},
    pending:{color:'#b45309',label:'PENDING',dot:'#d97706',bg:'#fffbeb'},
    failed: {color:'#b91c1c',label:'FAILED', dot:'#dc2626',bg:'#fef2f2'},
  };
  const st=ST[order.status]||ST.pending;

  // Transaction section: Order ID, UTR, Date, Time, Status, Debit Amount = 6 rows
  // Beneficiary: bank=4 rows, upi=2 rows
  // No Amount Summary section anymore
  const HDR=40, STATUS_H=28, AMT_H=46, SEC_H=24, ROW_H=30, FOOTER_H=28;
  const benRows = isBank ? 4 : 2;
  const TOTAL_H = HDR+STATUS_H+AMT_H+SEC_H+ROW_H*6+SEC_H+ROW_H*benRows+FOOTER_H;

  const canvas=document.createElement('canvas');
  canvas.width=W*SCALE; canvas.height=TOTAL_H*SCALE;
  const ctx=canvas.getContext('2d'); ctx.scale(SCALE,SCALE);
  roundRect(ctx,0,0,W,TOTAL_H,8); ctx.fillStyle='#fff'; ctx.fill();
  ctx.save(); roundRect(ctx,0,0,W,TOTAL_H,8); ctx.clip();

  // Navy header
  ctx.fillStyle='#1e3a5f'; ctx.fillRect(0,0,W,HDR);
  ctx.font=`800 12px ${FONT}`; ctx.fillStyle='#fff';
  ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillText('FUND TRANSFER',PAD,16);
  ctx.font=`400 8px ${FONT}`; ctx.fillStyle='#93c5fd'; ctx.fillText('NEFT / IMPS',PAD,30);
  // Code badge
  ctx.font=`700 10px ${MONO}`; const cw2=msr(ctx,code,`700 10px ${MONO}`)+16;
  roundRect(ctx,W-PAD-cw2,10,cw2,20,4);
  ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle='#bfdbfe'; ctx.textBaseline='middle'; ctx.textAlign='center';
  ctx.fillText(code,W-PAD-cw2/2,20); ctx.textAlign='left';

  // Status strip
  let cy=HDR;
  ctx.fillStyle=st.bg; ctx.fillRect(0,cy,W,STATUS_H);
  ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,cy+STATUS_H); ctx.lineTo(W,cy+STATUS_H); ctx.stroke();
  ctx.beginPath(); ctx.arc(PAD+4,cy+STATUS_H/2,3.5,0,Math.PI*2); ctx.fillStyle=st.dot; ctx.fill();
  ctx.font=`700 10px ${FONT}`; ctx.fillStyle=st.color;
  ctx.textBaseline='middle'; ctx.textAlign='left';
  ctx.fillText(`TRANSACTION ${st.label}`,PAD+12,cy+STATUS_H/2);
  ctx.font=`400 8px ${MONO}`; ctx.fillStyle='#94a3b8';
  ctx.textAlign='right'; ctx.fillText(`${dStr}  ${tStr}`,W-PAD,cy+STATUS_H/2);
  ctx.textAlign='left'; cy+=STATUS_H;

  // Amount highlight
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,cy,W,AMT_H);
  ctx.strokeStyle='#1e3a5f'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,cy+AMT_H); ctx.lineTo(W,cy+AMT_H); ctx.stroke();
  ctx.font=`400 10px ${FONT}`; ctx.fillStyle='#6b7280';
  ctx.textBaseline='middle'; ctx.fillText('Amount Transferred',PAD,cy+AMT_H/2);
  ctx.font=`800 24px ${FONT}`; ctx.fillStyle='#0f172a';
  ctx.fillText(`₹${Number(order.fiat).toLocaleString('en-IN')}`,PAD+140,cy+AMT_H/2);
  ctx.font=`400 9px ${FONT}`; ctx.fillStyle='#94a3b8';
  ctx.fillText('INR',W-PAD,cy+AMT_H/2+2); cy+=AMT_H;

  // Table row helper
  const tRow=([label,value,isLast,highlight])=>{
    ctx.fillStyle='#fafafa'; ctx.fillRect(0,cy,W*0.38,ROW_H);
    ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W*0.38,cy); ctx.lineTo(W*0.38,cy+ROW_H); ctx.stroke();
    if(!isLast){ ctx.beginPath(); ctx.moveTo(0,cy+ROW_H); ctx.lineTo(W,cy+ROW_H); ctx.stroke(); }
    ctx.font=`400 10px ${FONT}`; ctx.fillStyle='#6b7280';
    ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillText(label,PAD,cy+ROW_H/2);
    // highlight status row
    if(highlight){
      ctx.fillStyle=`${st.dot}10`; ctx.fillRect(W*0.38,cy,W*0.62,ROW_H);
      ctx.beginPath(); ctx.arc(W*0.38+10,cy+ROW_H/2,3.5,0,Math.PI*2); ctx.fillStyle=st.dot; ctx.fill();
      ctx.font=`700 10px ${FONT}`; ctx.fillStyle=st.color;
      ctx.textAlign='right'; ctx.fillText(String(value??'—'),W-PAD,cy+ROW_H/2);
    } else {
      ctx.font=`500 10px ${FONT}`; ctx.fillStyle='#111827';
      ctx.textAlign='right'; ctx.fillText(String(value??'—'),W-PAD,cy+ROW_H/2);
    }
    ctx.textAlign='left'; cy+=ROW_H;
  };

  // Section header helper
  const tSection=(title)=>{
    ctx.fillStyle='#1e3a5f'; ctx.fillRect(0,cy,W,SEC_H);
    ctx.font=`700 8px ${FONT}`; ctx.fillStyle='#e2e8f0';
    ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillText(title.toUpperCase(),PAD,cy+SEC_H/2);
    cy+=SEC_H;
  };

  // Transaction Details — Order ID uses `#orderId(code)` to match JSX
  tSection('Transaction Details');
  tRow([`Order ID`, `#${order.orderId}${code?` (${code})`:''}`]);
  tRow(['UTR Number', order.UTR||'Awaiting confirmation']);
  tRow(['Date', dStr]);
  tRow(['Time', tStr]);
  tRow(['Status', st.label, false, true]);
  tRow(['Debit Amount', `₹${Number(order.fiat).toLocaleString('en-IN')}`, true]);

  // Beneficiary Details
  tSection(isBank?'Beneficiary Details':'UPI Details');
  if(isBank){
    tRow(['Account Name',   order.bankCard.accountName]);
    tRow(['Account Number', order.bankCard.accountNumber]);
    tRow(['IFSC Code',      order.bankCard.ifsc]);
    tRow(['Bank Mode',      'NEFT / IMPS', true]);
  } else {
    tRow(['Name',   order.bankCard?.accountName]);
    tRow(['UPI ID', order.bankCard?.upi, true]);
  }

  // Footer
  ctx.fillStyle='#f8fafc'; ctx.fillRect(0,cy,W,FOOTER_H);
  ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
  ctx.font=`400 7px ${MONO}`; ctx.fillStyle='#94a3b8';
  ctx.textBaseline='middle'; ctx.textAlign='left'; ctx.fillText(refNo,PAD,cy+FOOTER_H/2);
  ctx.textAlign='right'; ctx.fillText('System generated advice',W-PAD,cy+FOOTER_H/2);
  ctx.textAlign='left';

  ctx.restore();
  ctx.strokeStyle='#cbd5e1'; ctx.lineWidth=1;
  roundRect(ctx,0,0,W,TOTAL_H,8); ctx.stroke();
  return canvas;
}

function drawReceipt(order) {
  switch (order?.fund?.fundType) {
    case 'clean': return drawCleanReceipt(order);
    case 'bank':  return drawBankReceipt(order);
    default:      return drawGatewayReceipt(order);
  }
}
function canvasToBlob(canvas) {
  return new Promise(res => canvas.toBlob(res,'image/png',1));
}

/* ══════════════════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════════════════ */
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
.eh-fund-code { display:inline-block; font-family:monospace; font-size:9px; font-weight:700; color:#64748b; background:#f1f5f9; border-radius:4px; padding:1px 5px; margin-left:4px; letter-spacing:1px; vertical-align:middle; }
.eh-countdown { display:flex; align-items:center; gap:6px; background:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:7px 11px; font-size:12px; font-weight:600; color:#ea580c; margin-bottom:10px; width:100%; box-sizing:border-box; }
.eh-actions { display:flex; gap:8px; margin-top:10px; }
.eh-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:none; border-radius:9px; padding:9px 0; font-size:12px; font-weight:600; cursor:pointer; transition:background .15s, opacity .15s; -webkit-tap-highlight-color:transparent; }
.eh-btn-receipt { background:#0f172a; color:#fff; }
.eh-btn-receipt:hover { background:#1e293b; }
.eh-receipts-label { font-size:10px; font-weight:600; letter-spacing:1px; color:#94a3b8; text-transform:uppercase; margin-top:12px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; }
.eh-receipts-strip { display:flex; flex-wrap:wrap; gap:6px; width:100%; }
.eh-receipt-thumb { border:1px solid #e2e8f0; border-radius:8px; padding:4px; display:flex; flex-direction:column; align-items:center; gap:3px; flex-shrink:0; }
.eh-receipt-dl { color:#64748b; display:flex; align-items:center; }
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
.slip-act-cl { background:#e2e8f0; color:#0f172a; max-width:76px; }
.slip-spin { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:spin .7s linear infinite; flex-shrink:0; }
.slip-spin.dark { border-color:rgba(0,0,0,.12); border-top-color:#111; }
@keyframes spin { to{transform:rotate(360deg)} }
`;

const formatTimeLeft = (ms) => {
  const t=Math.floor(ms/1000);
  return `${String(Math.floor(t/3600)).padStart(2,'0')}h ${String(Math.floor((t%3600)/60)).padStart(2,'0')}m ${String(t%60).padStart(2,'0')}s`;
};

/* ══ TransactionSlip ══ */
const TransactionSlip = ({ order, onClose }) => {
  const [busy, setBusy] = useState('');
  const code = order?.fund?.code || '';
  const getBlob = () => canvasToBlob(drawReceipt(order));

  const handleDownload = async () => {
    setBusy('dl');
    try {
      const blob=await getBlob();
      const url=URL.createObjectURL(blob);
      const a=Object.assign(document.createElement('a'),{href:url,download:`receipt_${code}_${order.orderId}.png`});
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),4000);
    } catch(e){console.error(e);} finally{setBusy('');}
  };
  const handleShare = async () => {
    setBusy('sh');
    try {
      const blob=await getBlob();
      const file=new File([blob],`receipt_${code}_${order.orderId}.png`,{type:'image/png'});
      if(navigator.canShare?.({files:[file]})) await navigator.share({title:`Receipt #${order.orderId}`,files:[file]});
      else if(navigator.share) await navigator.share({title:`Receipt #${order.orderId}`,text:`₹${Number(order.fiat).toLocaleString('en-IN')} — #${order.orderId}`});
      else { await handleDownload(); return; }
    } catch(e){if(e.name!=='AbortError')console.error(e);} finally{setBusy('');}
  };

  return ReactDOM.createPortal(
    <div className="slip-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="slip-sheet">
        <div className="slip-topbar"><div className="slip-handle"/></div>
        <div className="slip-scroll">
          <ReceiptSelector order={order}/>
          <div style={{height:12}}/>
        </div>
        <div className="slip-actions">
          <button className="slip-act-btn slip-act-dl" onClick={handleDownload} disabled={!!busy}>
            {busy==='dl'?<><div className="slip-spin"/>Saving…</>:<><DownloadIcon size={14}/>Save</>}
          </button>
          <button className="slip-act-btn slip-act-sh" onClick={handleShare} disabled={!!busy}>
            {busy==='sh'?<><div className="slip-spin dark"/>Preparing…</>:<><Share2 size={14}/>Share</>}
          </button>
          <button className="slip-act-btn slip-act-cl" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ══ OrderCard ══ */
const OrderCard = ({ value, timeLeft, onViewSlip }) => {
  const [open, setOpen] = useState(false);
  const pct=Math.round((value.fulfilledRatio||0)*100);
  const s=value.status;
  const dateLabel=value.createdAt
    ? new Date(value.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
    : '';
  return (
    <div className="eh-card">
      <div className="eh-main" onClick={()=>setOpen(o=>!o)}>
        <div className={`eh-icon eh-icon-${s}`}>{s==='success'?'✓':s==='pending'?'◎':'✕'}</div>
        <div className="eh-center">
          <div className="eh-order-id">
            #{value.orderId}
            {value.fund?.code&&<span className="eh-fund-code">{value.fund.code}</span>}
          </div>
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
      {open&&(
        <div className="eh-expand">
          {s==='pending'&&timeLeft>0&&<div className="eh-countdown">⏱ {formatTimeLeft(timeLeft)} remaining</div>}
          <div className="eh-detail-grid">
            <div className="eh-detail-box">
              <div className="eh-detail-title">Fund</div>
              <div className="eh-detail-row"><span className="eh-detail-label">Type</span><span className="eh-detail-val" style={{textTransform:'capitalize'}}>{value.fund?.type}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Code</span><span className="eh-detail-val" style={{fontFamily:'monospace',fontWeight:700}}>{value.fund?.code||'—'}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Rate</span><span className="eh-detail-val">₹{value.fund?.rate}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Fulfilled</span><span className="eh-detail-val">₹{Number(value.fulfilledFiat).toLocaleString('en-IN')}</span></div>
              <div className="eh-detail-row"><span className="eh-detail-label">Progress</span><span className="eh-detail-val">{pct}%</span></div>
            </div>
            <div className="eh-detail-box">
              <div className="eh-detail-title">{value.bankCard?.mode==='upi'?'UPI':'Bank'}</div>
              {value.bankCard?.mode==='bank'?(<>
                <div className="eh-detail-row"><span className="eh-detail-label">Name</span><span className="eh-detail-val">{value.bankCard.accountName}</span></div>
                <div className="eh-detail-row"><span className="eh-detail-label">Acc No.</span><span className="eh-detail-val">{value.bankCard.accountNumber}</span></div>
                <div className="eh-detail-row"><span className="eh-detail-label">IFSC</span><span className="eh-detail-val">{value.bankCard.ifsc}</span></div>
              </>):(<>
                <div className="eh-detail-row"><span className="eh-detail-label">Name</span><span className="eh-detail-val">{value.bankCard?.accountName}</span></div>
                <div className="eh-detail-row"><span className="eh-detail-label">UPI ID</span><span className="eh-detail-val">{value.bankCard?.upi}</span></div>
              </>)}
            </div>
          </div>
          <div className="eh-actions">
            <button className="eh-btn eh-btn-receipt" onClick={()=>onViewSlip(value)}>
              <FileText size={13}/> View Receipt
            </button>
          </div>
          {value.receipts?.length>0&&(<>
            <div className="eh-receipts-label">
              <span>Receipts</span>
              <span>₹{value.fulfilledFiat} / ₹{value.fiat}</span>
            </div>
            <div className="eh-receipts-strip">
              {value.receipts.map((r,i)=>(
                <div key={i} className="eh-receipt-thumb">
                  <Image width={44} height={44} src={r}
                    style={{borderRadius:6,objectFit:'cover',display:'block'}}
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

const PAGE_LIMIT = 10;

const App = ({ open, setOpenDrawer, getContainer }) => {
  const [loading,        setLoading]        = useState(false);
  const [loadingMore,    setLoadingMore]    = useState(false);
  const [orders,         setOrders]         = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [slipOrder,      setSlipOrder]      = useState(null);
  const [page,           setPage]           = useState(1);
  const [hasMore,        setHasMore]        = useState(false);

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  /* ── Fetch a page of orders ── */
  const fetchOrders = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await usersGet(`/order?page=${pageNum}&limit=${PAGE_LIMIT}`);
      if (res.success) {
        const newOrders = res.orders;

        setOrders(prev => {
          const merged = append ? [...prev, ...newOrders] : newOrders;

          // Rebuild timers for all orders
          const timers = {};
          merged.forEach(o => {
            const mx = o?.fund?.maxFulfillmentTime;
            timers[o._id] = Math.max(
              new Date(o.createdAt).getTime() + (mx ?? 3) * 3600000 - Date.now(),
              0
            );
          });
          setRemainingTimes(timers);

          return merged;
        });

        setHasMore(res.hasMore);
        setPage(pageNum);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  /* ── IntersectionObserver: trigger next page on scroll ── */
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchOrders(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchOrders]);

  /* ── Countdown timer ── */
  useEffect(() => {
    const t = setInterval(() => {
      setRemainingTimes(prev => {
        const u = {};
        for (const id in prev) u[id] = Math.max(prev[id] - 1000, 0);
        return u;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Reset and fetch on open ── */
  useEffect(() => {
    if (open) {
      setOrders([]);
      setPage(1);
      setHasMore(false);
      fetchOrders(1, false);
    }
  }, [open]);

  return (
    <>
      <style>{STYLES}</style>
      <Drawer
        closable
        destroyOnClose
        placement="right"
        width="100%"
        loading={loading && orders.length === 0}
        getContainer={getContainer || (() => document.body)}
        open={open}
        onClose={setOpenDrawer}
        closeIcon={<ArrowLeft size={20} />}
        title={<Text strong style={{ fontSize: 15 }}>Exchange History</Text>}
      >
        {orders.length > 0 ? (
          <div>
            <div className="eh-list">
              {orders.map(v => (
                <OrderCard
                  key={v._id}
                  value={v}
                  timeLeft={remainingTimes[v._id]}
                  onViewSlip={setSlipOrder}
                />
              ))}
            </div>

            {/* Loading more spinner */}
            {loadingMore && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '14px 0', fontSize: 12, color: '#94a3b8',
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid #e2e8f0', borderTopColor: '#0f172a',
                  animation: 'spin .7s linear infinite',
                }} />
                Loading more…
              </div>
            )}

            {/* End of list */}
            {!hasMore && !loadingMore && orders.length >= PAGE_LIMIT && (
              <div style={{
                textAlign: 'center', fontSize: 11, color: '#cbd5e1', padding: '10px 0 4px',
              }}>
                All orders loaded
              </div>
            )}

            {/* Invisible sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </div>
        ) : !loading ? (
          <EmptyBox />
        ) : null}
      </Drawer>

      {slipOrder && (
        <TransactionSlip order={slipOrder} onClose={() => setSlipOrder(null)} />
      )}
    </>
  );
};

export default App;