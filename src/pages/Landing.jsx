import landingimage from '../../public/landing.png'
import earnBanner from '../../public/earnbanner.png'
import React, { useState } from 'react';
import { Button, Card, Typography, Image } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Signup from '../components/client/drawers/Signup'
import SignIn from '../components/client/drawers/SignIn'
import PageWrapper from '../components/client/PageWrapper'
import crypto3dImg from '../../public/set-of-internet-virtual-cryptocurrency-icons-3d-bitcoin-3d-tether-3d-etherium-illustration-free-vector.jpg'
const { Title, Text } = Typography;

const Landing = ({home}) => {
  const [openDrawer,setopenDrawer]=useState({
    signin  :false,
    signup : false
  })

  return (
  <PageWrapper>
    {home ? 
    <div className="w-full mx-auto bg-white h-full">
    {/* Header Image */}
    <Image
      src={"https://static.vecteezy.com/system/resources/previews/003/321/388/non_2x/tether-or-usdt-crypto-currency-themed-banner-vector.jpg"}
      preview={false}
      width="100%"
      height={200}
      style={{ objectFit: 'cover' }}
      alt={landingimage}
    />

    <div className="p-4">
      {/* Welcome Section */}
      <Title level={4} className="!mb-4 !text-gray-800 ">
        Welcome to <span className="text-black font-semibold">E Value Trade</span>
      </Title>

      <Button onClick={()=>setopenDrawer((prev=>({...prev,signin : true})))} type="" block size="large" className="text-black">
        Login
      </Button>

      <Button onClick={()=>setopenDrawer((prev=>({...prev,signup : true})))} type="primary" block size="large" className="bg-black mt-3">
        Create an account
      </Button>

      {/* Earnings Card */}
      <Card
        className="rounded-xl my-6"
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="">
            <Text className="block text-base font-semibold p-1 text-gray-700">
              The average user can earn up to ₹1 Lakh
            </Text>
            <Button onClick={()=>setopenDrawer(true)} type="link" icon={<ArrowRightOutlined />}>
              Get Started
            </Button>
          </div>
          <Image
            src={earnBanner}
            preview={false}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
      </Card>

      <Card
        className="rounded-xl my-6"
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <Text className="block text-base font-semibold px-1 text-gray-700">
              Why choose us?
            </Text>
            <Text className="block px-1 pt-1 text-sm text-gray-600">
              Our platform makes it fast and easy <br /> to sell USDT for INR, with secure payouts, competitive rates.
            </Text>
          </div>
          <Image
            src={"https://static.vecteezy.com/system/resources/previews/013/391/065/large_2x/bitcoin-3d-illustration-free-png.png"}
            preview={false}
            width={120}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
      </Card>
      </div>
    </div> : 
    <div className="w-full h-full flex px-4 pt-32 justify-center mx-auto bg-white ">
      <div className='text-center'>
        <img src={crypto3dImg} alt="" />
        <Title level={4}>Welcome to E Value Trade</Title>
        <Text className='text-xs'>You are our most trusted ally, paving the way for a bright and successful <br /> future together.</Text>
        <Button onClick={()=>setopenDrawer((prev=>({...prev,signin : true})))} type="" block size="large" className="text-black mt-5">
          Login
        </Button>
        <Button onClick={()=>setopenDrawer((prev=>({...prev,signup : true})))} type="primary" block size="large" className="bg-black mt-3">
          Create an account
        </Button>
      </div>
    </div>
    }
    <Signup open={openDrawer.signup} setOpenDrawer={()=>setopenDrawer((prev=>({...prev,signup : false})))}/> 
    <SignIn open={openDrawer.signin} setOpenDrawer={()=>setopenDrawer((prev=>({...prev,signin : false})))}/> 
  </PageWrapper>
  );
};

export default Landing;
