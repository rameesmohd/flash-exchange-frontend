import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { RiLuggageDepositLine, RiBankCardLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HelpCircle, NotebookIcon } from 'lucide-react';
import DepositDrawer from '../components/client/drawers/Deposit'
import WithdrawDrawer from '../components/client/drawers/Withdraw'
import PageWrapper from '../components/client/PageWrapper'
import BankCard from '../components/client/drawers/BankCard'
import { useDispatch, useSelector } from 'react-redux';
import ExchangeHistory from '../components/client/drawers/ExchangeHistory'
import { usersGet } from '../services/userApi';
import { setFund,setNotifications} from '../redux/ClientSlice';
import HelpCenter from '../components/client/drawers/HelpCenter';
import { motion, AnimatePresence } from "framer-motion";
const {Title} = Typography

const Home = () => {
  const [depositDrawer,setDepositDrawer]=useState(false)
  const [withdrawDrawer,setWithdrawDrawer] = useState(false)
  const [bankCard,setBankCard]=useState(false)
  const [exchangeHistory,setShowExchangeHistory]=useState(false)
  const [showHelpCenter,setShowHelpCenter]=useState(false)
  const { userData,notifications } = useSelector((value)=>value.User)
  const user=userData
  const dispatch = useDispatch()

  const fetchfunds = async()=>{
    try {
      const response = await usersGet('/funds')
      if(response.success){
        dispatch(setFund(response.fund))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [index, setIndex] = useState(0);
  
  const getNotifications = async()=>{
    try {
      const response = await usersGet('/notifications')
      if(response.success) {
        dispatch(setNotifications(response.notifications))
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    // fetchfunds()
    getNotifications()
  },[])

  useEffect(() => {
    if (notifications.length === 0) return;

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % notifications.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [notifications]);

  const formatTime = (isoTime) => {
  const localDate = new Date(isoTime);
    return localDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <PageWrapper>
      {/* Top Header */}
      <header className="p-4 bg-white shadow flex justify-between items-center text-lg font-bold">
      <Title level={4} className="!mb-0"> 
        <div className='flex items-center'>
        <img src="/photo_2026-03-20_13-41-06.jpg" alt="Logo" className="h-5 inline mr-2"/>
          {/* FsQuickPay */}
        </div>
      </Title>
        <div className="flex space-x-3">
          <HelpCircle onClick={()=>setShowHelpCenter(true)} size={22} />
          <NotebookIcon onClick={()=>setShowExchangeHistory(true)} size={22} />
        </div>
      </header>

      {/* Page Content */}
      <div className="p-4">

        {/* Notification Bar */}
        <div className="w-full p-2 flex items-center text-sm rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:brightness-105 transition-all mb-4">
          <HiOutlineSpeakerWave className="mx-2" size={20} /> 
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="ml-8 absolute"
            >
              {
                notifications[index]&& 
                <>
                {
                  formatTime(notifications[index].timestamp)} {notifications[index].phone} sold ${notifications[index].amount
                }
                </>
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Balance Card */}
        <div style={{
          background: '#0d1f3c', borderRadius: 20, padding: '24px',
          position: 'relative', overflow: 'hidden', marginBottom: 16,
        }}>
          {/* decorative circles */}
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160,
            borderRadius:'50%', background:'rgba(59,130,246,0.12)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-20, left:-10, width:90, height:90,
            borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        {/* total */}
        <div style={{ fontSize:10, fontWeight:500, letterSpacing:2, color:'rgba(255,255,255,0.4)',
          textTransform:'uppercase', marginBottom:6 }}>Total Balance</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:22 }}>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.45)' }}>$</span>
          <span style={{ fontSize:40, fontWeight:600, color:'#fff', letterSpacing:'-1.5px',
            lineHeight:1, fontFamily:'ui-monospace, monospace' }}>
            {user?.availableBalance != null && user?.processing != null
              ? (Number(user.availableBalance) + Number(user.processing)).toFixed(2)
              : '0.00'}
          </span>
        </div>

      <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:18 }} />

      {/* sub row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
        <div style={{ paddingRight:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#34d399' }} />
            <span style={{ fontSize:10, fontWeight:500, letterSpacing:1.5,
              color:'rgba(255,255,255,0.38)', textTransform:'uppercase' }}>Available</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.38)' }}>$</span>
            <span style={{ fontSize:22, fontWeight:600, color:'#fff',
              letterSpacing:'-0.5px', fontFamily:'ui-monospace, monospace' }}>
              {user?.availableBalance != null ? user.availableBalance.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        <div style={{ paddingLeft:20, borderLeft:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#fbbf24' }} />
            <span style={{ fontSize:10, fontWeight:500, letterSpacing:1.5,
              color:'rgba(255,255,255,0.38)', textTransform:'uppercase' }}>Processing</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.38)' }}>$</span>
            <span style={{ fontSize:22, fontWeight:600, color:'#fff',
              letterSpacing:'-0.5px', fontFamily:'ui-monospace, monospace' }}>
              {user?.processing != null ? user.processing.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>

        {/* Actions */}
        <Row gutter={16} justify="center" className="text-center">
          <Col span={8}>
            <div className="flex flex-col items-center cursor-pointer">
              <RiLuggageDepositLine onClick={()=>setDepositDrawer(!depositDrawer)} size={32} className="text-black mb-1" />
              <p className="text-sm">Deposit</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex flex-col items-center cursor-pointer">
              <BiMoneyWithdraw onClick={()=>setWithdrawDrawer(!withdrawDrawer)} size={32} className="text-black mb-1" />
              <p className="text-sm">Withdraw</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex flex-col items-center cursor-pointer">
              <RiBankCardLine onClick={()=>setBankCard(!bankCard)} size={32} className="text-black mb-1" />
              <p className="text-sm">Bank Card</p>
            </div>
          </Col>
        </Row>

      </div>
      <ExchangeHistory 
        open={exchangeHistory} 
        setOpenDrawer={()=>setShowExchangeHistory(false)}
      /> 
      <DepositDrawer open={depositDrawer} setOpenDrawer={()=>setDepositDrawer(false)}/> 
      <WithdrawDrawer open={withdrawDrawer} setOpenDrawer={()=>setWithdrawDrawer(false)}/> 
      <BankCard open={bankCard} setOpenDrawer={()=>setBankCard(false)}/> 
      <HelpCenter open={showHelpCenter} setOpenDrawer={()=>setShowHelpCenter(false)}/>
    </PageWrapper>
  );
};

export default Home;
