import React, { useState, useEffect } from 'react';
import {  Drawer, Typography } from 'antd';
import { ArrowLeft } from 'lucide-react';
const { Text } = Typography;

const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      open={open}
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
          <Text strong className="text-base">Address</Text>
      }
    >
 

    <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>  
    </Drawer>
  );
};

export default App;
