import React, { useEffect, useState } from 'react';
import { Button, Typography, Input, Select } from 'antd';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
const { Text } = Typography;
import imgUsdt    from '../../public/tether-usdt-logo.png';
import rupeesIcon from '../../public/gold-coin-rupee-icon.svg';
import binanceIcon from '../../public/binance-icon-512x512-yslglaeq.png';
import { useDispatch, useSelector } from 'react-redux';
import { usersGet, usersPost } from '../services/userApi';
import ExchangeHistory  from '../components/client/drawers/ExchangeHistory';
import BankCard         from '../components/client/drawers/BankCard';
import { setFund, setUserData, setBankCardSelected } from '../redux/ClientSlice';
import { formatDate } from '../services/formatData';
import { closePinModal, openPinModal } from '../redux/PinModalSlice';
import TransactionPinModal from '../components/client/TransactionPinModal';
import { NotebookIcon } from 'lucide-react';

const S = {
  page:         { background:'#f0f2f7', minHeight:'100%', paddingBottom:32 },
  content:      { padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:10 },
  swapCard:     { background:'#fff', borderRadius:18, border:'0.5px solid #e5e8ef', overflow:'hidden' },
  swapCardInner:{ padding:'14px 16px' },
  swapRow:      { display:'flex', justifyContent:'space-between', alignItems:'center' },
  swapLabel:    { fontSize:11, color:'#94a3b8', fontWeight:500, letterSpacing:'0.3px' },
  swapAvail:    { fontSize:11, color:'#64748b', fontWeight:500 },
  swapAssetRow: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 },
  swapAsset:    { display:'flex', alignItems:'center', gap:8 },
  assetLabel:   { fontSize:15, fontWeight:600, color:'#0f172a' },
  arrowWrap:    { display:'flex', justifyContent:'center', alignItems:'center', position:'relative', height:0, zIndex:10 },
  arrowCircle:  { width:36, height:36, borderRadius:'50%', background:'#fff', border:'0.5px solid #e5e8ef', display:'flex', alignItems:'center', justifyContent:'center', position:'absolute', top:-18, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  notice:       { background:'#fffbeb', border:'0.5px solid #fde68a', borderRadius:12, padding:'10px 14px' },
  noticeTitle:  { fontSize:11, fontWeight:700, color:'#92400e', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:3 },
  noticeText:   { fontSize:12, color:'#78350f', lineHeight:1.5 },
  bankInfo:     { background:'#eff6ff', border:'0.5px solid #bfdbfe', borderRadius:12, padding:'10px 14px' },
  bankInfoTitle:{ fontSize:11, fontWeight:700, color:'#1e40af', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 },
  bankInfoRow:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 },
  bankInfoLabel:{ fontSize:12, color:'#3b82f6' },
  bankInfoValue:{ fontSize:12, fontWeight:600, color:'#1e40af', fontFamily:'monospace' },
  btnPrimary:   { width:'100%', height:50, borderRadius:14, background:'#0d1f3c', border:'none', color:'#fff', fontSize:14, fontWeight:700, letterSpacing:'0.5px', cursor:'pointer' },
  btnSecondary: { width:'100%', height:46, borderRadius:14, background:'#f1f5f9', border:'0.5px solid #e2e8f0', color:'#374151', fontSize:13, fontWeight:600, cursor:'pointer' },
  rateCard:     { background:'#fff', border:'0.5px solid #e5e8ef', borderRadius:14, padding:'12px 16px' },
  rateCardHeader:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  rateExchange: { display:'flex', alignItems:'center', gap:7, fontSize:13, fontWeight:600, color:'#1a1f2e' },
  rateUpdated:  { fontSize:10, color:'#94a3b8' },
  rateRow:      { display:'flex', justifyContent:'space-between', alignItems:'baseline' },
  rateMain:     { fontSize:11, color:'#64748b' },
  rateValue:    { fontSize:24, fontWeight:700, color:'#0d1f3c', fontFamily:'ui-monospace,monospace' },
};

