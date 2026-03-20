import React, { useState, useEffect } from 'react';
import { Button, Drawer, Input, Typography, Modal, Radio, Form } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
import { ArrowLeft, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
const { Text } = Typography;
import { usersDelete, usersGet, usersPost } from '../../../services/userApi';
import { formatDate } from '../../../services/formatData';
import { useDispatch, useSelector } from 'react-redux';
import { setBankCardSelected } from '../../../redux/ClientSlice';
import EmptyBox from '../common/EmptyBox';

const STYLES = `
  /* ── card list ── */
  .bc-list { display:flex; flex-direction:column; gap:0; }

  .bc-row {
    display:flex; align-items:center;
    padding:13px 16px;
    border-bottom:1px solid #f1f5f9;
    cursor:pointer;
    transition:background .12s;
    position:relative;
    gap:12px;
  }
  .bc-row:last-child { border-bottom:none; }
  .bc-row:active { background:#f8fafc; }
  .bc-row.selected { background:#f0f7ff; }

  /* left indicator bar for selected */
  .bc-row.selected::before {
    content:'';
    position:absolute; left:0; top:0; bottom:0;
    width:3px; background:#0d1f3c; border-radius:0 2px 2px 0;
  }

  .bc-icon-wrap {
    width:40px; height:40px; border-radius:12px;
    background:#f4f6fb; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; color:#374151;
  }
  .bc-icon-wrap.selected { background:#0d1f3c; color:#fff; }

  .bc-center { flex:1; min-width:0; }
  .bc-title {
    font-size:13px; font-weight:600; color:#0f172a;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .bc-sub {
    font-size:11px; color:#94a3b8; margin-top:2px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .bc-date { font-size:10px; color:#cbd5e1; margin-top:1px; }

  .bc-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .bc-del-btn {
    width:30px; height:30px; border-radius:8px;
    border:none; background:#fef2f2; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .12s;
  }
  .bc-del-btn:hover { background:#fee2e2; }

  /* ── add form ── */
  .bc-form-wrap { padding:4px 0; }
  .bc-mode-toggle {
    display:grid; grid-template-columns:1fr 1fr;
    gap:8px; margin-bottom:20px;
  }
  .bc-mode-btn {
    padding:10px; border-radius:10px; border:1.5px solid #e5e8ef;
    background:#fff; font-size:13px; font-weight:600;
    color:#94a3b8; cursor:pointer; transition:all .15s;
    text-align:center;
  }
  .bc-mode-btn.active {
    border-color:#0d1f3c; background:#0d1f3c; color:#fff;
  }
  .bc-field-label {
    font-size:11px; font-weight:600; color:#64748b;
    letter-spacing:.5px; text-transform:uppercase;
    margin-bottom:5px;
  }
  .bc-field-wrap { margin-bottom:14px; }
  .bc-submit {
    width:100%; padding:13px; border-radius:12px;
    background:#0d1f3c; color:#fff; border:none;
    font-size:14px; font-weight:700; cursor:pointer;
    margin-top:6px; transition:background .15s;
  }
  .bc-submit:hover { background:#1e3a5f; }
  .bc-submit:disabled { opacity:.5; cursor:not-allowed; }
`;

const App = ({ open, setOpenDrawer, filterMode = null, getContainer }) => {
  const [loading,      setLoading]      = useState(false);
  const [delLoading,   setDelLoading]   = useState(false);
  const [showAdd,      setShowAdd]      = useState(false);
  const [bankCards,    setBankCards]    = useState([]);
  const [mode,         setMode]         = useState('bank');
  const [error,        setError]        = useState('');
  const [form]                          = Form.useForm();
  const dispatch = useDispatch();
  const { selectedBankCard } = useSelector((s) => s.User);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await usersGet(`/bank-card?mode=${filterMode}`);
      if (res.success) setBankCards(res.bankCards);
    } catch(e) { console.log(e); }
    finally { setLoading(false); }
  };

  const deleteCard = async (id) => {
    try {
      setDelLoading(true);
      const res = await usersDelete(`/bank-card?id=${id}`);
      if (res.success) setBankCards(res.bankCards);
    } catch(e) { console.log(e); }
    finally { setDelLoading(false); }
  };

  const handleSelect = (card) => {
    dispatch(setBankCardSelected(card));
    setOpenDrawer();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const res = await usersPost('/bank-card', values);
      if (res.success) { form.resetFields(); setShowAdd(false); }
    } catch(e) {
      console.log(e);
      if (e?.response?.data?.message) setError(e.response.data.message);
    } finally { setLoading(false); }
  };

  const confirmDelete = (id) => confirm({
    title: 'Delete this card?',
    icon: <ExclamationCircleFilled />,
    content: 'This cannot be undone.',
    okText: 'Delete', okType: 'danger', cancelText: 'Cancel',
    onOk: () => deleteCard(id),
  });

  useEffect(() => {
    if (open && !showAdd) fetchCards();
    if (open) { setMode('bank'); form.resetFields(); }
    setError('');
  }, [open, showAdd]);

  return (
    <>
      <style>{STYLES}</style>
      <Drawer
        closable
        destroyOnClose
        placement="right"
        width="100%"
        getContainer={getContainer || false}
        open={open}
        loading={loading}
        onClose={setOpenDrawer}
        closeIcon={<ArrowLeft size={20} />}
        title={
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <Text strong style={{ fontSize:15 }}>
              {showAdd ? 'Add Card' : 'Bank Cards'}
            </Text>
            {!showAdd ? (
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  width:32, height:32, borderRadius:9,
                  background:'#f4f6fb', border:'none', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >
                <Plus size={17} color="#374151" />
              </button>
            ) : (
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  padding:'4px 12px', borderRadius:8, border:'none',
                  background:'#f4f6fb', fontSize:12, fontWeight:600,
                  color:'#374151', cursor:'pointer',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        }
      >
        {!showAdd ? (
          /* ── Card list ── */
          bankCards.length ? (
            <div style={{ background:'#fff', borderRadius:14, border:'0.5px solid #e5e8ef', overflow:'hidden' }}>
              <div className="bc-list">
                {bankCards.map((card) => {
                  const isSelected = selectedBankCard?._id === card._id;
                  return (
                    <div
                      key={card._id}
                      className={`bc-row${isSelected ? ' selected' : ''}`}
                      onClick={() => handleSelect(card)}
                    >
                      {/* icon */}
                      <div className={`bc-icon-wrap${isSelected ? ' selected' : ''}`}>
                        {card.mode === 'upi' ? 'UPI' : 'BNK'}
                      </div>

                      {/* details */}
                      <div className="bc-center">
                        {card.mode === 'bank' ? (
                          <>
                            <div className="bc-title">{card.accountName}</div>
                            <div className="bc-sub">
                              {card.accountNumber} &nbsp;·&nbsp; {card.ifsc}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bc-title">{card.accountName || 'N/A'}</div>
                            <div className="bc-sub">{card.upi || 'N/A'}</div>
                          </>
                        )}
                        <div className="bc-date">
                          Added {card.createdAt ? formatDate(card.createdAt) : ''}
                        </div>
                      </div>

                      {/* right — check or delete */}
                      <div className="bc-right">
                        {isSelected ? (
                          <CheckCircle2 size={18} color="#0d1f3c" />
                        ) : (
                          <button
                            className="bc-del-btn"
                            disabled={delLoading}
                            onClick={(e) => { e.stopPropagation(); confirmDelete(card._id); }}
                          >
                            <Trash2 size={13} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : <EmptyBox />
        ) : (
          /* ── Add form ── */
          <div className="bc-form-wrap">
            {/* mode toggle */}
            <div className="bc-mode-toggle">
              <button
                type="button"
                className={`bc-mode-btn${mode === 'bank' ? ' active' : ''}`}
                onClick={() => { setMode('bank'); form.resetFields(); form.setFieldsValue({ mode: 'bank' }); }}
              >
                Bank Account
              </button>
              <button
                type="button"
                className={`bc-mode-btn${mode === 'upi' ? ' active' : ''}`}
                onClick={() => { setMode('upi'); form.resetFields(); form.setFieldsValue({ mode: 'upi' }); }}
              >
                UPI
              </button>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{ mode }}
            >
              <Form.Item name="mode" initialValue={mode} hidden>
                <Input />
              </Form.Item>

              {mode === 'bank' && (
                <>
                  <div className="bc-field-wrap">
                    <div className="bc-field-label">Account Holder Name</div>
                    <Form.Item name="accountName" rules={[{ required:true, message:'Required' }]} style={{ margin:0 }}>
                      <Input size="large" placeholder="John Doe" style={{ borderRadius:10 }} />
                    </Form.Item>
                  </div>
                  <div className="bc-field-wrap">
                    <div className="bc-field-label">Account Number</div>
                    <Form.Item name="accountNumber" rules={[{ required:true, message:'Required' }]} style={{ margin:0 }}>
                      <Input size="large" placeholder="1234567890" style={{ borderRadius:10 }} />
                    </Form.Item>
                  </div>
                  <div className="bc-field-wrap">
                    <div className="bc-field-label">IFSC Code</div>
                    <Form.Item name="ifsc" rules={[{ required:true, message:'Required' }]} style={{ margin:0 }}>
                      <Input size="large" placeholder="SBIN0001234" style={{ borderRadius:10 }} />
                    </Form.Item>
                  </div>
                </>
              )}

              {mode === 'upi' && (
                <>
                  <div className="bc-field-wrap">
                    <div className="bc-field-label">Name</div>
                    <Form.Item name="accountName" rules={[{ required:true, message:'Required' }]} style={{ margin:0 }}>
                      <Input size="large" placeholder="John Doe" style={{ borderRadius:10 }} />
                    </Form.Item>
                  </div>
                  <div className="bc-field-wrap">
                    <div className="bc-field-label">UPI ID</div>
                    <Form.Item name="upi" rules={[{ required:true, message:'Required' }]} style={{ margin:0 }}>
                      <Input size="large" placeholder="name@okaxis" style={{ borderRadius:10 }} />
                    </Form.Item>
                  </div>
                </>
              )}

              {error && (
                <div style={{ fontSize:12, color:'#dc2626', marginBottom:10 }}>{error}</div>
              )}

              <Form.Item style={{ margin:0 }}>
                <button
                  type="submit"
                  className="bc-submit"
                  disabled={loading}
                >
                  {loading ? 'Saving…' : 'Add Card'}
                </button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default App;