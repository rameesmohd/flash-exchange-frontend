import React, { useEffect, useState } from 'react'
import { Button, Flex, Spin, message, Typography, Space, Result } from 'antd';
import usdticon from '../../../public/imageusdt.png'
import { Textarea } from 'flowbite-react';
import { Card, Row, Col } from 'antd';
import QRCode from 'qrcode.react';
import { CopyOutlined } from '@ant-design/icons';
import { usersDelete, usersPatch } from '../../services/userApi';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;

const CryptoDeposit = ({deposit,onCancel}) => {
    const [address,setAddress]=useState(deposit.recieveAddress.address)
    const [amount,setAmount]=useState(deposit.amount || 0)
    const [loading, setLoading] = React.useState({
        confirmTxid : false,
        loadAddress  :false,
        cancel : false
    });
    const [showSuccess,setShowSuccess] = useState(false)
    const [txid,setTxid]=useState("")
    const [errMsg,setErrMsg]=useState("")
    const navigate = useNavigate()

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address).then(() => {
        message.success('Address copied to clipboard!');
    }).catch(() => {
        message.error('Failed to copy address.');
    });
    };

    useEffect(()=>{
      setErrMsg('')
    },[txid])

    const checkPayment =async()=>{
        try {
           setLoading((prev)=>({...prev,confirmTxid :  true}))
           const response =  await usersPatch('/deposit',{txid,id:deposit._id})
           if(response.success) { 
              setShowSuccess(true)
              setErrMsg(response.message || "Deposit success")
           } else { 
              setErrMsg(response.message || "Deposit not completed")
           }
        } catch (error) {
            console.log(error);
            setErrMsg(error.response?.data?.message)
        } finally {
            setLoading((prev)=>({...prev,confirmTxid :  false}))
        }
    }

    const cancelPayment=async()=>{
      try {
        setLoading((prev)=>({...prev,cancel :  true}))
        const response =  await usersDelete(`/deposit?id=${deposit._id}`)
        if(response.success) { 
          setErrMsg(response?.message)
          onCancel()
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading((prev)=>({...prev,cancel :  false}))
      }
    }

    const [remainingTime, setRemainingTime] = useState(0);
    useEffect(() => {
      const updatedAt = new Date(deposit.updatedAt).getTime();
      const expiryTime = updatedAt + 20 * 60 * 1000; // 20 minutes in ms

      const updateTimer = () => {
          const now = new Date().getTime();
          const timeLeft = Math.max(expiryTime - now, 0);
          setRemainingTime(timeLeft);

          if (timeLeft <= 0) {
              clearInterval(timerInterval);
          }
      };

      updateTimer(); // run immediately
      const timerInterval = setInterval(updateTimer, 1000); // update every second

      return () => clearInterval(timerInterval);
    }, [deposit.updatedAt]);

    const formatTime = (milliseconds) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${minutes}:${seconds}`;
    };


    return (
    <div>
      <Row justify="center" className="my-1">
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card variant='borderless' bodyStyle={{padding : 5}} className="w-full">
          {!showSuccess && <><Flex gap="middle" justify='center' className='my-0' wrap>
              <div className="relative">
                <QRCode 
                level={'H'}
                value={address} 
                size={80}
                />

              </div>
            </Flex>
            <Text strong className="text-lg">{amount} USDT</Text>
             <div className="my-1">
            <div className='flex justify-between items-center '>
              <div className='font-semibold flex '>Awaiting Payment <Spin size='small' className='mx-3 my-1'/>  </div>
            </div>
            {/* <Text type="secondary" className="font-light text-xs block">
              Send {amount} {"method.method"} to this address:
            </Text> */}
            <Space className="my-1 justify-center w-full" size="small">
            {
                loading.loadAddress ? 
                <Spin fullscreen size='small'/> :
                <div onClick={()=>copyToClipboard()} className="border w-full p-1 flex items-center rounded-md">
                <div className="flex items-center w-full">
                  <div className="text-gray-500 text-xs w-full">{address}</div>
                </div>
                  <CopyOutlined
                    className="cursor-pointer border p-1 mx-2 rounded-md hover:border-blue-500"
                  />
                </div>
            }
            </Space>
            <Text type="secondary" className="text-xs">
              Please send only <Text strong>Tether TRC-20</Text> to the provided deposit address.
              Sending any other cryptocurrency or asset will result in a loss, as they cannot be recovered.
            </Text>

            <div className='my-2 text-gray-600'> 
              <Text type="warning" className="text-sm">
                {" "}Time left: <Text strong>{formatTime(remainingTime)}</Text> before this session expires
              </Text>              
              </div>
            <Textarea
                value={txid}  
                onChange={(e)=>setTxid(e.target.value)} 
                placeholder='Paste txid here' 
                prefix={<><img className='w-4 h-4' src={usdticon}/></>} 
                suffix="TXID" 
            />
            <Text type='danger' className='text-xs'>{errMsg}</Text>
            <Button 
                onClick={()=>checkPayment()}
                loading={loading.confirmTxid}
                 disabled={txid.length < 20 || remainingTime <= 0}
                className='w-full h-10 my-4 bg-black text-white'
            >
                Confirm
            </Button> 

            <Button 
                onClick={()=>cancelPayment()}
                loading={loading.cancel}
                className='w-full border-none  h-10 '
            >
              Cancel
            </Button> 
            </div></>}
             { showSuccess &&  <Result
              status="success"
              title={`#${deposit.transactionId} You have successfully completed the deposit`}
              subTitle={`${deposit.amount} USDT Deposit added to your wallet`}
              extra={[
                <Button onClick={()=>navigate('/home')} key="buy">Done</Button>,
              ]}
            /> }
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CryptoDeposit
