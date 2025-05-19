import landingimage from '../../public/landing.png'
import earnBanner from '../../public/earnbanner.png'
import React, { useState } from 'react';
import { Button, Card, Typography, Image } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Signup from '../components/client/drawers/Signup'
import SignIn from '../components/client/drawers/SignIn'
import PageWrapper from '../components/client/PageWrapper'
const { Title, Text } = Typography;

const Home = () => {
  const [openDrawer,setopenDrawer]=useState({
    signin  :false,
    signup : false
  })

  return (
  <PageWrapper>
    <div className="w-full mx-auto bg-gray-50 ">
    {/* Header Image */}
    <Image
      src={landingimage}
      preview={false}
      width="100%"
      height={200}
      style={{ objectFit: 'cover' }}
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
            <Text className="block text-base p-1 text-gray-700">
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
      </div>
    </div>
    <Signup open={openDrawer.signup} setOpenDrawer={()=>setopenDrawer((prev=>({...prev,signup : false})))}/> 
    <SignIn open={openDrawer.signin} setOpenDrawer={()=>setopenDrawer((prev=>({...prev,signin : false})))}/> 
  </PageWrapper>
  );
};

export default Home;
