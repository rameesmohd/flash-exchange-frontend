import React, { useEffect, useState } from 'react';
import { Card, Button, Layout,Typography, Input, Divider, Spin, Select, Alert } from 'antd';
import { CgArrowsExchangeAlt } from 'react-icons/cg';
import { QuestionCircleOutlined, BookOutlined } from '@ant-design/icons';
const {Text,Title} = Typography
const { Header, Content } = Layout;
import imgUsdt from '../../public/tether-usdt-logo.png';
import rupeesIcon from '../../public/gold-coin-rupee-icon.svg';
import binanceIcon from '../../public/binance-icon-512x512-yslglaeq.png';
import PageWrapper from '../components/client/PageWrapper'
import { useDispatch, useSelector } from 'react-redux';
import {usersGet, usersPost} from '../services/userApi'
import { NotebookIcon } from 'lucide-react';
import ExchangeHistory from '../components/client/drawers/ExchangeHistory'
import BankCard from '../components/client/drawers/BankCard'
import { setFund, setUserData } from '../redux/ClientSlice';
import { formatDate } from '../services/formatData';
import { closePinModal, openPinModal } from '../redux/PinModalSlice';
import TransactionPinModal from '../components/client/TransactionPinModal';

const Exchange = () => {
  const user = useSelector((state)=>state.User.userData)
  const { isOpen } = useSelector((state) => state.PinModal);
  const {selectedBankCard,selectedFund} = useSelector((state)=>state.User)
  const dispatch=useDispatch()
  
  const [allFunds,setAllFunds]=useState([])
  
  const [error,setError]=useState('')
  const [loading,setLoading]=useState({
    rate : true,
    submit : false
  })
  const [inputs,setInputs]=useState({
    usdt : '',
    fiat : ''
  })
  const [exchangeHistory,setShowExchangeHistory]=useState(false)
  const [otherExchangeRate,setOtherExchangeRate]=useState([])
  const [openBankCard,setOpenBankCard]=useState({
    open :false,
    confirm : false
  })  
  
  useEffect(()=>{
    if(!selectedFund){
      dispatch(setFund(allFunds[0]))
    }
    setInputs({
      usdt : '',
      fiat : ''
    })
  },[allFunds,selectedFund])

  useEffect(()=>{
    setError("")
  },[inputs])

  const fetchRate = async()=>{
    try {
      setLoading((prev)=>({...prev,rate: true}))
      const response = await usersGet('/fund')
      if(response.success && response.funds){
        const options =  response.funds.map((fund) => ({
          value: fund._id,
          label: `${fund.type}: ₹${fund.rate}/USDT`,
          rate : fund.rate,
          _id: fund._id,
          status : fund.status,
          message : fund.message || ""
        }));
        setAllFunds(options)
        setOtherExchangeRate(response.otherExchangeRates)
      }
    } catch (error) {
      console.log(error);
    } finally  {
      setLoading((prev)=>({...prev,rate: false}))
    }
  }

  const handleSubmitOrder=async(pin)=>{
        if(Number(inputs.usdt) < 10, Number(inputs.fiat) < 10){
          return setError("Invalid values")
        }
      try {
        setLoading((prev)=>({...prev,submit :true}))
        const response = await usersPost('/order',{
          usdt:inputs.usdt,
          fiat:inputs.fiat,
          fund : selectedFund,
          bankCard:selectedBankCard,
          pin
        })
        if(response.success){
          dispatch(setUserData(response.user))
          setShowExchangeHistory(true)
        }
      } catch (error) {
        console.log(error);
        if(error.response.data.message){
          setError(error.response.data.message)
        }
      } finally {
        setLoading((prev)=>({...prev,submit :false}))
      }
  } 

  useEffect(()=>{
    fetchRate()
  },[])

  useEffect(()=>{
    setError('')
    setOpenBankCard((prev)=>({...prev,confirm : false}))
  },[inputs])

  return (
    <PageWrapper>
    <Layout className="bg-gray-50">
    {/* Header */}
    <Header className="bg-white shadow-md px-4 flex justify-between items-center">
      <Title level={4} className="!mb-0">Flash Exchange</Title>
      <div className="flex items-center gap-3">
          <NotebookIcon onClick={()=>setShowExchangeHistory(true)} size={22} />
      </div>
    </Header>

    {/* Content */}
    <Content className="p-4 space-y-1">
    {/* {loading.rate && <Spin fullscreen/>} */}
    {/* Crypto Balance */}
    <Card size="small" className="rounded-md">
      <div className="flex justify-between text-xs text-gray-500 my-2">
        <span>Crypto</span>
        <span>Available: {user?.availableBalance || 0} USDT</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={imgUsdt} alt="USDT" className="h-7 w-7" />
          <span className="ml-2 font-medium">USDT</span>
        </div>
        <div className="text-right">
          <div>
          <Input
            type=""
            size="small"
            className="w-24 border-none text-right text-gray-700 font-semibold text-lg hover:shadow-none placeholder:text-gray-700 placeholder:font-semibold placeholder:text-lg"
            value={inputs.usdt}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || isNaN(value)) {
                setInputs({ usdt: '', fiat: '' });
              } else {
                // console.log(value ,'value');
                setInputs({
                  usdt: value,
                  fiat: (parseFloat(value) * selectedFund.rate).toFixed(2)
                });
              }
            }}
            onBlur={() => {
              // Format to 2 decimals when user finishes typing
              if(inputs.usdt>0)
                setInputs(prev => ({ ...prev, usdt: Number(prev.usdt).toFixed(2) }));
            }}
            placeholder="0.00"
          />
  
          </div>
          {/* <div className="font-semibold text-gray-700 text-lg">0.00</div> */}
                {/* <Text type="secondary" className="text-xs cursor-pointer text-blue-500">Deposit</Text> */}
        </div>
      </div>
    </Card>


    {/* Exchange Icon */}
    <div className="flex justify-center relative z-10">
      <div className="absolute -top-5 rounded-full bg-white shadow-md w-10 h-10 flex justify-center items-center">
        <CgArrowsExchangeAlt size={20} />
      </div>
    </div>

    {/* Fiat */}
    <Card size="small" className="rounded-md items-center">
      <div className="flex mt-2 justify-between items-center text-xs text-gray-500 mb-2">
        <span>Fiat Currency</span>
        <span>  
      <Select
        loading={loading.rate} 
        options={allFunds}
        value={selectedFund ? selectedFund.label : ""}
        onChange={(value) => {
          const fund = allFunds.find(f => f.value === value);
          dispatch(setFund({
            value: fund.value,
            rate: fund.rate,
            _id: fund._id,
            status: fund.status,
            label: fund.label,
            message : fund?.message
          }));
        }}
      /> </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={rupeesIcon} alt="INR" className="h-7 w-7" />
          <span className="ml-2 font-medium">INR</span>
        </div>
        <Input
          type=""
          size="small"
          className="w-24 border-none text-right text-gray-700 font-semibold text-lg hover:shadow-none placeholder:text-gray-700 placeholder:font-semibold placeholder:text-lg"
          placeholder="0.00"
          value={inputs.fiat}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || isNaN(value )) {
              setInputs({ fiat: '', usdt: '' });
            } else {
              setInputs({
                fiat: value,
                usdt: (parseFloat(value) / selectedFund.rate).toFixed(2)
              });
            }
          }}
          onBlur={() => {
            setInputs(prev => ({ ...prev, fiat: Number(prev.fiat).toFixed(2) }));
          }}
        />
      </div>
    </Card>
    { 
      selectedFund?.message && <Alert
        style={{paddingLeft : 12,paddingRight : 12 ,paddingTop : 6,paddingBottom :6}}
        // message="Informational Notes"
        description={
          <>
          <span className='font-semibold'>
              Accepted Bank Cards : UPI, Bank Account
          </span>
          <br />
          {selectedFund?.message}  
          </>
        }
        type="info"
      /> 
    }
    <Text type='danger' className='text-xs'>{error}</Text>
    {/* Sell Button */}
    { 
    !openBankCard.confirm ? 
    <Button loading={loading.rate} onClick={()=>setOpenBankCard((prev)=>({...prev,open : true}))} type="primary" style={{marginTop : 5}} className="bg-black w-full text-white rounded-md" size="large">
      SELL USDT
    </Button>: 
    <>
    <Button loading={loading.submit} 
    // onClick={()=>handleSubmitOrder()} 
    onClick={() => dispatch(openPinModal())}
    type="primary" style={{marginTop : 5}} className="bg-black w-full text-white rounded-md" size="large">
      Confirm
    </Button>
    <Button onClick={()=>setOpenBankCard((prev)=>({...prev,open : true}))} type="default" style={{marginTop : 5}} className="w-full rounded-md" size="large">
      Change Bank Card
    </Button>
    </> 
    }

    {/* Exchange Prices */}
    <div>
      <Title level={5} className="text-gray-700 mt-3">Exchange Price</Title>
      {[{
        name: 'Binance',
        price: otherExchangeRate[0]?.binance,
        lastUpdate : otherExchangeRate[0]?.lastUpdated,
        icon: binanceIcon
      }, 
    ].map(({ name, price,lastUpdate, icon }) => (
        <Card key={name} size="small" className="rounded-md mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center font-medium text-gray-700">
              <img src={icon} alt={name} className="w-5 h-5 mr-2" />
              {name}
            </div>
            <span className="text-xs text-gray-400">Updated:{lastUpdate ? formatDate(lastUpdate) :''}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div>Avg <span className="text-xl font-bold">{price}</span> ₹</div>
            <div>1 USDT = ₹{price}</div>
          </div>
        </Card>
      ))}
    </div>
    </Content>
    </Layout>
    <ExchangeHistory 
      open={exchangeHistory} 
      setOpenDrawer={()=>setShowExchangeHistory(false)}
    /> 
    <BankCard 
      open={openBankCard.open} 
      setOpenDrawer={()=>setOpenBankCard((prev)=>({...prev,open : false ,confirm : true}))}
    />
    <TransactionPinModal
      key={isOpen ? 'open' : 'closed'}
      open={isOpen}
      onClose={() => dispatch(closePinModal())}
      onSubmit={(pin) => {
        // console.log("PIN received in parent onSubmit:", pin);
        handleSubmitOrder(pin);
        dispatch(closePinModal());
      }}
    />
    </PageWrapper>
  );
};

export default Exchange;
