import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card } from 'antd';
import { Form } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { CiClock1 } from "react-icons/ci";
const { Text, Paragraph } = Typography;

const App = ({  open,setOpenDrawer  }) => {
  const [loading, setLoading] = useState(false);
  const [showAddBankCard,setShowBankCard]=useState(false)

  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

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
          {!showAddBankCard ? <IoMdAdd onClick={()=>setShowBankCard(true)} className='hover:scale-110 cursor-pointer' size={20}/> :
          <Button size='small' onClick={()=>setShowBankCard(false)} type='text' className='font-semibold cursor-pointer'>Cancel</Button>}
        </div>
      }
    >
    {
    !showAddBankCard ? <>
    {[1,2,3].map((value,index)=>
    <Card 
      key={index}
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
    </> :
    <Card  bordered={false} bodyStyle={{padding:5}} className="max-w-md mx-auto border-none rounded-xl">
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Account Number"
          name="accountNumber"
          initialValue=""
          rules={[{ required: true, message: 'Please enter account number' }]}
        >
          <Input type='default' size='large'/>
        </Form.Item>
        <Form.Item
          label="IFSC Code"
          name="ifsc"
          initialValue=""
          rules={[{ required: true, message: 'Please enter IFSC code' }]}
        >
          <Input type='default' size='large'/>
        </Form.Item>
        <Form.Item
          label="Account Name"
          name="accountName"
          initialValue=""
          rules={[{ required: true, message: 'Please enter account name' }]}
        >
          <Input type='default' size='large'/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" className='bg-black text-white' htmlType="submit" block>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Card>
    }
    </Drawer>
  );
};

export default App;
