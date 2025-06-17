import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Input,
  Typography,
  Space,
  Button,
  message,
  Form,
} from 'antd';
import { ArrowLeft } from 'lucide-react';
import userAxios from './../../../axios/userAxios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUserData } from '../../../redux/ClientSlice';
import { usersPost } from '../../../services/userApi';

const { Title, Text } = Typography;

const App = ({ open, setOpenDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    const email = form.getFieldValue('email');
    if (!validateEmail(email)) {
      form.setFields([{ name: 'email', errors: ['Enter a valid email to receive OTP'] }]);
      return;
    }
    try {
      setLoadingOtp(true);
      const response = await usersPost('/send-otp', { email });
      if (response.success) {
        setOtpId(response.otpId);
        message.success('OTP sent to your email');
        setTimer(30);
      }
    } catch (error) {
      message.error(error.response?.data.message || 'Failed to send OTP');
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = { ...values, otpId };
      const response = await usersPost('/signup', payload);
      if (response?.success) {
        message.success(response.message || 'Signed in successfully');
        dispatch(setIsAuthenticated());
        dispatch(setUserData(response.user));
        navigate('/home');
      } else {
        message.error(response.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(
        error.response?.data.message ||
          (error.request ? 'Server not responding' : 'Unexpected error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      width="100%"
      className='px-4'
      getContainer={false}
      open={open}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
    >
      <Title level={2}>eValueTrade</Title>
      <Text className="font-semibold text-xl">Welcome Back</Text>
      <br />
      <Text className="text-xs font-semibold">Just one step to complete sign in</Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-5"
        autoComplete="off"
      >
        <Form.Item className="mb-3" label="Phone Number" name="phone" rules={[{ required: true, pattern: /^\d{10}$/, message: 'Enter a valid 10-digit phone number' }]}> 
          <Space.Compact className='w-full'>
            <Input type='' size='middle' disabled value="+91" style={{ width: '20%' }} />
            <Input type='' style={{ width: '80%' }} placeholder="Enter phone number" />
          </Space.Compact>
        </Form.Item>

        <Form.Item className="mb-3" label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email address' }]}> 
          <Input type='' size='large' placeholder="Enter Email" />
        </Form.Item>

        <Form.Item className="mb-3" label="OTP" name="otp" rules={[{ required: true, message: 'Enter the OTP' }]}> 
          <Input
            placeholder="Enter OTP"
            suffix={
              <Button
                type="link"
                onClick={handleSendOtp}
                disabled={timer > 0}
                loading={loadingOtp}
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Send'}
              </Button>
            }
          />
        </Form.Item>

        <Form.Item
          className="mb-3"
          label="Transaction PIN"
          name="transactionPin"
          rules={[{ required: true, message: 'Enter your 6-digit PIN' }]}
        >
          <Input.Password
            type=''
            size='large'
            maxLength={6}
            placeholder="Enter 6-digit PIN"
            onChange={(e) => {
              const val = e.target.value;
              if (!/^\d*$/.test(val)) return;
              form.setFieldsValue({ transactionPin: val });
            }}
          />
        </Form.Item>

        <Form.Item className="mb-3" label="Referral Code (Optional)" name="referralCode">
          <Input type='' size='large' placeholder="Enter referral code" />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={loading}
            className="h-10 bg-black mt-1"
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default App;