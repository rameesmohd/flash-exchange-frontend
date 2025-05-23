import React, { useState, useEffect } from 'react';
import { Drawer,} from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import EmptyBox from '../common/EmptyBox'
import {formatDate} from '../../../services/formatData'
import { Card, Row, Col, Tag, Typography } from 'antd';
const { Text } = Typography;
import { MdNavigateNext } from "react-icons/md";
import CryptoDeposit from '../CryptoDeposit';

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

const DepositHistoryList = ({ depositHistory }) => {
  const [openDeposit,setOpenDepsit]= useState({
    show : false,
    data : {}
  })
  return (
  !openDeposit.show ? 
  <div className="space-y-4">
    {depositHistory.map((value, index) => (
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
              {
                value.status==="pending" && 
                <span onClick={()=>setOpenDepsit((prev)=>({...prev,show :true,data : value}))} className="flex justify-end items-center text-blue-700 underline font-semibold cursor-pointer">
                  Open <MdNavigateNext className="ml-1 mt-1" />
                </span>
              }
            </div>
          </Col>
        </Row>
      </Card>
    ))}
    <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>  
  </div>: 
  openDeposit.show && <CryptoDeposit deposit={openDeposit.data}/>
)};

const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [depositHistory,setDepositHistory]=useState([])

  const fetchDeposits =async()=>{
    try {
      setLoading(true)
      const response = await usersGet('/deposit')
      setDepositHistory(response.deposits)
    } catch (error) {
      console.log(error);
      if(error.response.data.message){
        message.error(error.response.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(open){
      fetchDeposits()
    }  
  },[open])

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      getContainer={false} // render in parent DOM tree
      width={"100%"}
      open={open}
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
          <Text strong className="text-base">Deposit History</Text>
      }
    >
      { depositHistory.length ? <DepositHistoryList depositHistory={depositHistory}/> : <EmptyBox/> }
    </Drawer>
  );
};

export default App;
