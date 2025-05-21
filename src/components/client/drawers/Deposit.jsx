import React, { useEffect, useState } from 'react';
import { Drawer, } from 'antd';
const { Text } = Typography;
import { Button, Flex, Spin, message, Typography, Space } from 'antd';
import { ArrowLeft, History } from 'lucide-react'; 
import imageDeposit from '../../../../public/gradient-cryptocurrency-concept_52683-77383.jpg'
import trxicon from '../../../../public/trxicon.png'
import usdticon from '../../../../public/imageusdt.png'
import { Input } from 'antd';
import DepositHistory from '../drawers/DepositHistory'
import { usersPost } from '../../../services/userApi';
import CryptoDeposit from '../CryptoDeposit';

const App = ({open,setOpenDrawer}) => {
  const [loading, setLoading] = React.useState(false);
  const [openDepositHistory,setOpenDepositHistory]=useState(false)
  const [amount,setAmount]=useState(0)
  const [showAddress,setShowAddress]=useState(false)
  const [depositData,setDepositData]=useState({})

  const createOrder=async()=>{
    try {
      setLoading(true)
      const response = await usersPost('/deposit',{amount})
      if(response.deposit){
        setDepositData(response.deposit)
        setShowAddress(true)
      }
      setShowAddress(true)
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
        width={"100%"}
        getContainer={false} // render in parent DOM tree
        // bodyStyle={{padding : 5}}
        open={open}
        loading={loading}
        onClose={() => setOpenDrawer(false)}
        closeIcon={<ArrowLeft size={20} />}
        title={
          <div className="flex pl-9 justify-between items-center w-full">
            <p className="font-bold text-base m-0">USDT Deposit</p>
            <History onClick={()=>setOpenDepositHistory(true)}  size={20} className="text-gray-500" /> {/* History icon */}
          </div>
        }
      >
      {!showAddress? <>
        <img className='object-cover w-full' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9oO-e1ye0LxSXNVFLtClVr4hAX5ZlOYlDYg&s"} alt={usdticon} />
        <div className='my-2 text-gray-600'>Network</div>
        <Button className='w-480' icon={<img className='w-4 h-4' src={trxicon}></img>}>Tron (TRC-20)</Button>
        <div className='my-2 text-gray-600'>Amount</div>
        <Input size='large' onChange={(e)=>setAmount(e.target.value)} placeholder='Please enter the amount' prefix={<><img className='w-4 h-4' src={usdticon}/></>} suffix="USDT" />
        <Button loading={loading} disabled={amount<100} onClick={createOrder} className='w-full h-10 my-4 bg-black text-white'>Deposit</Button>
      </> : <CryptoDeposit deposit={depositData}/>}
      </Drawer>
      <DepositHistory open={openDepositHistory} setOpenDrawer={()=>setOpenDepositHistory(false)}/>

    </>
  );
};

export default App;
