import React, { useEffect } from 'react';
import { Button, } from 'antd';
import { History } from 'lucide-react'; 
import imageDeposit from '../../public/gradient-cryptocurrency-concept_52683-77383.jpg'
import trxicon from '../../public/trxicon.png'
import usdticon from '../../public/imageusdt.png'
import { Input } from 'antd';

const App = ({role}) => {
  return (
    <>
      <div className=''>
        <div className="flex pl-9 h-14 mb-1 border px-4 justify-between items-center w-full">
          <p className="font-bold text-base m-0">USDT Deposit</p>
          <History size={20} className="text-gray-500" /> {/* History icon */}
        </div>
        <div className='p-6'>
        <img className='object-cover w-full h-56' src={imageDeposit} alt="" />

        <div className='my-2 text-gray-600'>Network</div>
        <Button className='w-480' icon={<img className='w-4 h-4' src={trxicon}></img>}>Tron (TRC-20)</Button>
        
        <div className='my-2 text-gray-600'>Amount</div>
        <Input placeholder='Please enter the amount' prefix={<><img className='w-4 h-4' src={usdticon}/></>} suffix="USDT" />

        <Button className='w-full h-10 my-4 bg-black text-white'>Deposit</Button>
        </div>
      </div>
    </>
  );
};

export default App;
