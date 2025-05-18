import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card, Col, Row, Tag } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { formatDate } from '../../../services/formatData';
import { usersGet } from '../../../services/userApi';
import EmptyBox from '../common/EmptyBox'

const { Text, Paragraph } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case 'pending':
      return <Tag color="orange">Pending</Tag>;
    case 'completed':
      return <Tag color="green">Completed</Tag>;
    case 'failed':
      return <Tag color="red">Failed</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};


const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [withdrawHistory,setWithdrawHistory]=useState([])

  const fetchWithdrawHistory =async()=>{
    try {
      setLoading(true)
      const response = await usersGet('/withdraw')
       if(response){
          setWithdrawHistory(response.withdraws)
       }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(open){
      fetchWithdrawHistory()
    }
  },[open])

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      size='large sm:default'
      open={open}
      getContainer={false} // render in parent DOM tree
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
          <Text strong className="text-base">Withdraw History</Text>
      }
    >
      <div className="space-y-4">
      { withdrawHistory.length ?  withdrawHistory.map((value, index) => (
      <Card key={index} bordered className="shadow-md">
        <Row gutter={[8, 4]}>
          <Col span={12}>
            <Text className='text-xs' strong>ID:</Text> <Text className='text-xs' copyable>{value.transactionId}</Text><br />
            <Text className='text-xs' strong>Network:</Text> <Text className='text-xs'>{value.paymentMode}</Text><br />
            <Text className='text-xs' strong>Amount:</Text> <Text className='text-base' strong>${value.amount}</Text>
          </Col>
          <Col span={12}>
            <Text className='text-xs' strong>Status:</Text> {getStatusTag(value.status)}<br />
            <div className="justify-end items-end">
              <Text type="secondary" style={{ fontSize: 12 }}>
                Created: {formatDate(value.createdAt)}
              </Text>
            </div>
          </Col>
          <Text className='text-xs ml-1 mr-2' strong>Address: </Text> <Text className='text-xs'>{value.recieveAddress}</Text>
        </Row>
      </Card>
    )) : <EmptyBox/> }
    {/* <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>   */}
    </div>
    </Drawer>
  );
};

export default App;
