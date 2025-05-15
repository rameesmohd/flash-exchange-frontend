import React, { useState, useEffect, useCallback } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card, Result } from 'antd';
import { ArrowLeft, History, PlusIcon } from 'lucide-react';
import { IoMdAdd } from 'react-icons/io';
import WithdrawHistory from '../drawers/WithdrawHistory'
import Address from '../drawers/Address'
import trxicon from '../../../../public/trxicon.png';
import usdticon from '../../../../public/imageusdt.png';
import { useDispatch, useSelector } from 'react-redux';
import { usersPost } from '../../../services/userApi';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../../../redux/ClientSlice';
import TransactionPinModal from '../TransactionPinModal';
import { closePinModal, openPinModal } from '../../../redux/PinModalSlice';

const { Text, Paragraph } = Typography;

const App = ({open,setOpenDrawer}) => {
  const { selectedAddress } = useSelector((state)=>state.User)
  const { isOpen } = useSelector((state) => state.PinModal);

  const navigate=useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [amount,setAmount]=useState("")
  const [errMsg,setErrMsg]=useState("")
  const [openDrawer,setDrawer]=useState({
    address : false,
    withdrawHistory :false
  })
  const [success,setSuccess]=useState({
    show : false,
    withdraw : {}
  })

  useEffect(()=>{
    setErrMsg("")
  },[amount])

  const submitWithdraw = useCallback(async (pin) => {
    console.log("Submit Withdraw triggered with PIN:", pin);
    try {
      setLoading(true);
      const response = await usersPost('/withdraw', {
        pin,
        amount,
        addressId: selectedAddress._id
      });
      console.log("API response:", response); // Add this
  
      if (response.success) {
        setSuccess({ show: true, withdraw: response.withdraw });
        dispatch(setUserData(response.user));
      } else {
        setErrMsg(response.message);
      }
    } catch (error) {
      console.log("Withdraw error:", error);
      if (error?.response?.data?.message) {
        setErrMsg(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [amount, selectedAddress, dispatch]);
  

  return (
    <>
    <Drawer
      closable
      destroyOnClose
      placement="right"
      open={open}
      size='large sm:default'
      onClose={() => setOpenDrawer(false)}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <div className="flex justify-between items-center">
          <Text strong className="text-base">Withdraw USDT</Text>
          <History onClick={()=>setDrawer((prev)=>({...prev,withdrawHistory : true}))} size={20} className="text-gray-500 hover:scale-110 cursor-pointer" />
        </div>
      }
    >
    {!success.show? <>
      { Object.keys(selectedAddress).length ?
        <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: 'Select Address',
            action: <IoMdAdd className='hover:scale-110 cursor-pointer' onClick={()=>setDrawer((prev)=>({...prev,address : true}))} size={20} />,
          },
          {
            title: 'Currency',
            action: (
              <Button type="text" icon={<img src={usdticon} alt="usdt" className="w-4 h-4" />}>
                USDT
              </Button>
            ),
          },
          {
            title: 'Network',
            action: (
              <Button type="text" icon={<img src={trxicon} alt="trx" className="w-4 h-4" />}>
                {selectedAddress.network}
              </Button>
            ),
          },
          {
            title: 'Wallet Address',
            action: (
                <Paragraph
                className="text-xs mb-0 text-gray-700"
                  style={{
                    maxWidth: '180px',          // adjust based on your layout
                    wordBreak: 'break-all',     // breaks long strings
                    marginBottom: 0
                  }}
                >
                {selectedAddress.address}
              </Paragraph>
            ),
          },
        ]}
        renderItem={({ title, action }) => (
          <List.Item className="px-0">
            <List.Item.Meta title={<Text>{title}</Text>} />
            <div>{action}</div>
          </List.Item>
        )}
        /> :
      <Card onClick={()=>setDrawer((prev)=>({...prev,address : true}))} className='bg-gray-100 border-dashed cursor-pointer hover:scale-105 border-gray-700 flex justify-center items-center'>
          <Text className='flex items-center' type='secondary'><PlusIcon/>Add address</Text>
      </Card>
      }

      <Divider />

      <Space direction="vertical" size="middle" className="w-full">
        <Input
          size='large'
          type='number'
          placeholder="Please enter the amount"
          prefix={<img src={usdticon} alt="usdt" className="w-4 h-4" />}
          suffix="USDT"
          onChange={(e)=>setAmount(e.target.value)}
          />
        {errMsg && <Text type='danger' className='text-xs'>{errMsg}</Text>}
        <Button 
        onClick={() => dispatch(openPinModal())}
        disabled={amount<10} 
        loading={loading} 
        type="primary" 
        size='large' block 
        className="bg-black text-white">
            Confirm
        </Button>
      </Space>
    </> : <Result
              status="success"
              title={`#${success.withdraw.transactionId} You have successfully submitted withdraw request`}
              subTitle={`${success.withdraw.amount} USDT will be send after verification`}
              extra={[
                <Button onClick={()=>navigate('/home')} key="buy">Done</Button>,
              ]}
          />
      }
              
    </Drawer>
    
    <WithdrawHistory 
      open={openDrawer.withdrawHistory} 
      setOpenDrawer={()=>setDrawer((prev)=>({...prev,withdrawHistory : false}))}
      /> 
    <Address 
      open={openDrawer.address} 
      setOpenDrawer={()=>setDrawer((prev)=>({...prev,address : false}))}
      /> 
    <TransactionPinModal
      key={isOpen ? 'open' : 'closed'}
      open={isOpen}
      onClose={() => dispatch(closePinModal())}
      onSubmit={(pin) => {
        console.log("PIN received in parent onSubmit:", pin);
        submitWithdraw(pin);
        dispatch(closePinModal());
      }}
    />
    </>
  );
};

export default App;
