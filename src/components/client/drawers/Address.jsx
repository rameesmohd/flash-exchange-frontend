import React, { useState, useEffect } from 'react';
import {  Button, Card, Col, Drawer, Flex, Input, Row, Typography } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { usersGet, usersPost } from '../../../services/userApi';
import { MdNavigateNext } from 'react-icons/md';
import EmptyBox from '../common/EmptyBox';
import { formatDate } from '../../../services/formatData';
const { Text } = Typography;

const App = ({ open,setOpenDrawer,selectAddress }) => {
  const [addressList,setAddressList]=useState([])
  const [loading, setLoading] = useState({
    drawer : false,
    addAddress : false
  });

  const [showAddAddress,setShowAddAddress]=useState(false)
  const [newAddress,setNewAddress]=useState("")
  const [addAddressErr,setAddAddressErr]=useState("")


  const fetchAddress =async()=>{
    try {
      setLoading((prev)=>({...prev,drawer : true}))
      const respose = await usersGet('/address')
      if(respose.success){
        setAddressList(respose.address)
      } 
    } catch (error) {
      console.log(error);
    
    } finally {
      setLoading((prev)=>({...prev,drawer : false}))
    }
  }

  const addAddress=async()=>{
    try {
      setLoading((prev)=>({...prev,addAddress : true}))
      const respose = await usersPost('/address',{address:newAddress})
      if(respose.success){
        setShowAddAddress(false)
      } else{
        setAddAddressErr(respose.message)
      }
    } catch (error) {
      console.log(error);
      if(error.response.data.message){
        setAddAddressErr(error.response.data.message)
      }
    } finally {
      setLoading((prev)=>({...prev,addAddress : false}))
    }
  }

  useEffect(()=>{
    if(open){
      fetchAddress()
    }
  },[open])

  const selectAdd=(address)=>{
    selectAddress(address)
    setOpenDrawer()
  }

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      open={open}
      loading={loading.drawer}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <div className="flex justify-between items-center">          
          <Text strong className="text-base">Address</Text>
         {!showAddAddress ? 
          <IoMdAdd onClick={()=>setShowAddAddress(true)} className='hover:scale-110 cursor-pointer' size={20}/> : 
          <Button size='small' onClick={()=>setShowAddAddress(false)} type='text' className='font-semibold cursor-pointer'>Cancel</Button>
        }
        </div>
      }
    >
      {showAddAddress ? 
      <>
        <Text strong>Address</Text>
        <Input
          type='default'
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Paste here"
          size="large"
          className="my-2"
      />
      {addAddressErr && (
          <Text type="danger" className="block text-xs mb-2">
            {addAddressErr}
          </Text>
      )}
      <Button
          onClick={addAddress}
          className="w-full bg-black text-gray-100"
          size="large"
          type="primary"
          block
      >
          Add
      </Button>
      </> : 
      <>
        {addressList.length ? 
           <>
           {
             addressList.map((value,index)=>
               <Card onClick={()=>selectAdd(value)} key={index} className='mb-1 hover:border-gray-300' type='inner' bodyStyle={{padding : 10}}>
                 <Row gutter={[8, 4]} style={{ width: '100%' }}>
                   <Col span={24}>
                     <Text className="text-xs" strong>
                       Address:
                     </Text>{" "}
                     <Text className="text-xs" >
                       {value.address}
                     </Text>
                   </Col>
       
                   <Col span={24}>
                     <Text className="text-xs" strong>
                       Network:
                     </Text>{" "}
                     <Text className="text-xs">{value.network}</Text>
                   </Col>
                   <Col span={24}>
                     <Text type="secondary" style={{ fontSize: 12 }}>
                       Created At: {formatDate(value.createdAt)}
                     </Text>
                   </Col>
                 </Row>
                 </Card>
             )
           }
           <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>
           </>
        : <EmptyBox/>}
      </>}
    </Drawer>
  );
};

export default App;
