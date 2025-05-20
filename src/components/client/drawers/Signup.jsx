import React, { useState, useEffect } from 'react';
import { Drawer, Input, Typography, Space, Button, message } from 'antd';
import { ArrowLeft } from 'lucide-react';
const { Text, Title } = Typography;
import userAxios from './../../../axios/userAxios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUserData } from '../../../redux/ClientSlice';
import { usersPost } from '../../../services/userApi';

const App = ({ open, setOpenDrawer }) => {
  const axiosInstance = userAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [inviterCode, setInviterCode] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [timer, setTimer] = useState(0); // countdown state

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^\d{10}$/.test(phone);

  const validateFields = () => {
    const errors = {};
    if (!validatePhone(phone)) {
      errors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!validateEmail(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!otp || otp.length < 4) {
      errors.otp = 'Enter a valid OTP';
    }
    return errors;
  };

  const createOrLoginUser = async () => {
    setErrMsg('');
    setSuccessMsg('');
    const errors = validateFields();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    try {
      setLoading(true);
      const response = await usersPost('/signup', {
        phone,
        email,
        otp,
        otpId,
        referralCode: inviterCode,
      });
      if (response?.success) {
        setSuccessMsg(response.message || 'Signed in successfully');
        dispatch(setIsAuthenticated());
        dispatch(setUserData(response.user));
        navigate('/home');
      } else {
        setErrMsg(response.message || 'Something went wrong');
        message.error(response.message || 'Error');
      }
    } catch (error) {
      if (error.response) {
        setErrMsg(error.response.data.message || 'Server Error');
      } else if (error.request) {
        setErrMsg('No response from server. Please check your connection.');
      } else {
        setErrMsg('Unexpected error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Enter a valid email to receive OTP' }));
      return;
    }
    try {
      const response = await usersPost('/send-otp', { email });
      if(response.success){
        setOtpId(response.otpId)
        message.success('OTP sent to your email');
        setTimer(30); // Start countdown
      }
    } catch {
      message.error('Failed to send OTP. Try again.');
    }
  };

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      size="large sm:default"
      getContainer={false}
      open={open}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
    >
      <Title level={2}>E Value Trade</Title>
      <Text className="my-0 py-0 font-semibold text-xl">Welcome back</Text>
      <br />
      <Text className="my-0 py-0 font-semibold text-xs">
        Just one step to complete sign in
      </Text>

      <div className="mt-5">
        {/* Phone Number */}
        <div className="flex flex-col space-y-1 my-2">
          <Text className="text-gray-600">Phone Number *</Text>
          <Space.Compact>
            <Input
              className="rounded-lg border-gray-300"
              style={{ width: '20%' }}
              value="+91"
              disabled
            />
            <Input
              type="tel"
              className="rounded-lg border-gray-300"
              style={{ width: '80%' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </Space.Compact>
          {fieldErrors.phone && <Text type="danger">{fieldErrors.phone}</Text>}
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-1 my-2">
          <Text className="text-gray-600">Email *</Text>
          <Input
            type="email"
            placeholder="Enter Email"
            className="rounded-lg border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <Text type="danger">{fieldErrors.email}</Text>}
        </div>

        {/* OTP */}
        <div className="flex flex-col space-y-1 my-2">
          <Text className="text-gray-600">OTP *</Text>
          <Input
            placeholder="Enter OTP"
            className="rounded-lg border-gray-300"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            suffix={
              <Button
                disabled={timer > 0 || !validateEmail(email)}
                onClick={handleSendOtp}
                type="link"
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Send'}
              </Button>
            }
          />
          {fieldErrors.otp && <Text type="danger">{fieldErrors.otp}</Text>}
        </div>

        {/* Referral Code */}
        <div className="flex flex-col space-y-1 my-3">
          <label className="text-sm text-gray-700">Referral Code (Optional)</label>
          <Input
            placeholder="Enter referral code"
            className="rounded-lg border border-gray-300 focus:ring-2 transition duration-200"
            value={inviterCode}
            onChange={(e) => setInviterCode(e.target.value)}
          />
        </div>

        {errMsg && <Text type="danger" className="block mt-2">{errMsg}</Text>}
        {successMsg && <Text type="success" className="block mt-2">{successMsg}</Text>}

        <Button
          className="w-full my-3 h-10 bg-black"
          type="primary"
          loading={loading}
          onClick={createOrLoginUser}
          disabled={loading}
        >
          Sign up
        </Button>
      </div>
    </Drawer>
  );
};

export default App;
