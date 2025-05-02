import React, { useEffect } from 'react';
import { Button, } from 'antd';
import { ArrowLeft, History } from 'lucide-react'; 
import { IoMdAdd } from "react-icons/io";
import imageDeposit from '../../public/gradient-cryptocurrency-concept_52683-77383.jpg'
import trxicon from '../../public/trxicon.png'
import usdticon from '../../public/imageusdt.png'
import PageWrapper from '../components/client/PageWrapper'
import { Input } from 'antd';

const App = ({role}) => {
  return (
    <PageWrapper>
      <div className='bg-white'>
        <div className="flex h-14 mb-1 border px-4 justify-between items-center w-full">
          <ArrowLeft/>
          <p className="font-bold text-base m-0">USDT Withdraw</p>
          <History size={20} className="text-gray-500" /> {/* History icon */}
        </div>
        <div className='p-4 bg-gray-50'>
            <div className='flex items-center justify-between border-b p-3'>
                <div className='font-semibold text-gray-800'>Select address</div>
                <IoMdAdd/>
            </div>
            <div className='flex items-center justify-between border-b p-3'>
                <div className='font-semibold text-gray-800'>Currency</div>
                <Button className='border-none' icon={<img className='w-4 h-4' src={usdticon}></img>}>USDT</Button>
            </div>
            <div className='flex items-center justify-between border-b p-3'>
                <div className='font-semibold text-gray-800'>Network</div>
                <Button className='border-none' icon={<img className='w-4 h-4' src={trxicon}></img>}>TRC20</Button>
            </div>
            <div className='flex items-center w-full justify-between border-b p-3'>
                <div className='font-semibold w-full text-gray-800'>Wallet Address</div>
                <div className="w-full ">
                  <p className="whitespace-normal break-words text-xs">
                    fghjsdfgasdfhjsdfghuisdfhugjsds
                    sssssssssssshfjksdjkhfsdajkhf
                  </p>
                </div>
            </div>

        </div>
        <div className='my-4 p-4 bg-gray-50'>
            <Input placeholder='Please enter the amount' prefix={<><img className='w-4 h-4' src={usdticon}/></>} suffix="USDT" />
            <Button className='w-full h-10 my-4 bg-black text-white'>Confirm</Button>
        </div>
      </div>

    </PageWrapper>
  );
};

export default App;
