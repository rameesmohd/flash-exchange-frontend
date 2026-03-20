import React, { useEffect, useState } from 'react';
import { Drawer, Input, Typography } from 'antd';
import { ArrowLeft, History, Zap } from 'lucide-react';
import trxicon  from '../../../../public/trxicon.png';
import usdticon from '../../../../public/imageusdt.png';
import usdtImg  from '../../../../public/image.png';
import DepositHistory from '../drawers/DepositHistory';
import { usersPost } from '../../../services/userApi';
import CryptoDeposit from '../CryptoDeposit';

const { Text } = Typography;

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const App = ({ open, setOpenDrawer, getContainer }) => {
  const [loading,      setLoading]      = useState(false);
  const [historyOpen,  setHistoryOpen]  = useState(false);
  const [amount,       setAmount]       = useState('');
  const [showAddress,  setShowAddress]  = useState(false);
  const [depositData,  setDepositData]  = useState({});
  const [err,          setErr]          = useState('');

  /* reset on open */
  useEffect(() => {
    if (open) { setAmount(''); setErr(''); setShowAddress(false); setDepositData({}); }
  }, [open]);

  const createOrder = async () => {
    try {
      setLoading(true); setErr('');
      const res = await usersPost('/deposit', { amount });
      if (res.deposit) { setDepositData(res.deposit); setShowAddress(true); }
    } catch (e) {
      console.log(e);
      if (e?.response?.data?.message) setErr(e.response.data.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Drawer
        closable
        destroyOnClose
        placement="right"
        width="100%"
        getContainer={getContainer || (() => document.body)}
        open={open}
        onClose={() => setOpenDrawer(false)}
        closeIcon={<ArrowLeft size={20} />}
        title={
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>
            <Text strong style={{ fontSize:15 }}>USDT Deposit</Text>
            <button
              onClick={() => setHistoryOpen(true)}
              style={{ width:32, height:32, borderRadius:9, background:'#f4f6fb', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#374151' }}
            >
              <History size={17} />
            </button>
          </div>
        }
        styles={{ body: { padding: '0', background: '#f0f2f7' } }}
      >
        {!showAddress ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12, padding:'16px 16px 32px' }}>

            {/* banner */}
            {/* <div className=' flex justify-center w-full' style={{ borderRadius:18, overflow:'hidden', lineHeight:0 }}>
              <img className='sm:max-w-96' src={usdtImg} alt="USDT" style={{ objectFit:'cover', display:'block' }} />
            </div> */}

            {/* network card */}
            <div style={{ background:'#fff', borderRadius:16, border:'0.5px solid #e5e8ef', padding:'14px 16px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#94a3b8', letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>
                Network
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#f8fafc', borderRadius:11, border:'1px solid #e2e8f0' }}>
                <img src={trxicon} alt="TRX" style={{ width:22, height:22 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>Tron (TRC-20)</div>
                  <div style={{ fontSize:11, color:'#94a3b8' }}>Fast &amp; low fee</div>
                </div>
                <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, background:'#ecfdf5', borderRadius:6, padding:'3px 8px' }}>
                  <Zap size={10} color="#16a34a" />
                  <span style={{ fontSize:10, fontWeight:600, color:'#16a34a' }}>Active</span>
                </div>
              </div>
            </div>

            {/* amount card */}
            <div style={{ background:'#fff', borderRadius:16, border:'0.5px solid #e5e8ef', padding:'14px 16px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#94a3b8', letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>
                Amount
              </div>

              {/* quick amounts */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
                {QUICK_AMOUNTS.map(q => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    style={{
                      padding:'8px 0', borderRadius:9, border:'none', cursor:'pointer',
                      background: Number(amount)===q ? '#0d1f3c' : '#f4f6fb',
                      color:      Number(amount)===q ? '#fff'    : '#374151',
                      fontSize:12, fontWeight:600,
                      transition:'all .15s',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <Input
                size="large"
                value={amount}
                onChange={e => { setAmount(e.target.value); setErr(''); }}
                placeholder="Enter amount"
                prefix={<img src={usdticon} alt="USDT" style={{ width:18, height:18 }} />}
                suffix={<span style={{ fontSize:13, fontWeight:600, color:'#64748b' }}>USDT</span>}
                style={{ borderRadius:11 }}
              />

              {err && (
                <div style={{ fontSize:12, color:'#dc2626', marginTop:8 }}>{err}</div>
              )}
            </div>

            {/* min info */}
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 4px' }}>
              <div style={{ width:4, height:4, borderRadius:'50%', background:'#94a3b8' }} />
              <span style={{ fontSize:11, color:'#94a3b8' }}>Minimum deposit: 1 USDT</span>
            </div>

            {/* submit */}
            <button
              onClick={createOrder}
              disabled={!amount || Number(amount) < 1 || loading}
              style={{
                width:'100%', padding:'14px', borderRadius:14, border:'none',
                background: (!amount || Number(amount)<1) ? '#e2e8f0' : '#0d1f3c',
                color:      (!amount || Number(amount)<1) ? '#94a3b8' : '#fff',
                fontSize:14, fontWeight:700, cursor: (!amount || Number(amount)<1) ? 'not-allowed' : 'pointer',
                transition:'all .18s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}
            >
              {loading ? 'Creating order…' : 'Deposit'}
            </button>

          </div>
        ) : (
          <CryptoDeposit onCancel={() => setShowAddress(false)} deposit={depositData} />
        )}
      </Drawer>

      <DepositHistory
        open={historyOpen}
        setOpenDrawer={() => setHistoryOpen(false)}
        getContainer={() => document.body}
      />
    </>
  );
};

export default App;