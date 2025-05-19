import React, { useState, useEffect } from "react";
import {
  Drawer,
  Typography,
  Spin,
  Card,
  Row,
  Col,
  Avatar,
  Empty,
  Statistic,
  Divider,
} from "antd";
import {
  ArrowLeft,
  User,
  DollarSign,
} from "lucide-react";
import { usersGet } from "../../../services/userApi";

const { Text, Title } = Typography;

const ReferralDrawer = ({ open, setOpenDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState([
    {},
    {},
  ]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await usersGet("/referals");
      if (response?.result) {
        setReferrals(response.result);
      }
    } catch (error) {
      console.error("Failed to fetch referrals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchReferrals();
  }, [open]);

  return (
    <Drawer
      closable
      destroyOnClose
      placement="right"
      getContainer={false} // render in parent DOM tree
      size="large sm:default"
      open={open}
      onClose={() => setOpenDrawer(false)}
      closeIcon={<ArrowLeft size={20} />}
      title={<Text strong className="text-base">My Referrals</Text>}
    >
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin tip="Loading referrals..." />
        </div>
      ) : (
        <>
          {/* Stats */}
          <Row gutter={16} className="mb-6">
            <Col span={13}>
              <Card className="h-full" bordered>
                <Statistic
                  title="Total Commission"
                  value={200}
                  prefix={<DollarSign size={16} />}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={11}>
              <Card className="h-full"  bordered>
                <Statistic
                  title="Total Referrals"
                  value={referrals.length}
                  prefix={<User size={16} />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Referral List */}
          {referrals.length > 0 ? (
            <>
              <Title level={5} className="mb-4">Referral List</Title>
              <Row gutter={[8, 8]}>
                {referrals.map((ref, index) => (
                  <Col span={24} key={index}>
                    <Card bodyStyle={{padding : 9}} bordered hoverable>
                      <Row align="middle" justify="space-between">
                        <Col>
                          <div className="flex items-center gap-2">
                            <Avatar size="default">
                              {ref.email?.[0] || "U"}
                            </Avatar>
                            <div>
                              <Text strong>{ref.email || "No email"}</Text>
                              <br />
                              <Text type="secondary" className="text-xs">
                                {ref.phone || "No mobile"}
                              </Text>
                            </div>
                          </div>
                        </Col>
                        <Col>
                          <Statistic
                            title="Commission"
                            value={ref.commission || 0}
                            prefix="$"
                            precision={2}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <div className="flex justify-center mt-10">
              <Empty  description="No referral data" />
            </div>
          )}

          <Text type="secondary" className="block text-center mt-2">
            No more data
          </Text>
        </>
      )}
    </Drawer>
  );
};

export default ReferralDrawer;
