import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Space } from 'antd';
import profileAvatar from '../../public/profile-avatar.jpeg'
import { LuNotebook } from "react-icons/lu";
import { RiBankCardLine } from "react-icons/ri";
import { VscHistory } from "react-icons/vsc";
import { RiLuggageDepositLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { PiShareNetworkBold } from "react-icons/pi";
import { TbExchange } from "react-icons/tb";
import { MdNavigateNext } from "react-icons/md";
import PageWrapper from '../components/client/PageWrapper'
import Statement from '../components/client/drawers/Statement'
import BankCard from '../components/client/drawers/BankCard'
import DepositHistory from '../components/client/drawers/DepositHistory'
import ExchangeHistory from '../components/client/drawers/ExchangeHistory'
import ResetPass from '../components/client/drawers/ResetPass'
import WithdrawHistory from '../components/client/drawers/WithdrawHistory'
import MyReferrals from '../components/client/drawers/MyReferrals'
import Deposit from '../components/client/drawers/Deposit'
import Withdraw from '../components/client/drawers/Withdraw'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, usersGet, usersPost } from '../services/userApi';
import Invite from '../components/client/Invite';
import referralImg from '../../public/business-digital-marketing-free-png.webp'

const Account = () => {
  const { userData } = useSelector((state)=>state.User)
  const [openDrawer,setOpenDrawer]=useState({
    statement : false,
    bankcard : false,
    exchangeHistory : false,
    depositHistory : false,
    withdrawHistory: false,
    myReferrrals : false,
    resetPass : false,
    deposit : false,
    withdraw : false,
    invite : false
  })
  const [loading,setLoading]=useState(false)

  const options = [
    {
      title : "Bank card",
      icon : <RiBankCardLine />,
      onClick:()=>setOpenDrawer((prev)=>({...prev,bankcard : true}))

    },
    {
      title : "Exchange history",
      icon : <VscHistory />,
      onClick:()=>setOpenDrawer((prev)=>({...prev,exchangeHistory : true}))

    },
    {
      title : "Deposit history",
      icon : <RiLuggageDepositLine />,
      onClick:()=>setOpenDrawer((prev)=>({...prev,depositHistory : true}))

    },
    {
      title : "Withdraw history",
      icon : <BiMoneyWithdraw />,
      onClick:()=>setOpenDrawer((prev)=>({...prev,withdrawHistory : true}))

    },
    {
      title : "My referrals",
      icon : <PiShareNetworkBold />,
      onClick:()=>setOpenDrawer((prev)=>({...prev,myReferrrals : true}))

    },
    {
      title : "Reset transaction password",
      icon : <TbExchange />,
      onClick:()=>setOpenDrawer((prev)=>({...prev,resetPass : true}))

    }
  ]

  const logout =async()=>{
    try {
      setLoading(true)
      await usersGet('/logout');
      await logoutUser()
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
    <div className='p-4'>
      <div className='flex'>
       <Avatar size={72} icon={<><img src={profileAvatar} alt="" /></>} />
       <div className='mx-3 text-sm'>
        <div className='text-lg font-semibold'>+91 {userData.phone}</div>
        <div className='pb-1'>{userData.email}</div>
        <div className=''>
        <Button onClick={()=>setOpenDrawer((prev)=>({...prev,deposit : true}))} size='small' type='primary' className='mr-2 text-white border text-xs bg-black'>Deposit</Button>
        <Button onClick={()=>setOpenDrawer((prev)=>({...prev,withdraw : true}))} size='small' className='text-xs'>Withdraw</Button>
        </div>
       </div>
      </div>
      <Card size="small" className="rounded-lg border-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg transition-all my-2">
        <Flex justify='space-between'>
        <div>
        <div className="justify-between text-xs text-gray-500 mb-2">
          <div className='text-lg font-bold text-white'>Invite your friends</div>
          <div className='text-gray-300 text-xs'>Earn upto 5% commission</div>
        </div>
        <Button type='default' onClick={()=>setOpenDrawer((prev)=>({...prev,invite : true}))} size='small' className='text-xs text-white bg-violet-400 border-none rounded-lg'>Get Started</Button>
        </div>
        <img className='h-20' src="https://static.vecteezy.com/system/resources/previews/016/389/984/non_2x/business-digital-marketing-free-png.png" alt={referralImg} />
        </Flex>
      </Card>
      <div>
          {
            options.map((value,index)=>
              <div key={index} onClick={()=>value.onClick()} className='flex items-center justify-between my-4  text-sm cursor-pointer hover:shadow-sm py-1'>
                <div className='flex items-center'>
                  <div className=''>{value.icon}</div>
                  <div className='mx-1'>{value.title}</div>
                </div>

                <MdNavigateNext />
              </div>
            )
          }
      </div>
      <Button
        type="primary"
        className="bg-black top-10 h-10 w-full text-white rounded-md"
        size="large"
        loading={loading}
        block
        onClick={()=>logout()}
      >
        Sign Out
      </Button>
    </div>
      <Deposit open={openDrawer.deposit} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,deposit : false}))}/>
      <Withdraw open={openDrawer.withdraw} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,withdraw : false}))}/>    
      <Statement open={openDrawer.statement} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,statement : false}))}/> 
      <BankCard open={openDrawer.bankcard} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,bankcard : false}))} /> 
      <DepositHistory open={openDrawer.depositHistory} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,depositHistory : false}))} /> 
      <ExchangeHistory open={openDrawer.exchangeHistory} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,exchangeHistory : false}))} /> 
      <WithdrawHistory open={openDrawer.withdrawHistory} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,withdrawHistory : false}))}/> 
      <MyReferrals open={openDrawer.myReferrrals} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,myReferrrals : false}))}/>   
      <ResetPass open={openDrawer.resetPass} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,resetPass : false}))}/> 
      <Invite open={openDrawer.invite} onClose={()=>setOpenDrawer((prev)=>({...prev,invite : false}))}/>
    </PageWrapper>
  )
}

export default Account
