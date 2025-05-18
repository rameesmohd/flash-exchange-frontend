import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card, Badge,Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
import { Form } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import { CiClock1 } from "react-icons/ci";
const { Text } = Typography;
import {usersDelete, usersGet, usersPost} from '../../../services/userApi'
import {formatDate} from '../../../services/formatData'
import { useDispatch, useSelector } from 'react-redux';
import { setBankCardSelected } from '../../../redux/ClientSlice';
import EmptyBox from '../common/EmptyBox'

const App = ({  open,setOpenDrawer  }) => {
  const [loading, setLoading] = useState(false);
  const [loaderDelete,setLoaderDelete]=useState(false)
  const [showAddBankCard,setAddShowBankCard]=useState(false)
  const [bankCard,setBankCard]=useState([])
  const dispatch = useDispatch()
  const {selectedBankCard} = useSelector((state)=>state.User)
  const [form] = Form.useForm();

  const handleFinish = async(values) => {
    try {
      setLoading(true)
      const response = await usersPost('/bank-card',values)
      if(response.success){
        setAddShowBankCard(false)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const fetchBankCards = async()=>{
    try {
      const response = await usersGet('/bank-card')
      if(response.success){
        setBankCard(response.bankCards)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteBankCard=async(id)=>{
    try {
      setLoaderDelete(true)
      const response = await usersDelete(`/bank-card?id=${id}`)
      if(response.success){
        setBankCard(response.bankCards)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoaderDelete(false)

    }
  }

  const handleSelect=(value)=>{
    dispatch(setBankCardSelected(value))
    setOpenDrawer()
  }

  useEffect(()=>{
    if(!showAddBankCard){
      fetchBankCards()
    }
  },[showAddBankCard])

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure delete this card?',
      icon: <ExclamationCircleFilled />,
      content: 'Once deleted card cant be recovered',
      okText: 'Confirm',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteBankCard(id)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      size='large sm:default'
      getContainer={false} // render in parent DOM tree
      open={open}
      loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <div className="flex justify-between items-center">
          <Text strong className="text-base">Bank Card</Text>
          {!showAddBankCard ? <IoMdAdd onClick={()=>setAddShowBankCard(true)} className='hover:scale-110 cursor-pointer' size={20}/> :
          <Button size='small' onClick={()=>setAddShowBankCard(false)} type='text' className='font-semibold cursor-pointer'>Cancel</Button>}
        </div>
      }
    >
    {
    !showAddBankCard ? <>
    {
      bankCard.length ?
      bankCard.map((value,index)=>
      <Badge.Ribbon key={index+index} text="Selected" className={selectedBankCard._id == value._id ?'':'hidden'} placement='end' color="green">
      <Card 
      key={index}
      type="inner"
      title={
        <div className={`flex items-center text-gray-400 text-xs font-normal`}>
          <CiClock1 className="mr-1" />
          {value.createdAt && formatDate(value.createdAt)}
        </div>
      }
      headStyle={{ padding: '4px 12px' }} // Fine-tune this if needed
      extra={ 
      <Button  className={selectedBankCard._id == value._id ? 'hidden':''} onClick={()=>showDeleteConfirm(value._id)} type="dashed">
        Delete
      </Button>
      }
      bodyStyle={{ padding: '8px 12px' }}
      style={{ borderRadius: '8px' }}
      className={`${ selectedBankCard._id == value._id ? 'border-gray-800 border-double':''} mb-3 text-sm`}
      >
      <div className='cursor-pointer' onClick={()=>handleSelect(value)}>
        <p>Account No: {value.accountNumber}</p>
        <p>IFSC: {value.ifsc}</p>
        <p>Account Name: {value.accountName}</p>
      </div>
    </Card>
    </Badge.Ribbon>
    ) : <EmptyBox/>} 
    {/* <p className='txt-sm text-gray-400 text-center my-4'>No more data</p>   */}
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
