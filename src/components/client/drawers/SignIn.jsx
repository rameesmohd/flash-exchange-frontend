import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Typography, Button, message } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUserData } from '../../../redux/ClientSlice';
import { usersPatch, usersPost } from '../../../services/userApi';

const { Title, Text } = Typography;

const App = ({ open, setOpenDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpId, setOtpId] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const email = Form.useWatch('email', form);

  const handleSendOtp = async () => {
    setErrMsg('');
    try {
      setSendingOtp(true);
      const response = await usersPatch('/send-otp', { email });
      if (response?.success && response?.otpId) {
        setOtpId(response.otpId);
        message.success('OTP sent successfully');
        setTimer(30);
      } else {
        message.error(response?.message || 'Failed to send OTP');
      }
    } catch (error) {
      setErrMsg(error.response?.data.message || 'Server error');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleFinish = async (values) => {
    setErrMsg('');
    try {
      setLoading(true);
      const response = await usersPost('/signin', {
        email: values.email,
        otp: values.otp,
        otpId,
      });

      if (response?.success) {
        message.success('Signed in successfully');
        dispatch(setIsAuthenticated());
        dispatch(setUserData(response.user));
        setOpenDrawer(false);
        navigate('/home');
      } else {
        setErrMsg(response.message || 'Something went wrong');
      }
    } catch (error) {
      setErrMsg(
        error.response?.data.message ||
          'Unexpected error occurred while signing in.'
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
      getContainer={false}
      open={open}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
    >
      <div className="px-4">
        <Title level={2}>eValueTrade</Title>
        <Text className="block mb-1 text-lg font-medium">Welcome Back</Text>
        <Text type="secondary" className="block mb-6 text-sm">
          Enter your email and OTP to sign in
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="space-y-3"
        >
          <Form.Item
            label="Email"
            name="email"
            className='mb-2'
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input type='' size='large' placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="OTP"
            name="otp"
            rules={[
              { required: true, message: 'Please enter OTP' },
              { len: 6, message: 'OTP must be 6 digits', whitespace: true },
            ]}
          >
            <Input
              size='large'
              placeholder="Enter 6-digit OTP"
              suffix={
                <Button
                  type="link"
                  size="small"
                  onClick={handleSendOtp}
                  loading={sendingOtp}
                  disabled={timer > 0}
                >
                   {timer > 0 ? `Resend in ${timer}s` : 'Send'}
                </Button>
              }
            />
          </Form.Item>

          {errMsg && <Text type="danger">{errMsg}</Text>}

          <Form.Item className="!mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              disabled={!otpId}
              size='large'
              className="bg-black "
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default App;
