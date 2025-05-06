import React, { useEffect, useState } from 'react';
import { Button, Drawer, } from 'antd';
import { ArrowLeft, History } from 'lucide-react'; 
import imageDeposit from '../../../../public/gradient-cryptocurrency-concept_52683-77383.jpg'
import trxicon from '../../../../public/trxicon.png'
import usdticon from '../../../../public/imageusdt.png'
import { Input, Tooltip } from 'antd';
import DepositHistory from '../drawers/DepositHistory'
import { usersPost } from '../../../services/userApi';

const App = ({role}) => {
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [openDepositHistory,setOpenDepositHistory]=useState(false)


  const [amount,setAmount]=useState(0)

  const createOrder=async()=>{
    try {
      setLoading(true)
      await usersPost('/deposit',amount)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Drawer
        closable
       destroyOnClose
         placement="right"
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
        closeIcon={<ArrowLeft size={20} />} // Back icon
        title={
          <div className="flex pl-9 justify-between items-center w-full">
            <p className="font-bold text-base m-0">USDT Deposit</p>
            <History onClick={()=>setOpenDepositHistory(true)}  size={20} className="text-gray-500" /> {/* History icon */}
          </div>
        }
      >
        <img className='object-cover w-full h-56' src={imageDeposit} alt="" />

        <div className='my-2 text-gray-600'>Network</div>
        <Button className='w-480' icon={<img className='w-4 h-4' src={trxicon}></img>}>Tron (TRC-20)</Button>
        
        <div className='my-2 text-gray-600'>Amount</div>
        <Input  onChange={(e)=>setAmount((prev)=>({...prev,amount:e.target.value}))} placeholder='Please enter the amount' prefix={<><img className='w-4 h-4' src={usdticon}/></>} suffix="USDT" />

        <Button loading={loading} onClick={createOrder} className='w-full h-10 my-4 bg-black text-white'>Deposit</Button>
      </Drawer>

      {<DepositHistory open={openDepositHistory} setOpenDrawer={()=>setOpenDepositHistory(false)}/>}
    </>
  );
};

export default App;
