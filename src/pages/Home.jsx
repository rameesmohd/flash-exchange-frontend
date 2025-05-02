import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { RiLuggageDepositLine, RiBankCardLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HelpCircle, NotebookIcon } from 'lucide-react';
import DepositDrawer from '../components/client/drawers/Deposit'
import WithdrawDrawer from '../components/client/drawers/Withdraw'
import PageWrapper from '../components/client/PageWrapper'
import BankCard from '../components/client/drawers/BankCard'

const Home = () => {
  const [depositDrawer,setDepositDrawer]=useState(false)
  const [withdrawDrawer,setWithdrawDrawer] = useState(false)
  const [bankCard,setBankCard]=useState(false)
  return (
    <PageWrapper>
      {/* Top Header */}
      <header className="p-4 bg-white shadow flex justify-between items-center text-lg font-bold">
        E Value Trade
        <div className="flex space-x-3">
          <HelpCircle size={22} />
          <NotebookIcon size={22} />
        </div>
      </header>

      {/* Page Content */}
      <div className="p-4">

        {/* Notification Bar */}
        <div className="w-full p-2 flex items-center text-sm rounded-md bg-gray-200 mb-4">
          <HiOutlineSpeakerWave className="mx-2" size={20} /> 
          00:02 87****5445 sold $791.4
        </div>

        {/* Balance Card */}
        <Card className="rounded-lg mb-4" bodyStyle={{ padding: '16px' }}>
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Total Balance ($)</p>
            <p className="text-2xl font-bold">0</p>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <p className="text-gray-500 text-sm">Available ($)</p>
              <p className="font-bold text-lg">0</p>
            </Col>
            <Col span={12}>
              <p className="text-gray-500 text-sm">Processing ($)</p>
              <p className="font-bold text-lg">0</p>
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
            <div className="flex flex-col items-center">
              <BiMoneyWithdraw onClick={()=>setWithdrawDrawer(!withdrawDrawer)} size={32} className="text-black mb-1" />
              <p className="text-sm">Withdraw</p>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex flex-col items-center">
              <RiBankCardLine onClick={()=>setBankCard(!bankCard)} size={32} className="text-black mb-1" />
              <p className="text-sm">Bank Card</p>
            </div>
          </Col>
        </Row>

      </div>

      {depositDrawer && <DepositDrawer/>}
      {withdrawDrawer && <WithdrawDrawer/>}
      {bankCard && <BankCard/>}
    </PageWrapper>
  );
};

export default Home;
