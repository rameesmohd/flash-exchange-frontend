import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { CiClock1 } from "react-icons/ci";

import trxicon from '../../../../public/trxicon.png';
import usdticon from '../../../../public/imageusdt.png';

const { Text, Paragraph } = Typography;

const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      getContainer={false} // render in parent DOM tree
      size='large sm:default'
      open={open}
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
          <Text strong className="text-base">My Referrals</Text>
      }
    >
 

    <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>  
    </Drawer>
  );
};

export default App;
