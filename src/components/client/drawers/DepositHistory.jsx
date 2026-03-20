import React, { useState, useEffect } from 'react';
import { Drawer, Tag, Typography } from 'antd';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import EmptyBox from '../common/EmptyBox';
import { formatDate } from '../../../services/formatData';
import CryptoDeposit from '../CryptoDeposit';

const { Text } = Typography;

const statusStyle = {
  pending:   { bg:'#fff7ed', color:'#d97706', label:'Pending'   },
  completed: { bg:'#ecfdf5', color:'#16a34a', label:'Completed' },
  failed:    { bg:'#fef2f2', color:'#dc2626', label:'Failed'    },
};

const DepositHistoryList = ({ depositHistory }) => {
  const [openDeposit, setOpenDeposit] = useState({ show: false, data: {} });

  if (openDeposit.show) {
    return (
      <CryptoDeposit
        deposit={openDeposit.data}
        onCancel={() => setOpenDeposit({ show: false, data: {} })}
      />
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {depositHistory.map((value, index) => {
        const st = statusStyle[value.status] || { bg:'#f1f5f9', color:'#64748b', label: value.status };
        return (
          <div
            key={index}
            style={{
              background:'#fff', borderRadius:14,
              border:'0.5px solid #e5e8ef', overflow:'hidden',
            }}
          >
            {/* main row */}
            <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
              {/* icon */}
              <div style={{
                width:40, height:40, borderRadius:12, flexShrink:0,
                background:'#eff6ff', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:11, fontWeight:700, color:'#2563eb',
              }}>
                TRC
              </div>

              {/* center */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <Text copyable={{ text: value.transactionId }} style={{ fontSize:12, fontWeight:600, color:'#0f172a', maxWidth:140 }}>
                    #{value.transactionId}
                  </Text>
                  <span style={{
                    fontSize:10, fontWeight:600, padding:'2px 8px',
                    borderRadius:20, background:st.bg, color:st.color, flexShrink:0,
                  }}>
                    {st.label}
                  </span>
                </div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>
                  {value.paymentMode} · {formatDate(value.createdAt)}
                </div>
              </div>

              {/* amount */}
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:16, fontWeight:700, color:'#0d1f3c', fontFamily:'ui-monospace,monospace' }}>
                  ${value.amount}
                </div>
                <div style={{ fontSize:10, color:'#94a3b8' }}>USDT</div>
              </div>
            </div>

            {/* open pending deposit */}
            {value.status === 'pending' && (
              <div
                onClick={() => setOpenDeposit({ show: true, data: value })}
                style={{
                  borderTop:'0.5px solid #f1f5f9',
                  padding:'9px 16px',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                  cursor:'pointer', background:'#f8fafc',
                  fontSize:12, fontWeight:600, color:'#2563eb',
                }}
              >
                Continue Payment <ChevronRight size={14} />
              </div>
            )}
          </div>
        );
      })}
      <p style={{ textAlign:'center', fontSize:12, color:'#94a3b8', marginTop:4 }}>No more data</p>
    </div>
  );
};

const App = ({ open, setOpenDrawer, getContainer }) => {
  const [loading,        setLoading]        = useState(false);
  const [depositHistory, setDepositHistory] = useState([]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const response = await usersGet('/deposit');
      if (response.deposits) setDepositHistory(response.deposits);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchDeposits();
  }, [open]);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      width="100%"
      getContainer={getContainer || (() => document.body)}
      open={open}
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={<Text strong style={{ fontSize:15 }}>Deposit History</Text>}
    >
      {depositHistory.length
        ? <DepositHistoryList depositHistory={depositHistory} />
        : <EmptyBox />
      }
    </Drawer>
  );
};

export default App;