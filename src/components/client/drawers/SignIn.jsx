import React, { useState } from 'react';
import { Drawer, Input, Typography, Space, Button, message } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUserData } from '../../../redux/ClientSlice';
import { usersPost } from '../../../services/userApi';

const { Text, Title } = Typography;

const App = ({ open, setOpenDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Send OTP to email
  const handleSendOtp = async () => {
    setErrMsg('');
    try {
      setSendingOtp(true);
      const response = await usersPost('/send-otp', { email });
      if (response?.success && response?.otpId) {
        message.success('OTP sent successfully');
        setOtpId(response.otpId);
      } else {
        message.error(response?.message || 'Failed to send OTP');
      }
    } catch (error) {
      message.error(error.response?.message || 'Server error');
    } finally {
      setSendingOtp(false);
    }
  };

  const createOrLoginUser = async () => {
    setErrMsg('');
    setSuccessMsg('');
    try {
      setLoading(true);

      const response = await usersPost('/signin', {
        email,
        otpId,
        otp,
      });

      if (response?.success) {
        message.success('Signed in successfully');
        dispatch(setIsAuthenticated());
        dispatch(setUserData(response.user));
        navigate('/home');
        setOpenDrawer(false);
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
      size="large sm:default"
      getContainer={false}
      open={open}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
    >
      <Title level={2}>E Value Trade</Title>
      <Text className="my-0 py-0 font-semibold text-xl">Welcome back</Text>

      <div className="mt-5">
        <div className="flex flex-col space-y-1 my-2">
          <Text type="secondary">Email</Text>
          <Input
            placeholder="Enter Email"
            className="rounded-lg border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-1 my-2">
          <Text type="secondary">OTP</Text>
          <Input
            placeholder="Enter OTP"
            className="rounded-lg border-gray-300"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            suffix={
              <Button
                type="link"
                disabled={!email || sendingOtp}
                onClick={handleSendOtp}
                loading={sendingOtp}
              >
                Send
              </Button>
            }
          />
        </div>

        {errMsg && <Text type="danger" className="block mt-2">{errMsg}</Text>}
        {successMsg && <Text type="success" className="block mt-2">{successMsg}</Text>}

        <Button
          className="w-full my-3 h-10 bg-black"
          type="primary"
          loading={loading}
          onClick={createOrLoginUser}
          disabled={!email || !otp || !otpId}
        >
          Sign in
        </Button>
      </div>
    </Drawer>
  );
};

export default App;
