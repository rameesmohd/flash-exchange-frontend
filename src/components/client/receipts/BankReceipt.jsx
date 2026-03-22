// receipts/BankReceipt.jsx
import React from 'react';

const STATUS_MAP = {
  success: { color: '#15803d', label: 'SUCCESS',  dot: '#16a34a' },
  pending: { color: '#b45309', label: 'PENDING',  dot: '#d97706' },
  failed:  { color: '#b91c1c', label: 'FAILED',   dot: '#dc2626' },
};

const SlipRow = ({ label, value, mono, bold, last, highlight }) => (
  <div style={{
    display:'grid', gridTemplateColumns:'38% 62%',
    borderBottom: last ? 'none' : '1px solid #e5e7eb',
    minHeight:30,
  }}>
    <div style={{
      padding:'7px 8px 7px 0', fontSize:11, color:'#6b7280',
      fontWeight:500, borderRight:'1px solid #e5e7eb', background:'#fafafa',
      paddingLeft:8, display:'flex', alignItems:'center',
    }}>{label}</div>
    <div style={{
      padding:'7px 8px', fontSize:11,
      color: highlight ? STATUS_MAP[highlight]?.color : (bold ? '#0f172a' : '#374151'),
      fontWeight: bold ? 700 : 500,
      fontFamily: mono ? '"SF Mono","Fira Mono","Courier New",monospace' : 'inherit',
      display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', wordBreak:'break-all',
      background: highlight ? `${STATUS_MAP[highlight]?.dot}10` : 'transparent',
    }}>
      {highlight && (
        <span style={{
          width:6, height:6, borderRadius:'50%', flexShrink:0,
          background:STATUS_MAP[highlight]?.dot,
          boxShadow:`0 0 4px ${STATUS_MAP[highlight]?.dot}`,
        }} />
      )}
      {value ?? '—'}
    </div>
  </div>
);

const SectionHeader = ({ children }) => (
  <div style={{
    background:'#1e3a5f', color:'#e2e8f0',
    fontSize:9, fontWeight:700, letterSpacing:'1.5px',
    textTransform:'uppercase', padding:'5px 8px',
  }}>{children}</div>
);

const BankReceipt = ({ order }) => {
  const st     = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const isBank = order.bankCard?.mode === 'bank';
  const code   = order.fund?.code || 'BT';
  const now    = order.createdAt ? new Date(order.createdAt) : new Date();
  const refNo  = `${code}${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${order._id?.slice(-8).toUpperCase()}`;

  const dateStr  = now.toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' });
  const timeStr  = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });

  return (
    <div style={{
      background:'#fff', borderRadius:8,
      border:'1px solid #cbd5e1', width:'100%', boxSizing:'border-box',
      overflow:'hidden', fontFamily:'"Arial","Helvetica Neue",sans-serif',
      boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
    }}>
      {/* Bank header bar */}
      <div style={{
        background:'#1e3a5f', padding:'12px 16px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:'#fff', letterSpacing:'0.3px' }}>
            FUND TRANSFER 
          </div>
          <div style={{ fontSize:9, color:'#93c5fd', letterSpacing:'1px', marginTop:2 }}>
            NEFT / IMPS
          </div>
        </div>
        {/* Fund code */}
        <div style={{
          background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)',
          borderRadius:4, padding:'3px 10px',
          fontFamily:'monospace', fontSize:11, fontWeight:700, color:'#bfdbfe', letterSpacing:1,
        }}>{code}</div>
      </div>

      {/* Status strip */}
      <div style={{
        background: order.status === 'success' ? '#f0fdf4' : order.status === 'failed' ? '#fef2f2' : '#fffbeb',
        borderBottom:'1px solid #e5e7eb', padding:'6px 16px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:st.color }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:st.dot,
            boxShadow:`0 0 5px ${st.dot}` }} />
          TRANSACTION {st.label}
        </div>
        <div style={{ fontFamily:'monospace', fontSize:9, color:'#94a3b8' }}>
          {dateStr}  {timeStr}
        </div>
      </div>

      {/* Amount highlight */}
      <div style={{
        background:'#f8fafc', borderBottom:'2px solid #1e3a5f',
        padding:'10px 16px', display:'flex', alignItems:'baseline', gap:8,
      }}>
        <span style={{ fontSize:11, color:'#6b7280', fontWeight:500 }}>Amount Transferred</span>
        <span style={{ fontSize:26, fontWeight:800, color:'#0f172a', letterSpacing:'-0.5px', lineHeight:1 }}>
          ₹{Number(order.fiat).toLocaleString('en-IN')}
        </span>
        <span style={{ fontSize:10, color:'#94a3b8' }}>INR</span>
      </div>

      {/* Transaction details table */}
      <div style={{ border:'1px solid #e5e7eb', borderTop:'none' }}>
        <SectionHeader>Transaction Details</SectionHeader>
        {/* <SlipRow label="Fund Code"         value={code} mono /> */}
        <SlipRow label="Order ID"          value={`#${order.orderId}${code? `(${code})` : ""}`} mono />
        <SlipRow label="UTR Number"        value={order.UTR || 'Awaiting confirmation'} mono />
        <SlipRow label="Date"              value={dateStr} />
        <SlipRow label="Time"              value={timeStr} mono />
        <SlipRow label="Status"            value={st.label} highlight={order.status} bold last />
        <SlipRow label="Debit Amount"  value={`₹${Number(order.fiat).toLocaleString('en-IN')}`} bold />
      </div>

      {/* Beneficiary details */}
      <div style={{ border:'1px solid #e5e7eb', borderTop:'none', marginTop:0 }}>
        <SectionHeader>Beneficiary Details</SectionHeader>
        {isBank ? (<>
          <SlipRow label="Account Name"   value={order.bankCard.accountName} bold />
          <SlipRow label="Account Number" value={order.bankCard.accountNumber} mono />
          <SlipRow label="IFSC Code"      value={order.bankCard.ifsc} mono />
          <SlipRow label="Bank Mode"      value="NEFT / IMPS" last />
        </>) : (<>
          <SlipRow label="Name"           value={order.bankCard?.accountName} bold />
          <SlipRow label="UPI ID"         value={order.bankCard?.upi} mono last />
        </>)}
      </div>

      {/* Footer */}
      <div style={{
        background:'#f8fafc', padding:'8px 16px',
        borderTop:'1px solid #e5e7eb',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <div style={{ fontFamily:'monospace', fontSize:8, color:'#94a3b8', letterSpacing:'1px' }}>
          {refNo}
        </div>
        <div style={{ fontSize:8, color:'#94a3b8' }}>
          This is a system generated advice
        </div>
      </div>
    </div>
  );
};

export default BankReceipt;