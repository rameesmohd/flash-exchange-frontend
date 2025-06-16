import React from 'react';
import { Drawer, Typography, Divider } from 'antd';
import { ArrowLeft } from 'lucide-react';

const { Text, Title, Paragraph, Link } = Typography;

const HelpCenter = ({ open, setOpenDrawer }) => {
  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      width="100%"
      getContainer={false}
      open={open}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={
        <div className="flex justify-between items-center">
          <Text strong className="text-base">Help Center</Text>
        </div>
      }
    >
      <div className="px-2">
        <Title level={4}>💬 Need Help? <br /> We’re Here for You!</Title>
        <Paragraph>
          Welcome to <Text strong>eValueTrade</Text> — You are our most trusted ally,
          paving the way for a bright and successful future together.
        </Paragraph>

        <Divider />

        <Title level={5}>📌 Support Channels</Title>
        <Paragraph>
          Need assistance or have a question? Our team is always ready to help:
        </Paragraph>

        <Paragraph>
          📱 <Text strong>Telegram Support</Text> (24/7, English) <br />
          Chat directly with our support agents — fast, friendly, and always online. <br />
          👉 <Link href="https://t.me/evaluetradesupport" target="_blank">t.me/evaluetradesupport</Link>
        </Paragraph>

        <Paragraph>
          📢 <Text strong>Telegram Channel</Text> <br />
          Stay updated with live USDT/INR rates, offers, and key announcements. <br />
          👉 <Link href="https://t.me/evaluetrade" target="_blank">t.me/evaluetrade</Link>
        </Paragraph>

        <Divider />

        <Paragraph className='font-semibold'>
          We’re just a message away. Let’s trade smarter, together.
        </Paragraph>
      </div>
    </Drawer>
  );
};

export default HelpCenter;
