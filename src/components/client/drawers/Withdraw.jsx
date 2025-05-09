import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card } from 'antd';
import { ArrowLeft, History, PlusIcon } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import WithdrawHistory from '../drawers/WithdrawHistory'
import Address from '../drawers/Address'
import trxicon from '../../../../public/trxicon.png';
import usdticon from '../../../../public/imageusdt.png';

const { Text, Paragraph } = Typography;

const App = ({}) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openDrawer,setOpenDrawer]=useState({
    address : false,
    withdrawHistory :false
  })
  const [selectedAddress,setSelectedAddress]=useState({})

  return (
    <>
    <Drawer
      closable
      destroyOnClose
      placement="right"
      open={open}
      size='large sm:default'
      loading={loading}
      onClose={() => setOpen(false)}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <div className="flex justify-between items-center">
          <Text strong className="text-base">Withdraw USDT</Text>
          <History onClick={()=>setOpenDrawer((prev)=>({...prev,withdrawHistory : true}))} size={20} className="text-gray-500 hover:scale-110 cursor-pointer" />
        </div>
      }
    >
      { Object.keys(selectedAddress).length ?
        <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: 'Select Address',
            action: <IoMdAdd className='hover:scale-110 cursor-pointer' onClick={()=>setOpenDrawer((prev)=>({...prev,address : true}))} size={20} />,
          },
          {
            title: 'Currency',
            action: (
              <Button type="text" icon={<img src={usdticon} alt="usdt" className="w-4 h-4" />}>
                USDT
              </Button>
            ),
          },
          {
            title: 'Network',
            action: (
              <Button type="text" icon={<img src={trxicon} alt="trx" className="w-4 h-4" />}>
                {selectedAddress.network}
              </Button>
            ),
          },
          {
            title: 'Wallet Address',
            action: (
                <Paragraph
                  className="text-xs mb-0 text-gray-700"
                  style={{
                    maxWidth: '180px',          // adjust based on your layout
                    wordBreak: 'break-all',     // breaks long strings
                    marginBottom: 0
                  }}
                >
                {selectedAddress.address}
              </Paragraph>
            ),
          },
        ]}
        renderItem={({ title, action }) => (
          <List.Item className="px-0">
            <List.Item.Meta title={<Text>{title}</Text>} />
            <div>{action}</div>
          </List.Item>
        )}
      /> :
      <Card onClick={()=>setOpenDrawer((prev)=>({...prev,address : true}))} className='bg-gray-100 border-dashed cursor-pointer hover:scale-105 border-gray-700 flex justify-center items-center'>
          <Text className='flex items-center' type='secondary'><PlusIcon/>Add address</Text>
      </Card>
      }

      <Divider />

      <Space direction="vertical" size="middle" className="w-full">
        <Input
          size='large'
          placeholder="Please enter the amount"
          prefix={<img src={usdticon} alt="usdt" className="w-4 h-4" />}
          suffix="USDT"
          />
        <Button type="primary" block className="bg-black text-white h-10">
          Confirm
        </Button>
      </Space>
    </Drawer>
    
    { <WithdrawHistory open={openDrawer.withdrawHistory} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,withdrawHistory : false}))}/> }
    { <Address selectAddress={setSelectedAddress}  open={openDrawer.address} setOpenDrawer={()=>setOpenDrawer((prev)=>({...prev,address : false}))}/> }
    </>
  );
};

export default App;
