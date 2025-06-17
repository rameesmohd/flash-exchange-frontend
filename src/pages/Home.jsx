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
        <img src="/LOGO.svg" alt="Logo" className="h-8 inline mr-2"/>
        eValueTrade
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
        <Card className="rounded-lg mb-4" bodyStyle={{ padding: '16px' }}>
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Total Balance ($)</p>
            <p className="text-2xl font-bold">
              {user?.availableBalance != null && user?.processing != null
                ? (Number(user.availableBalance) + Number(user.processing)).toFixed(2)
                : "0.00"}
            </p>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <p className="text-gray-500 text-sm">Available ($)</p>
              <p className="font-bold text-lg">{user?.availableBalance!= null ? user.availableBalance.toFixed(2) : 0.00}</p>
            </Col>
            <Col span={12}>
              <p className="text-gray-500 text-sm">Processing ($)</p>
              <p className="font-bold text-lg">{user?.processing!= null ? user.processing.toFixed(2) : 0.00}</p>
            </Col>
          </Row>
        </Card>

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