const Exchange = () => {
  const user = useSelector(s => s.User.userData);
  const { isOpen } = useSelector(s => s.PinModal);
  const { selectedBankCard, selectedFund } = useSelector(s => s.User);
  const dispatch = useDispatch();

  const [allFunds,          setAllFunds]          = useState([]);
  const [error,             setError]             = useState('');
  const [loading,           setLoading]           = useState({ rate:true, submit:false });
  const [inputs,            setInputs]            = useState({ usdt:'', fiat:'' });
  const [exchangeHistory,   setShowExchangeHistory] = useState(false);
  const [otherExchangeRate, setOtherExchangeRate] = useState([]);
  const [openBankCard,      setOpenBankCard]      = useState({ open:false, confirm:false, mode:null });

  useEffect(() => { dispatch(setBankCardSelected({})); }, []);
  useEffect(() => {
    if (!selectedFund) dispatch(setFund(allFunds[0]));
    setInputs({ usdt:'', fiat:'' });
    setOpenBankCard(p => ({ ...p, mode:selectedFund?.paymentMode }));
  }, [allFunds, selectedFund]);

  const fetchRate = async () => {
    try {
      setLoading(p => ({ ...p, rate:true }));
      const res = await usersGet('/fund');
      if (res.success && res.funds) {
        setAllFunds(res.funds.map(
          f => ({ value:f._id, label:`${f.type}: ₹${f.rate}/USDT`, rate:f.rate, _id:f._id, status:f.status, message:f.message||'', paymentMode:f.paymentMode, code:f.code, fundType:f.fundType })
        ));
        setOtherExchangeRate(res.otherExchangeRates);
      }
    } catch(e) { console.log(e); }
    finally { setLoading(p => ({ ...p, rate:false })); }
  };

  const handleSubmitOrder = async (pin) => {
    if (Number(inputs.usdt)<100 || Number(inputs.fiat)<9000)
      return setError('Minimum amount is 100 USDT or equivalent in fiat.');
    try {
      setLoading(p => ({ ...p, submit:true }));
      const res = await usersPost('/order', { usdt:inputs.usdt, fiat:inputs.fiat, fund:selectedFund, bankCard:selectedBankCard, pin });
      if (res.success) { dispatch(setUserData(res.user)); setShowExchangeHistory(true); }
    } catch(e) {
      if (e.response?.data?.message) setError(e.response.data.message);
    } finally { setLoading(p => ({ ...p, submit:false })); }
  };

  useEffect(() => { fetchRate(); }, []);
  useEffect(() => { setError(''); setOpenBankCard(p => ({ ...p, confirm:false })); }, [inputs]);

  const hasBankCard = Object.keys(selectedBankCard).length > 0;

  return (
    <div style={S.page}>
      {/* header */}
      <header style={{ background:'#fff', borderBottom:'0.5px solid #e5e7eb', padding:'12px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:20 }}>
        <img src="/photo_2026-03-20_13-41-06.jpg" alt="Logo" style={{ height:24 }} />
        <button onClick={() => setShowExchangeHistory(true)} style={{ width:34, height:34, borderRadius:10, background:'#f4f5f8', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#1a1f2e' }}>
          <NotebookIcon size={17} />
        </button>
      </header>

      <div style={S.content}>
        {/* USDT */}
        <div style={S.swapCard}>
          <div style={S.swapCardInner}>
            <div style={S.swapRow}>
              <span style={S.swapLabel}>You sell</span>
              <span style={S.swapAvail}>Balance: {user?.availableBalance || 0} USDT</span>
            </div>
            <div style={S.swapAssetRow}>
              <div style={S.swapAsset}>
                <img src={imgUsdt} alt="USDT" style={{ width:30, height:30 }} />
                <span style={S.assetLabel}>USDT</span>
              </div>
              <Input bordered={false} size="large" value={inputs.usdt} placeholder="0.00"
                style={{ width:120, textAlign:'right', fontWeight:700, fontSize:22, color:'#0f172a', padding:0 }}
                onChange={e => { const v=e.target.value; if(v===''||isNaN(v)) return setInputs({usdt:'',fiat:''}); setInputs({usdt:v,fiat:(parseFloat(v)*selectedFund.rate).toFixed(2)}); }}
                onBlur={() => { if(inputs.usdt>0) setInputs(p=>({...p,usdt:Number(p.usdt).toFixed(2)})); }}
              />
            </div>
          </div>
        </div>

        {/* arrow */}
        <div style={S.arrowWrap}>
          <div style={S.arrowCircle}><CgArrowsExchangeAlt size={18} color="#64748b"/></div>
        </div>

        {/* INR */}
        <div style={S.swapCard}>
          <div style={S.swapCardInner}>
            <div style={S.swapRow}>
              <span style={S.swapLabel}>You receive</span>
              <Select className='w-56' loading={loading.rate} options={allFunds} value={selectedFund?.label||''} variant="filled" size="middle"
                style={{ fontSize:11, color:'#64748b' }}
                onChange={v => { const f=allFunds.find(x=>x.value===v); dispatch(setFund({value:f.value,rate:f.rate,_id:f._id,status:f.status,label:f.label,message:f?.message,paymentMode:f?.paymentMode})); }}
              />
            </div>
            <div style={S.swapAssetRow}>
              <div style={S.swapAsset}>
                <img src={rupeesIcon} alt="INR" style={{ width:30, height:30 }} />
                <span style={S.assetLabel}>INR</span>
              </div>
              <Input bordered={false} size="large" value={inputs.fiat} placeholder="0.00"
                style={{ width:150, textAlign:'right', fontWeight:700, fontSize:22, color:'#0f172a', padding:0 }}
                onChange={e => { const v=e.target.value; if(v===''||isNaN(v)) return setInputs({fiat:'',usdt:''}); setInputs({fiat:v,usdt:(parseFloat(v)/selectedFund.rate).toFixed(2)}); }}
                onBlur={() => setInputs(p=>({...p,fiat:Number(p.fiat).toFixed(2)}))}
              />
            </div>
          </div>
        </div>

        {/* notice */}
        {selectedFund && (
          <div style={S.notice}>
            <div style={S.noticeTitle}>Accepted: <span style={{textTransform:'uppercase'}}>{selectedFund.paymentMode}</span></div>
            {selectedFund.message && <div style={S.noticeText}>{selectedFund.message}</div>}
          </div>
        )}

        {/* bank card info */}
        {openBankCard.confirm && hasBankCard && (
          <div style={S.bankInfo}>
            <div style={S.bankInfoTitle}>Payment Card</div>
            {selectedBankCard.mode==='upi' ? (<>
              <div style={S.bankInfoRow}><span style={S.bankInfoLabel}>UPI ID</span><span style={S.bankInfoValue}>{selectedBankCard.upi}</span></div>
              <div style={S.bankInfoRow}><span style={S.bankInfoLabel}>Name</span><span style={{...S.bankInfoValue,fontFamily:'inherit'}}>{selectedBankCard.accountName}</span></div>
            </>) : (<>
              <div style={S.bankInfoRow}><span style={S.bankInfoLabel}>Account</span><span style={S.bankInfoValue}>{selectedBankCard.accountNumber}</span></div>
              <div style={S.bankInfoRow}><span style={S.bankInfoLabel}>IFSC</span><span style={S.bankInfoValue}>{selectedBankCard.ifsc}</span></div>
              <div style={S.bankInfoRow}><span style={S.bankInfoLabel}>Name</span><span style={{...S.bankInfoValue,fontFamily:'inherit'}}>{selectedBankCard.accountName}</span></div>
            </>)}
          </div>
        )}

        {error && <div style={{ fontSize:12, color:'#dc2626', padding:'0 2px' }}>{error}</div>}

        {/* actions */}
        {!openBankCard.confirm ? (
          <Button loading={loading.rate} onClick={() => setOpenBankCard(p=>({...p,open:true}))} style={S.btnPrimary}>Sell USDT</Button>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Button loading={loading.submit} disabled={!hasBankCard} onClick={() => dispatch(openPinModal())} style={S.btnPrimary}>Confirm Order</Button>
            <Button onClick={() => setOpenBankCard(p=>({...p,open:true}))} style={S.btnSecondary}>{hasBankCard?'Change':'Select'} Bank Card</Button>
          </div>
        )}

        {/* market rate */}
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:'#94a3b8', letterSpacing:'1px', textTransform:'uppercase', margin:'6px 2px 10px' }}>Market Rate</div>
          {otherExchangeRate[0] && (
            <div style={S.rateCard}>
              <div style={S.rateCardHeader}>
                <div style={S.rateExchange}><img src={binanceIcon} alt="Binance" style={{ width:20, height:20 }} />Binance</div>
                <span style={S.rateUpdated}>{otherExchangeRate[0].lastUpdated ? formatDate(otherExchangeRate[0].lastUpdated) : ''}</span>
              </div>
              <div style={S.rateRow}>
                <div>
                  <div style={S.rateMain}>Average price</div>
                  <div><span style={S.rateValue}>{otherExchangeRate[0].binance}</span><span style={{ fontSize:11, color:'#94a3b8', marginLeft:4 }}>₹</span></div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={S.rateMain}>1 USDT</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#374151' }}>₹{otherExchangeRate[0].binance}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Drawers — all portal to document.body ── */}
      <ExchangeHistory
        open={exchangeHistory}
        setOpenDrawer={() => setShowExchangeHistory(false)}
        getContainer={() => document.body}
      />
      <BankCard
        open={openBankCard.open}
        setOpenDrawer={() => setOpenBankCard(p=>({...p,open:false,confirm:true}))}
        filterMode={openBankCard.mode}
        getContainer={() => document.body}
      />
      <TransactionPinModal
        key={isOpen?'open':'closed'}
        open={isOpen}
        onClose={() => dispatch(closePinModal())}
        onSubmit={pin => { handleSubmitOrder(pin); dispatch(closePinModal()); }}
      />
    </div>
  );
};

export default Exchange;