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
      <div className=''>
        <div className="flex h-14 mb-1 border px-4 justify-between items-center w-full">
          <ArrowLeft/>
          <p className="font-bold text-base m-0">USDT Withdraw</p>
          <History size={20} className="text-gray-500" /> {/* History icon */}
        </div>
        <div className='p-4'>
            <div className='flex items-center justify-between border-b p-3'>
                <div className='font-semibold text-gray-800'>Select address</div>
                <IoMdAdd/>
            </div>
      </div>
      </div>

    </PageWrapper>
  );
};

export default App;
