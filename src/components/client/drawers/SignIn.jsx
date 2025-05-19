import React, { useState } from 'react';
import { Drawer, Input, Typography, Space, Button, message } from 'antd';
import { ArrowLeft } from 'lucide-react';
const { Text, Title } = Typography;
import userAxios from './../../../axios/userAxios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUserData } from '../../../redux/ClientSlice';

const App = ({ open, setOpenDrawer }) => {
  const axiosInstance = userAxios();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const createOrLoginUser = async () => {
    setErrMsg('');
    setSuccessMsg('');
    try {
      setLoading(true);
      const response = await axiosInstance.post('/signin', { email, otp });
      if (response?.data?.success) {
        setSuccessMsg(response.data.message || 'Signed in successfully');
        dispatch(setIsAuthenticated())
        dispatch(setUserData(response.data.user))
        navigate('/home')
      } else {
        setErrMsg(response.data.message || 'Something went wrong');
        message.error(response.data.message || 'Error');
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

  const handleSendOtp = () => {
    // Implement your OTP send logic here (e.g., call /send-otp endpoint)
    message.success('OTP sent to your mobile');
  };

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      size="large sm:default"
      getContainer={false} // render in parent DOM tree
      open={open}
      onClose={() => setOpenDrawer()}
      closeIcon={<ArrowLeft size={20} />}
    >
      <Title level={2}>E Value Trade</Title>
      <Text className="my-0 py-0 font-semibold text-xl">Welcome back</Text>
      <br />
      {/* <Text className="my-0 py-0 font-semibold text-xs">
        Just one step to complete sign in
      </Text> */}

      <div className="mt-5">
        {/* <div className="flex flex-col space-y-1 my-2">
          <Text type="secondary">Phone Number</Text>
          <Space.Compact>
            <Input
              className="rounded-lg border-gray-300"
              style={{ width: '20%' }}
              value="+91"
              disabled
            />
            <Input
              className="rounded-lg border-gray-300"
              style={{ width: '80%' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </Space.Compact>
        </div> */}

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
                className="border-none"
                disabled={!phone}
                onClick={handleSendOtp}
                type="link"
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
          disabled={!email || !otp}
        >
          Sign in
        </Button>
      </div>
    </Drawer>
  );
};

export default App;
