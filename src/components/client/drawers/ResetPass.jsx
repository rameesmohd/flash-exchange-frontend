import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, List, Typography, Space, Divider, Card, message } from 'antd';
import { ArrowLeft, History } from 'lucide-react';
import { usersGet, usersPost } from '../../../services/userApi';
const { Text, Paragraph } = Typography;

const App = ({ open,setOpenDrawer }) => {
  const [loading, setLoading] = useState({
    otpSend : false,
    submit : false
  });  
  const [newPin ,setNewPin] = useState('')
  
  const [otp,setOtp]=useState({
    OtpId : '',
    OTP : ''
  })

  const [err,setErr]=useState("")

  useEffect(()=>{
    setErr("")
  },[newPin,otp])

  const sendOtp =async()=>{
    try {
      setLoading((prev)=>({...prev,otpSend : true}))
      const response  = await usersGet('/send-otp')
      if(response.success){
        setOtp((prev)=>({
          ...prev,
          OtpId : response.otpId
        }))
        setTimer({ show: true, counter: 30 });
      }
    } catch (error) {
      console.log(error);
      if(error.response.data.message){
        setErr(error.response.data.message)
      }
    } finally {
      setLoading((prev)=>({...prev,otpSend : false}))
    }
  }

  const submit = async()=>{
    try {
      setLoading((prev)=>({...prev,submit : true}))
      const response = await usersPost('/reset-pin',{ 
        OTP:otp.OTP, 
        otpId:otp.OtpId,
        newPin
      })
      if(response.success){
        setOtp({
          OtpId : '',
          OTP : ''
        })
        setNewPin('')
        message.success(response.message)
        setOpenDrawer()
      }
    } catch (error) {
      console.log(error);
      if(error.response.data.message){
        setErr(error.response.data.message)
      }
    } finally {
      setLoading((prev)=>({...prev,submit : false}))
    }
  }

  const [timer, setTimer] = useState({
    show: false,
    counter: 30
  });

  useEffect(() => {
    let interval;
    if (timer.show && timer.counter > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, counter: prev.counter - 1 }));
      }, 1000);
    } else if (timer.counter <= 0 && timer.show) {
      setTimer({ show: false, counter: 30 });
    }
  
    return () => clearInterval(interval);
  }, [timer]);
  
  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      open={open}
      width={"100%"}
      getContainer={false} // render in parent DOM tree
      // loading={loading}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <Text strong className="text-base">Reset Password</Text>
      }
    >
      <div className='my-2'>OTP</div>
      <Input 
      maxLength={6}
      placeholder='******' 
      onChange={(e)=>setOtp((prev)=>({...prev,OTP : e.target.value}))} 
      type='tel'
      size='large' 
      suffix={
      <Button
       loading={loading.otpSend} 
       disabled={timer.show}
       size='' 
       className='text-blue-600 px-2 py-0'
       onClick={()=>sendOtp()}
       >
       { !timer.show ? "Send" : `Send (${timer.counter})` }
       </Button>} 
      />
      <div className='my-2'>New Password</div>
      <Input 
        maxLength={6} 
        value={newPin} 
        placeholder='******' 
        onChange={(e)=>setNewPin(e.target.value)} 
        type='tel'
        size='large' 
        suffix={<Button size=''  className='border-none'></Button>} 
      />
      <Text className='text-xs' type='danger'>{err}</Text>
      <Button
        disabled={newPin.length!==6 || otp.OTP.length!==6 || otp.OtpId===''}
        type=''
        loading={loading.submit}
        size='large'
        className="w-full py-5 my-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold shadow-lg hover:brightness-105 transition-all"
        onClick={submit}
      >
        Confirm
      </Button>
    </Drawer>
  );
};

export default App;
