import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { CiClock1 } from "react-icons/ci";

const { Text, Paragraph } = Typography;

const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      width={"100%"}
      getContainer={false} // render in parent DOM tree
      open={open}
      loading={loading}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
      title={
          <Text strong className="text-base">Statement</Text>
      }
    >
    <p className='txt-xs text-gray-400 text-center my-4'>Your connection has been disconnected</p>  
    <p className='txt-xs text-gray-400 text-center my-4'>Please try again later</p>
    </Drawer>
  );
};

export default App;
