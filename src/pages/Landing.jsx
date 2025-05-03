import landingimage from '../../public/landing.png'
import earnBanner from '../../public/earnbanner.png'
import React, { useState } from 'react';
import { Button, Card, Typography, Image } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
import PageWrapper from '../components/client/PageWrapper'


const Home = () => {

  return (
    <PageWrapper>
      <div className="w-full max-w-[375px] mx-auto bg-gray-50 ">
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

        <Button type="primary" block size="large" className="bg-black">
          Signup
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
              <Button type="link" icon={<ArrowRightOutlined />}>
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
    </PageWrapper>
  );
};

export default Home;
