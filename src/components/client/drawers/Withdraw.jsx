import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';

import trxicon from '../../../../public/trxicon.png';
import usdticon from '../../../../public/imageusdt.png';

const { Text, Paragraph } = Typography;

const App = ({ role }) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      open={open}
      loading={loading}
      onClose={() => setOpen(false)}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <div className="flex justify-between items-center">
          <Text strong className="text-base">Withdraw USDT</Text>
          <History size={20} className="text-gray-500" />
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: 'Select Address',
            action: <IoMdAdd size={20} />,
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
                TRC20
              </Button>
            ),
          },
          {
            title: 'Wallet Address',
            action: (
                <Paragraph
                className="text-xs mb-0"
                style={{
                  maxWidth: '180px',          // adjust based on your layout
                  wordBreak: 'break-all',     // breaks long strings
                  marginBottom: 0
                }}
              >
                fghjsdfgasdfhjsdfghuisdfhugjsdssssssssssssshfjksdjkhfsdajkhf
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
      />

      <Divider />

      <Space direction="vertical" size="middle" className="w-full">
        <Input
          placeholder="Please enter the amount"
          prefix={<img src={usdticon} alt="usdt" className="w-4 h-4" />}
          suffix="USDT"
        />
        <Button type="primary" block className="bg-black text-white h-10">
          Confirm
        </Button>
      </Space>
    </Drawer>
  );
};

export default App;
