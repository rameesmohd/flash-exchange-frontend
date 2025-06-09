import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Card, Row, Col, Tag } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { usersGet } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import EmptyBox from '../common/EmptyBox';

const { Text } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case 'pending':
      return <Tag color="orange">Pending</Tag>;
    case 'completed':
      return <Tag color="green">Completed</Tag>;
    case 'failed':
      return <Tag color="red">Failed</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const formatTimeLeft = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}h ${m
    .toString()
    .padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
};

const App = ({ open, setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await usersGet('/order');
      if (response.success) {
        setOrders(response.orders);
        // initialize timers
        const timers = {};
        response.orders.forEach((order) => {
          const maxTime = order?.fund?.maxFulfillmentTime
          const expiry = new Date(order.createdAt).getTime() + (maxTime?maxTime:3) * 60 * 60 * 1000; // 1 hour
          timers[order._id] = Math.max(expiry - Date.now(), 0);
        });
        setRemainingTimes(timers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTimes((prev) => {
        const updated = {};
        for (const id in prev) {
          updated[id] = Math.max(prev[id] - 1000, 0);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      width="100%"
      loading={loading}
      getContainer={false}
      open={open}
      onClose={setOpenDrawer}
      closeIcon={<ArrowLeft size={20} />}
      title={<Text strong className="text-base">Exchange History</Text>}
    >
      {orders.length ? (
        orders.map((value, index) => (
          <Card key={index} bordered className="shadow-md my-2">
            <Row gutter={[8, 4]}>
              <Col span={10}>
                <Text className="text-xs" strong>ID:</Text>{' '}
                <Text className="text-xs" copyable>
                  {value.orderId}
                </Text>
                <br />
                <Text className="text-xs" strong>INR:</Text>{' '}
                <Text className="text-xs">₹{value.fiat}</Text>
                <br />
                <Text className="text-xs" strong>Amount:</Text>{' '}
                <Text className="text-base" strong>
                  ${value.usdt}
                </Text>
              </Col>
              <Col span={14}>
                <Text className="text-xs" strong>Status:</Text>{' '}
                {getStatusTag(value.status)}
                <br />
                {value.status === 'pending' && remainingTimes[value._id] > 0 && (
                  <Text className="text-xs text-red-500">
                    ⏳ {formatTimeLeft(remainingTimes[value._id])} left
                  </Text>
                )}
                <div className="justify-end items-end mt-1">
                  <Text type="secondary " style={{ fontSize: 10 }}>
                    Created: {formatDate(value.createdAt)}
                  </Text>
                </div>
              </Col>

              <div className="rounded-md shadow-sm border w-full p-2 flex flex-row justify-between">
              {/* Bank Details */}
              {value.bankCard.mode == "bank" && <div>
                <Text className="text-xs mb-1 block text-gray-500" strong>
                  Bank Details:
                </Text>
                <Text className="text-xs block text-gray-700">
                  <strong>Account:</strong> {value.bankCard.accountNumber} <br />
                  <strong>IFSC:</strong> {value.bankCard.ifsc} <br />
                  <strong>Name:</strong> {value.bankCard.accountName}
                </Text>
              </div>}
              {value.bankCard.mode == "upi" && <div>
                <Text className="text-xs mb-1 block text-gray-500" strong>
                  Bank Details:
                </Text>
                <Text className="text-xs block text-gray-700">
                  <strong>UPI:</strong> {value.bankCard.upi} <br />
                </Text>
              </div>}

              {/* Fund Details */}
              <div>
                <Text className="text-xs mb-1 block text-gray-500" strong>
                  Fund Info:
                </Text>
                <Text className="text-xs block text-gray-700 capitalize">
                  <strong>Type:</strong> {value.fund.type} <br />
                  <strong>Rate:</strong> ₹{value.fund.rate} <br />
                  <strong>Status:</strong> {value.fund.status}
                </Text>
              </div>
              </div>

            </Row>
          </Card>
        ))
      ) : (
        <EmptyBox />
      )}
    </Drawer>
  );
};

export default App;
