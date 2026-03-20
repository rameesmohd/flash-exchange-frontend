import React, { useEffect, useState } from 'react';
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { RiLuggageDepositLine, RiBankCardLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HelpCircle, NotebookIcon } from 'lucide-react';
import DepositDrawer    from '../components/client/drawers/Deposit';
import WithdrawDrawer   from '../components/client/drawers/Withdraw';
import BankCard         from '../components/client/drawers/BankCard';
import ExchangeHistory  from '../components/client/drawers/ExchangeHistory';
import HelpCenter       from '../components/client/drawers/HelpCenter';
import { useDispatch, useSelector } from 'react-redux';
import { usersGet } from '../services/userApi';
import { setNotifications } from '../redux/ClientSlice';
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [depositDrawer,      setDepositDrawer]      = useState(false);
  const [withdrawDrawer,     setWithdrawDrawer]     = useState(false);
  const [bankCard,           setBankCard]           = useState(false);
  const [exchangeHistory,    setShowExchangeHistory] = useState(false);
  const [showHelpCenter,     setShowHelpCenter]     = useState(false);
  const { userData, notifications } = useSelector(v => v.User);
  const user     = userData;
  const dispatch = useDispatch();
  const [index,  setIndex] = useState(0);

  const getNotifications = async () => {
    try {
      const res = await usersGet('/notifications');
      if (res.success) dispatch(setNotifications(res.notifications));
    } catch(e) { console.log(e); }
  };

  useEffect(() => { getNotifications(); }, []);

  useEffect(() => {
    if (!notifications.length) return;
    const id = setInterval(() => setIndex(p => (p + 1) % notifications.length), 10000);
    return () => clearInterval(id);
  }, [notifications]);

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });

  const total     = user?.availableBalance != null && user?.processing != null
    ? (Number(user.availableBalance) + Number(user.processing)).toFixed(2) : '0.00';
  const available = user?.availableBalance != null ? user.availableBalance.toFixed(2) : '0.00';
  const processing = user?.processing       != null ? user.processing.toFixed(2)       : '0.00';

  const currentNotif = notifications[index];

  const actions = [
    { label: 'Deposit',   Icon: RiLuggageDepositLine, onClick: () => setDepositDrawer(true),  color: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Withdraw',  Icon: BiMoneyWithdraw,       onClick: () => setWithdrawDrawer(true), color: '#f0fdf4', iconColor: '#16a34a' },
    { label: 'Bank Card', Icon: RiBankCardLine,        onClick: () => setBankCard(true),       color: '#faf5ff', iconColor: '#7c3aed' },
  ];

  return (
    <div style={{ background: '#f0f2f7', minHeight: '100%' }}>

      {/* header */}
      <header style={{
        background: '#fff', borderBottom: '0.5px solid #e5e7eb',
        padding: '12px 18px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <img src="/photo_2026-03-20_13-41-06.jpg" alt="Logo" style={{ height: 24 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { Icon: HelpCircle,   onClick: () => setShowHelpCenter(true)      },
            { Icon: NotebookIcon, onClick: () => setShowExchangeHistory(true) },
          ].map(({ Icon, onClick }, i) => (
            <button key={i} onClick={onClick} style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f4f5f8', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1f2e',
            }}>
              <Icon size={17} />
            </button>
          ))}
        </div>
      </header>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* balance card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          style={{
            background: '#0d1f3c', borderRadius: 20, padding: 24,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(59,130,246,0.12)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-20, left:-10, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

          <div style={{ fontSize:10, fontWeight:500, letterSpacing:2, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:6 }}>Total Balance</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:22 }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>$</span>
            <span style={{ fontSize:40, fontWeight:600, color:'#fff', letterSpacing:'-1.5px', lineHeight:1, fontFamily:'ui-monospace,monospace' }}>{total}</span>
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:18 }} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
            {[
              { label:'Available', dot:'#34d399', val:available  },
              { label:'Processing', dot:'#fbbf24', val:processing, border:true },
            ].map(({ label, dot, val, border }) => (
              <div key={label} style={{ paddingLeft: border?20:0, paddingRight: border?0:20, borderLeft: border?'1px solid rgba(255,255,255,0.08)':undefined }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:dot }} />
                  <span style={{ fontSize:10, fontWeight:500, letterSpacing:1.5, color:'rgba(255,255,255,0.38)', textTransform:'uppercase' }}>{label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.38)' }}>$</span>
                  <span style={{ fontSize:22, fontWeight:600, color:'#fff', letterSpacing:'-0.5px', fontFamily:'ui-monospace,monospace' }}>{val}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* notification */}
        {currentNotif && (
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.3, delay:0.1 }}
            style={{
              background:'#fff', borderRadius:14, border:'0.5px solid #e5e8ef',
              padding:'10px 14px', display:'flex', alignItems:'center', gap:10, overflow:'hidden',
            }}
          >
            <div style={{ width:30, height:30, borderRadius:8, background:'#eff4ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563eb', flexShrink:0 }}>
              <HiOutlineSpeakerWave size={15} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                transition={{ duration:0.3 }}
                style={{ fontSize:12, color:'#374151', fontWeight:500, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', flex:1 }}
              >
                {formatTime(currentNotif.timestamp)} · {currentNotif.phone} sold ${currentNotif.amount}
              </motion.div>
            </AnimatePresence>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#3b82f6', flexShrink:0, animation:'pulse 2s infinite' }} />
          </motion.div>
        )}

        {/* action buttons */}
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.35, delay:0.18 }}
          style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}
        >
          {actions.map(({ label, Icon, onClick, color, iconColor }) => (
            <div key={label} onClick={onClick} style={{
              background:'#fff', borderRadius:16, border:'0.5px solid #e5e8ef',
              padding:'16px 8px 14px', display:'flex', flexDirection:'column',
              alignItems:'center', gap:9, cursor:'pointer',
              transition:'box-shadow .15s', WebkitTapHighlightColor:'transparent',
            }}>
              <div style={{ width:44, height:44, borderRadius:13, background:color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:iconColor }}>
                <Icon />
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{label}</span>
            </div>
          ))}
        </motion.div>

      </div>

      <ExchangeHistory open={exchangeHistory}    setOpenDrawer={() => setShowExchangeHistory(false)} />
      <DepositDrawer   open={depositDrawer}      setOpenDrawer={() => setDepositDrawer(false)} />
      <WithdrawDrawer  open={withdrawDrawer}     setOpenDrawer={() => setWithdrawDrawer(false)} />
      <BankCard        open={bankCard}           setOpenDrawer={() => setBankCard(false)} />
      <HelpCenter      open={showHelpCenter}     setOpenDrawer={() => setShowHelpCenter(false)} />
    </div>
  );
};

export default Home;