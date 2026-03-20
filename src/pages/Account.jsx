import React, { useState } from 'react';
import profileAvatar from '../../public/profile-avatar.jpeg';
import { RiBankCardLine, RiLuggageDepositLine } from 'react-icons/ri';
import { VscHistory } from 'react-icons/vsc';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { PiShareNetworkBold } from 'react-icons/pi';
import { TbExchange } from 'react-icons/tb';
import { ChevronRight, Gift, HelpCircle, LogOut } from 'lucide-react';
import Statement      from '../components/client/drawers/Statement';
import BankCard       from '../components/client/drawers/BankCard';
import DepositHistory from '../components/client/drawers/DepositHistory';
import ExchangeHistory from '../components/client/drawers/ExchangeHistory';
import ResetPass      from '../components/client/drawers/ResetPass';
import WithdrawHistory from '../components/client/drawers/WithdrawHistory';
import MyReferrals    from '../components/client/drawers/MyReferrals';
import Deposit        from '../components/client/drawers/Deposit';
import Withdraw       from '../components/client/drawers/Withdraw';
import { useSelector } from 'react-redux';
import { logoutUser, usersGet } from '../services/userApi';
import Invite         from '../components/client/Invite';
import HelpCenter     from '../components/client/drawers/HelpCenter';

const maskPhone = (p) => (!p || p.length < 10) ? p : p.slice(0,2) + '****' + p.slice(-4);
const maskEmail = (e) => {
  if (!e) return '';
  const [u, d] = e.split('@');
  return `${u.slice(0,2)}****@${d}`;
};

const options = [
  { title:'Bank Card',                   icon:RiBankCardLine,      key:'bankcard'        },
  { title:'Exchange History',            icon:VscHistory,          key:'exchangeHistory' },
  { title:'Deposit History',             icon:RiLuggageDepositLine,key:'depositHistory'  },
  { title:'Withdraw History',            icon:BiMoneyWithdraw,     key:'withdrawHistory' },
  { title:'My Referrals',               icon:PiShareNetworkBold,  key:'myReferrrals'    },
  { title:'Reset Transaction Password',  icon:TbExchange,          key:'resetPass'       },
];

const Account = () => {
  const { userData } = useSelector((s) => s.User);
  const [drawer, setDrawer] = useState({
    statement:false, bankcard:false, exchangeHistory:false,
    depositHistory:false, withdrawHistory:false, myReferrrals:false,
    resetPass:false, deposit:false, withdraw:false, invite:false, helpCenter:false,
  });
  const [loading, setLoading] = useState(false);

  const open  = (k) => setDrawer(p => ({ ...p, [k]: true  }));
  const close = (k) => setDrawer(p => ({ ...p, [k]: false }));

  const logout = async () => {
    try   { setLoading(true); await usersGet('/logout'); await logoutUser(); }
    catch (e) { console.log(e); }
    finally   { setLoading(false); }
  };

  return (
    /* No PageWrapper, no height/overflow — just a plain block that grows naturally */
    <div style={{ background:'#f0f2f7', minHeight:'100%' }}>

      {/* ── Profile header ── */}
      <div style={{
        background:'#0d1f3c', padding:'24px 20px 28px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(59,130,246,0.1)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-20, left:-10, width:90,  height:90,  borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>

        <div style={{ display:'flex', alignItems:'center', gap:16, position:'relative' }}>
          <div style={{ width:60, height:60, borderRadius:18, overflow:'hidden', border:'2px solid rgba(255,255,255,0.15)', flexShrink:0 }}>
            <img src={profileAvatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:17, fontWeight:700, color:'#fff', marginBottom:2 }}>
              +91 {maskPhone(userData?.phone)}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:12 }}>
              {maskEmail(userData?.email)}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => open('deposit')} style={{ padding:'5px 16px', borderRadius:9, border:'none', background:'#2563eb', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Deposit
              </button>
              <button onClick={() => open('withdraw')} style={{ padding:'5px 16px', borderRadius:9, border:'1px solid rgba(255,255,255,0.2)', background:'transparent', color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding:'16px 16px 24px', display:'flex', flexDirection:'column', gap:12 }}>

        {/* Referral banner */}
        <div onClick={() => open('invite')} style={{ background:'#1a3a6e', borderRadius:18, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', top:-20, right:60, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:3 }}>Invite Friends</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:12 }}>Earn up to 5% commission</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(255,255,255,0.12)', borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:600, color:'#93c5fd' }}>
              <Gift size={13}/> Get Started
            </div>
          </div>
          <img src="https://static.vecteezy.com/system/resources/previews/016/389/984/non_2x/business-digital-marketing-free-png.png" alt="" style={{ height:80, opacity:0.9, flexShrink:0 }}/>
        </div>

        {/* Menu list */}
        <div style={{ background:'#fff', borderRadius:18, border:'0.5px solid #e5e8ef', overflow:'hidden' }}>
          {options.map(({ title, icon:Icon, key }, i) => (
            <div key={key} onClick={() => open(key)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom: i < options.length-1 ? '0.5px solid #f1f5f9' : 'none', cursor:'pointer' }}>
              <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'#f4f6fb', display:'flex', alignItems:'center', justifyContent:'center', color:'#374151', fontSize:16, flexShrink:0 }}>
                  <Icon/>
                </div>
                <span style={{ fontSize:13.5, fontWeight:500, color:'#1a1f2e' }}>{title}</span>
              </div>
              <ChevronRight size={16} color="#c4cad4"/>
            </div>
          ))}
        </div>

        {/* Help Center */}
        <button onClick={() => open('helpCenter')} style={{ width:'100%', padding:'14px 18px', borderRadius:14, background:'#fff', border:'0.5px solid #e5e8ef', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:13 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <HelpCircle size={16} color="#2563eb"/>
            </div>
            <span style={{ fontSize:13.5, fontWeight:500, color:'#1a1f2e' }}>Help Center</span>
          </div>
          <ChevronRight size={16} color="#c4cad4"/>
        </button>

        {/* Sign out */}
        <button onClick={logout} disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:14, background:'#fff', border:'0.5px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', color:'#dc2626', fontSize:14, fontWeight:600 }}>
          <LogOut size={16}/>
          {loading ? 'Signing out…' : 'Sign Out'}
        </button>

      </div>

      {/* Drawers */}
      <Deposit         open={drawer.deposit}         setOpenDrawer={() => close('deposit')}/>
      <Withdraw        open={drawer.withdraw}        setOpenDrawer={() => close('withdraw')}/>
      <Statement       open={drawer.statement}       setOpenDrawer={() => close('statement')}/>
      <BankCard        open={drawer.bankcard}        setOpenDrawer={() => close('bankcard')}/>
      <DepositHistory  open={drawer.depositHistory}  setOpenDrawer={() => close('depositHistory')}/>
      <ExchangeHistory open={drawer.exchangeHistory} setOpenDrawer={() => close('exchangeHistory')}/>
      <WithdrawHistory open={drawer.withdrawHistory} setOpenDrawer={() => close('withdrawHistory')}/>
      <MyReferrals     open={drawer.myReferrrals}    setOpenDrawer={() => close('myReferrrals')}/>
      <ResetPass       open={drawer.resetPass}       setOpenDrawer={() => close('resetPass')}/>
      <Invite          open={drawer.invite}          onClose={() => close('invite')}/>
      <HelpCenter      open={drawer.helpCenter}      setOpenDrawer={() => close('helpCenter')}/>
    </div>
  );
};

export default Account;