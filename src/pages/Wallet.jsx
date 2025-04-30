import React from 'react';
import { Card, Button, Divider } from 'antd';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { HelpCircle, NotebookIcon } from 'lucide-react';

import imgUsdt from '../../public/tether-usdt-logo.png';
import rupeesIcon from '../../public/gold-coin-rupee-icon.svg';
import binanceIcon from '../../public/binance-icon-512x512-yslglaeq.png';
import wazirxIcon from '../../public/wazirx-svgrepo-com.svg';
import PageWrapper from '../components/client/PageWrapper'

const Exchange = () => {
  return (
    <PageWrapper>

    <div className="max-w-[375px] mx-auto flex flex-col bg-gray-50">
      
      {/* Top Header */}
      <header className="p-4 bg-white shadow-md flex justify-between items-center font-bold text-lg">
        Flash Exchange
        <div className="flex items-center gap-2">
          <HelpCircle size={20} />
          <NotebookIcon size={20} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">

        {/* Crypto Card */}
        <Card size="small" className="rounded-lg border-none">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Crypto</span>
            <span>Available: 0 USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={imgUsdt} alt="USDT" className="h-5 w-5" />
              <span className="ml-2 font-medium">USDT</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-700 text-lg">0.00</div>
              <div className="text-blue-600 text-xs cursor-pointer">Deposit</div>
            </div>
          </div>
        </Card>

        {/* Exchange Icon */}
        <div className="relative z-50 h-0 flex justify-center">
          <div className="absolute -top-5 rounded-full bg-gray-50 w-10 h-10 flex justify-center items-center">
            <CgArrowsExchangeAlt  size={20} />
          </div>
        </div>

        {/* Fiat Card */}
        <Card size="small" className="rounded-lg border-none">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Fiat Currency</span>
            <span>1 USDT: ₹98</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={rupeesIcon} alt="Rupees" className="h-5 w-5" />
              <span className="ml-2 font-medium">INR</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-700 text-lg">0.00</div>
            </div>
          </div>
        </Card>

        {/* Sell Button */}
        <Button
          type="primary"
          className="bg-black h-10 w-full text-white rounded-md"
          size="large"
          block
        >
          SELL USDT
        </Button>

        {/* Exchange Prices */}
        <div>
          <div className="font-bold text-gray-700 mb-2">Exchange Price</div>

          {/* Binance Card */}
          <Card size="small" className="rounded-lg mb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center font-bold text-gray-700">
                <img src={binanceIcon} alt="Binance" className="w-5 h-5 mr-2" />
                Binance
              </div>
              <span className="text-xs text-gray-400">
                Updated: 28 Apr 2025 15:47:02
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>Avg <span className="text-xl font-bold">90.13</span> ₹</div>
              <div>1 USDT = ₹90.13</div>
            </div>
          </Card>

          {/* Wazirx Card */}
          <Card size="small" className="rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center font-bold text-gray-700">
                <img src={wazirxIcon} alt="Wazirx" className="w-5 h-5 mr-2" />
                Wazirx
              </div>
              <span className="text-xs text-gray-400">
                Updated: 28 Apr 2025 15:47:02
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>Avg <span className="text-xl font-bold">88.13</span> ₹</div>
              <div>1 USDT = ₹88.13</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </PageWrapper>

  );
};

export default Exchange;
