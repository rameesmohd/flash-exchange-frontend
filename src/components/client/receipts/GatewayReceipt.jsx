// receipts/GatewayReceipt.jsx
// Used when order.fund.fundType === 'gateway'
import React from 'react';

const STATUS_MAP = {
  success: { bg: '#14532d', color: '#86efac', label: '✓  Completed' },
  pending: { bg: '#78350f', color: '#fde68a', label: '◎  Pending'   },
  failed:  { bg: '#7f1d1d', color: '#fca5a5', label: '✕  Failed'    },
};

const BARS = [3,5,2,7,4,6,2,8,3,5,7,2,4,6,3,5,2,7,4,6,2,5,3,4,7,2,6,3,5,4];

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize:9, fontWeight:700, letterSpacing:'2px', color:'#94a3b8',
    textTransform:'uppercase', padding:'12px 0 6px',
    borderBottom:'1px solid #edf2f7', marginBottom:2,
  }}>{children}</div>
);

const PlainRow = ({ label, value, mono, last }) => (
  <div style={{
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'8px 0', borderBottom: last ? 'none' : '1px solid #f1f5f9',
  }}>
    <span style={{ fontSize:12, color:'#94a3b8' }}>{label}</span>
    <span style={{ fontSize:12, color:'#111827', fontWeight:600, textAlign:'right', maxWidth:'60%',
      wordBreak:'break-word', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
  </div>
);

const TagRow = ({ label, value }) => (
  <div style={{
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'8px 0', borderBottom:'1px solid #f1f5f9',
  }}>
    <span style={{ fontSize:12, color:'#94a3b8' }}>{label}</span>
    <span style={{
      background:'#dbeafe', borderRadius:5, padding:'3px 9px',
      fontFamily:'monospace', fontSize:11, color:'#1e40af', fontWeight:700,
    }}>{value}</span>
  </div>
);

const GatewayReceipt = ({ order }) => {
  const st     = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const isBank = order.bankCard?.mode === 'bank';
  const code   = order.fund?.code || 'GW';
  const dateStr = order.updatedAt
    ? new Date(order.updatedAt).toLocaleString('en-IN', {
        day:'2-digit', month:'short', year:'numeric',
        hour:'2-digit', minute:'2-digit', hour12:true,
      })
    : '—';

  return (
    <div style={{ background:'#fff', borderRadius:16, overflow:'hidden',
      border:'1px solid #e2e8f0', width:'100%', boxSizing:'border-box' }}>

      {/* Header */}
      <div style={{ background:'#0c1628', padding:'18px 20px 18px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:130, height:130,
          borderRadius:'50%', background:'rgba(26,58,110,0.45)' }} />
        <div style={{ position:'absolute', bottom:-20, left:-10, width:80, height:80,
          borderRadius:'50%', background:'rgba(18,42,82,0.4)' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
          background:'rgba(34,85,164,0.55)' }} />

        {/* Fund code badge */}
        <div style={{
          position:'absolute', top:14, right:20,
          background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)',
          borderRadius:6, padding:'2px 8px',
          fontFamily:'monospace', fontSize:10, fontWeight:700, color:'#93c5fd', letterSpacing:1,
        }}>{code}</div>

        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, position:'relative' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'2px', color:'#5a85c0',
            textTransform:'uppercase', whiteSpace:'nowrap' }}>Transaction Receipt</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }} />
        </div>
        <div style={{ fontSize:32, fontWeight:700, color:'#fff', letterSpacing:'-0.5px',
          lineHeight:1, marginBottom:14, position:'relative' }}>
          ₹{Number(order.fiat).toLocaleString('en-IN')}
        </div>
        <div style={{
          display:'inline-block', padding:'5px 14px', borderRadius:20,
          fontSize:12, fontWeight:700, background:st.bg, color:st.color, position:'relative',
        }}>{st.label}</div>
      </div>

      {/* Wave */}
      <div style={{ background:'#0c1628', lineHeight:0 }}>
        <svg viewBox="0 0 360 22" style={{ display:'block', width:'100%' }}>
          <path d="M0,0 C65,22 130,22 180,11 C230,0 295,0 360,22 L360,22 L0,22 Z" fill="#ffffff"/>
        </svg>
      </div>

      {/* Body */}
      <div style={{ padding:'8px 20px 16px', background:'#fff' }}>
        <SectionLabel>Transaction Details</SectionLabel>
        <TagRow   label="Order ID"     value={`#${order.orderId}`} />
        <TagRow   label="Ref Code"     value={code} />
        <PlainRow label="UTR"          value={order.UTR || 'Pending'} mono />
        <PlainRow label="Date & Time"  value={dateStr} />
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

        <div style={{ borderTop:'1.5px dashed #e2e8f0', margin:'16px 0 12px' }} />
        <div style={{ display:'flex', gap:2, justifyContent:'center', marginBottom:8 }}>
          {BARS.map((w, i) => (
            <div key={i} style={{ width:w, height:22, borderRadius:1,
              background:`rgba(156,163,175,${0.38+(i%3)*0.18})` }} />
          ))}
        </div>
        <div style={{ textAlign:'center', fontSize:9, color:'#cbd5e1', fontFamily:'monospace', letterSpacing:'1.5px' }}>
          {code}–{order.orderId}–{order._id?.slice(-6).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default GatewayReceipt;