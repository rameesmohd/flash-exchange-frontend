import React, { useEffect, useState } from 'react'
import { Button, Flex, Spin, message, Typography, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import usdticon from '../../../public/imageusdt.png'
import { Textarea } from 'flowbite-react';
import { Card, Row, Col } from 'antd';
import QRCode from 'qrcode.react';
import { CopyOutlined } from '@ant-design/icons';
import { usersGet, usersPatch } from '../../services/userApi';
const { Text } = Typography;

const CryptoDeposit = ({deposit}) => {
    const [address,setAddress]=useState("TQm4uJUJn5J2t2u2Q74ZB1J1fPb7yW3gM8")
    const [amount,setAmount]=useState(deposit.amount || 0)
    const [loading, setLoading] = React.useState({
        confirmTxid : false,
        loadAddress  :false
    });
    const [showSuccess,setShowSuccess] = useState(false)
    const [txid,setTxid]=useState("")

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address).then(() => {
        message.success('Address copied to clipboard!');
    }).catch(() => {
        message.error('Failed to copy address.');
    });
    };

    const checkPayment =async()=>{
        try {
           setLoading((prev)=>({...prev,confirmTxid :  true}))
           const response =  await usersPatch('/deposit',{txid,id:deposit._id})
           if(response.success) { 
                message.success(response.message || "Deposit success")
           } else { 
                message.info(response.message || "Deposit not completed")
           }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading((prev)=>({...prev,confirmTxid :  false}))
        }
    }

    const fetchMainAddress=async()=>{
        try {
            setLoading((prev)=>({...prev,loadAddress :  true}))
            const resposne =  await usersGet('/address')
            if(reponse.address) { 
                setAddress(resposne.address)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading((prev)=>({...prev,loadAddress :  false}))
        }
    }

    useEffect(()=>{
        fetchMainAddress()
    },[])

    return (
    <div>
      <Row justify="center" className="my-1">
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card variant='borderless' className="w-full">
            <Flex gap="middle" justify='center' className='my-0' wrap>
              <div className="relative">
                <QRCode 
                level={'H'}
                value={address} 
                size={80}
                />
              </div>
            </Flex>
            <Text strong className="text-lg">{amount} USDT</Text>
            {!showSuccess && <div className="my-1">
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

            <div className='my-2 text-gray-600'>Txid</div>
            <Textarea
                value={txid}  
                onChange={(e)=>setTxid(e.target.value)} 
                placeholder='Paste here' 
                prefix={<><img className='w-4 h-4' src={usdticon}/></>} 
                suffix="TXID" 
            />
      
            <Button 
                onClick={()=>checkPayment()}
                loading={loading.confirmTxid}
                disabled={txid.length < 20} 
                className='w-full h-10 my-4 bg-black text-white'
            >
                Confirm
            </Button> 
            </div>}
            {/* {showSuccess && 
            <PaymentSuccess 
              amount={`${amount} USDT`} 
              type={'deposit'} 
              subMsg={"You have successfully completed the deposit"}
              msg={"Deposit added to your wallet"}
              transaction_id={order.orderTransactionId}/>
            }    */}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CryptoDeposit
