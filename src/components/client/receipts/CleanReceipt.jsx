// receipts/CleanReceipt.jsx
import React from 'react';

const STATUS_MAP = {
  success: { color: '#16a34a', bg: '#f0fdf4', icon: '✓', label: 'Payment Successful' },
  pending: { color: '#d97706', bg: '#fffbeb', icon: '◌', label: 'Processing'         },
  failed:  { color: '#dc2626', bg: '#fef2f2', icon: '✕', label: 'Payment Failed'     },
};

const Row = ({ label, value, mono, bold, last }) => (
  <div style={{
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'9px 0', borderBottom: last ? 'none' : '1px solid #f0f4f8',
  }}>
    <span style={{ fontSize:12, color:'#6b7280', fontWeight:400 }}>{label}</span>
    <span style={{
      fontSize:12, color: bold ? '#111827' : '#374151',
      fontWeight: bold ? 700 : 500, textAlign:'right', maxWidth:'58%', wordBreak:'break-word',
      fontFamily: mono ? '"SF Mono","Fira Mono","Courier New",monospace' : 'inherit',
    }}>{value ?? '—'}</span>
  </div>
);

const Divider = () => (
  <div style={{ borderTop:'1px dashed #e5e7eb', margin:'12px 0' }} />
);

const CleanReceipt = ({ order }) => {
  const st     = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const isBank = order.bankCard?.mode === 'bank';
  const code   = order.fund?.code || 'CF';
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        day:'2-digit', month:'short', year:'numeric',
        hour:'2-digit', minute:'2-digit', hour12:true,
      })
    : '—';

  return (
    <div style={{
      background:'#fff', borderRadius:16,
      border:'1px solid #e5e7eb', width:'100%', boxSizing:'border-box',
      overflow:'hidden', fontFamily:'"Inter","Helvetica Neue",Arial,sans-serif',
    }}>
      {/* Status banner */}
      <div style={{
        background: st.bg, padding:'20px 20px 16px',
        display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
        borderBottom:`1.5px solid ${st.color}22`,
      }}>
        {/* Fund code chip */}
        <div style={{
          alignSelf:'flex-end', marginBottom:8,
          background:'#f1f5f9', borderRadius:6, padding:'2px 8px',
          fontFamily:'monospace', fontSize:10, fontWeight:700,
          color:'#64748b', letterSpacing:1,
        }}>{code}</div>

        {/* Status icon */}
        <div style={{
          width:52, height:52, borderRadius:'50%',
          background:st.color, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:22, fontWeight:700, marginBottom:10,
          boxShadow:`0 4px 14px ${st.color}40`,
        }}>{st.icon}</div>

        <div style={{ fontSize:13, fontWeight:700, color:st.color, marginBottom:4 }}>{st.label}</div>
        <div style={{ fontSize:28, fontWeight:800, color:'#0f172a', lineHeight:1, letterSpacing:'-0.5px' }}>
          ₹{Number(order.fiat).toLocaleString('en-IN')}
        </div>
        <div style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>{dateStr}</div>
      </div>

      {/* Body */}
      <div style={{ padding:'4px 20px 20px' }}>
        {/* Transaction */}
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:'#94a3b8',
          textTransform:'uppercase', padding:'14px 0 6px' }}>Transaction</div>
        <Row label="Order ID"     value={`#${order.orderId}${code ? `-${code}` : "" }`} mono bold />
        <Row label="UTR Number"   value={order.UTR || 'Pending'} mono />
        <Row label="Amount"       value={`₹${Number(order.fiat).toLocaleString('en-IN')}`} bold last />

        <Divider />

        {/* Payment destination */}
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:'#94a3b8',
          textTransform:'uppercase', paddingBottom:6 }}>
          {isBank ? 'Bank Account' : 'UPI'}
        </div>
        {isBank ? (<>
          <Row label="Name"       value={order.bankCard.accountName} bold />
          <Row label="Account"    value={order.bankCard.accountNumber} mono />
          <Row label="IFSC"       value={order.bankCard.ifsc} mono last />
        </>) : (<>
          <Row label="Name"   value={order.bankCard?.accountName} bold />
          <Row label="UPI ID" value={order.bankCard?.upi} mono last />
        </>)}

        {/* Footer ref */}
        <div style={{
          marginTop:16, background:'#f8fafc', borderRadius:8, padding:'8px 12px',
          textAlign:'center', fontFamily:'monospace', fontSize:9,
          color:'#94a3b8', letterSpacing:'1.2px',
        }}>
          {code} · {order.orderId} · {order._id?.slice(-6).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default CleanReceipt;