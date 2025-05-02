import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { CiClock1 } from "react-icons/ci";
const { Text, Paragraph } = Typography;

const App = ({  open,setOpenDrawer  }) => {
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
        <div className="flex justify-between items-center">
          <Text strong className="text-base">Bank Card</Text>
          <History size={20} className="text-gray-500" />
        </div>
      }
    >
   {[1,2,3].map((value,index)=>
    <Card 
    type="inner" 
    title={
     <div className="text-gray-400 text-xs flex items-center px-0 py-0">
        <CiClock1 className="mr-1" />
        01 May 2025 22:02:15
     </div>}
    extra={<a href="#">Delete</a>}
    bodyStyle={{ padding: '8px 12px' }} 
    style={{ borderRadius: '8px' }}
    className='mb-3'
    >
        <p>Account No : 11200259913</p>
        <p>IFSC : FDRL0001129</p>
        <p>Account name : Ramees</p>
    </Card>
    )}

    <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>  
    </Drawer>
  );
};

export default App;
