import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Card, Row, Col, Tag } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import EmptyBox from '../common/EmptyBox';
const { Text } = Typography;

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

const App = ({  open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [orders,setOrders]=useState([])
  const fetchOrders =async()=>{
    try {
      setLoading(true)
      const response = await usersGet('/order')
      if(response.success){
        setOrders(response.orders)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(open){
      fetchOrders()
    }
  },[open])
  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      width={"100%"}
      getContainer={false} // render in parent DOM tree
      open={open}
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
          <Text strong className="text-base">Exchange History</Text>
      }
    >
    { orders.length ? orders.map((value, index) => (
      <Card key={index} bordered className="shadow-md my-2">
        <Row gutter={[8, 4]}>
          <Col span={12}>
            <Text className='text-xs' strong>ID:</Text> <Text className='text-xs' copyable>{value.orderId}</Text><br />
            <Text className='text-xs' strong>INR:</Text> <Text className='text-xs'>₹{value.fiat}</Text><br />
            <Text className='text-xs' strong>Amount:</Text> <Text className='text-base' strong>${value.usdt}</Text>
          </Col>
          <Col span={12}>
            <Text className='text-xs' strong>Status:</Text> {getStatusTag(value.status)}<br />
            <div className="justify-end items-end">
              <Text type="secondary" style={{ fontSize: 12 }}>
                Created: { formatDate(value.createdAt) }
              </Text>
            </div>
          </Col>
          <Text className='text-xs ml-1 mr-2' strong>Address: </Text> <Text className='text-xs'>{value.recieveAddress}</Text>
        </Row>
      </Card>
    )) : <EmptyBox/>}
    {/* <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>   */}
    </Drawer>
  );
};

export default App;
