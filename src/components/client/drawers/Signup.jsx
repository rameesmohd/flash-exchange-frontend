import React, { useState } from 'react';
import { Drawer, Input, Typography, Space, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
const { Text,Title } = Typography;

const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      size='large'
      open={open}
      loading={loading}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
      >
        <Title level={2}>E Value trade</Title>

        <Text className='my-0 py-0 font-semibold text-xl'>Welcome back</Text><br />
        <Text className='my-0 py-0 font-semibold text-xs'>Just one step to complete sign in</Text>

        <div className='mt-5'>
          <Text type='secondary'>Phone Number</Text>
          <Space.Compact>
            <Input className='rounded-lg border-gray-300' style={{ width: '20%' }} defaultValue="+91" />
            <Input className='rounded-lg border-gray-300' style={{ width: '80%' }} defaultValue="" />
          </Space.Compact>

          <div className="flex flex-col space-y-1 my-2">
            <Text type="secondary">OTP</Text>
            <Input 
              placeholder="Enter OTP" 
              className="rounded-lg border-gray-300" 
              suffix={<Button disabled={true} className='border-none'>Send</Button>}
            />
          </div>

          <Button className='w-full my-3 h-10'>Sign in</Button>
        </div>
    </Drawer>
  );
};

export default App;
