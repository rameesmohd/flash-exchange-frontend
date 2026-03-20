import React, { useEffect, useState } from 'react'
import { Button, Flex, Spin, message, Typography, Space, Result } from 'antd';
import usdticon from '../../../public/imageusdt.png'
import { Input } from 'antd';
import QRCode from 'qrcode.react';
import { CopyOutlined } from '@ant-design/icons';
import { usersDelete, usersPatch } from '../../services/userApi';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;

const CryptoDeposit = ({deposit, onCancel}) => {
    const [address]  = useState(deposit.recieveAddress.address)
    const [amount]   = useState(deposit.amount || 0)
    const [loading, setLoading] = React.useState({
        confirmTxid: false,
        loadAddress: false,
        cancel: false
    });
    const [showSuccess, setShowSuccess] = useState(false)
    const [txid, setTxid] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address).then(() => {
            message.success('Address copied to clipboard!');
        }).catch(() => {
            message.error('Failed to copy address.');
        });
    };

    useEffect(() => { setErrMsg('') }, [txid])

    const checkPayment = async () => {
        try {
            setLoading(prev => ({...prev, confirmTxid: true}))
            const response = await usersPatch('/deposit', {txid, id: deposit._id})
            if (response.success) {
                setShowSuccess(true)
                setErrMsg(response.message || "Deposit success")
            } else {
                setErrMsg(response.message || "Deposit not completed")
            }
        } catch (error) {
            console.log(error);
            setErrMsg(error.response?.data?.message)
        } finally {
            setLoading(prev => ({...prev, confirmTxid: false}))
        }
    }

    const cancelPayment = async () => {
        try {
            setLoading(prev => ({...prev, cancel: true}))
            const response = await usersDelete(`/deposit?id=${deposit._id}`)
            if (response.success) {
                setErrMsg(response?.message)
                onCancel()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(prev => ({...prev, cancel: false}))
        }
    }

    const [remainingTime, setRemainingTime] = useState(0);
    useEffect(() => {
        const updatedAt = new Date(deposit.updatedAt).getTime();
        const expiryTime = updatedAt + 20 * 60 * 1000;

        const updateTimer = () => {
            const now = new Date().getTime();
            const timeLeft = Math.max(expiryTime - now, 0);
            setRemainingTime(timeLeft);
            if (timeLeft <= 0) clearInterval(timerInterval);
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        return () => clearInterval(timerInterval);
    }, [deposit.updatedAt]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        /* ── single full-width container, no Row/Col, no extra Card wrapper ── */
        <div className='border bg-white' style={{ width: '100%', boxSizing: 'border-box', padding: '14px 24px' }}>
            {!showSuccess && (
                <>
                    {/* QR code */}
                    <Flex gap="middle" justify='center' style={{ marginBottom: 12 }}>
                        <QRCode level={'H'} value={address} size={80} />
                    </Flex>

                    <Text strong className="text-lg">{amount} USDT</Text>

                    <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <div className='font-semibold flex'>
                                Awaiting Payment <Spin size='small' style={{ marginLeft: 8, marginTop: 4 }} />
                            </div>
                        </div>

                        {/* address copy */}
                        <Space style={{ marginBottom: 8, width: '100%' }} size="small">
                            {loading.loadAddress ? (
                                <Spin size='small' />
                            ) : (
                                <div
                                    onClick={copyToClipboard}
                                    style={{
                                        // border: '1px solid #e5e7eb',
                                        width: '100%',
                                        padding: '6px 8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <div style={{
                                        color: '#6b7280',
                                        fontSize: 12,
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        minWidth: 0,
                                    }}>
                                        {address}
                                    </div>
                                    <CopyOutlined style={{ flexShrink: 0, marginLeft: 8, padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                                </div>
                            )}
                        </Space>

                        <Text type="secondary" className="text-xs" style={{ display: 'block', marginBottom: 8 }}>
                            Please send only <Text strong>Tether TRC-20</Text> to the provided deposit address.
                            Sending any other cryptocurrency or asset will result in a loss, as they cannot be recovered.
                        </Text>

                        <div style={{ marginBottom: 8 }}>
                            <Text type="warning" className="text-sm">
                                Time left: <Text strong>{formatTime(remainingTime)}</Text> before this session expires
                            </Text>
                        </div>

                        {/* TXID input */}
                        <Input.TextArea
                            value={txid}
                            onChange={e => setTxid(e.target.value)}
                            placeholder='Paste txid here'
                            autoSize={{ minRows: 2, maxRows: 3 }}
                            style={{ width: '100%', marginBottom: 4 }}
                        />

                        <Text type='danger' className='text-xs'>{errMsg}</Text>

                        <Button
                            onClick={checkPayment}
                            loading={loading.confirmTxid}
                            disabled={txid.length < 20 || remainingTime <= 0}
                            style={{ width: '100%', height: 40, marginTop: 12, marginBottom: 8, background: '#000', color: '#fff', border: 'none' }}
                        >
                            Confirm
                        </Button>

                        <Button
                            onClick={cancelPayment}
                            loading={loading.cancel}
                            style={{ width: '100%', height: 40, border: 'none' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}

            {showSuccess && (
                <Result
                    status="success"
                    title={`#${deposit.transactionId} You have successfully completed the deposit`}
                    subTitle={`${deposit.amount} USDT Deposit added to your wallet`}
                    extra={[
                        <Button onClick={() => navigate('/home')} key="done">Done</Button>,
                    ]}
                />
            )}
        </div>
    )
}

export default CryptoDeposit