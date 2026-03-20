import landingimage from '../../public/landing.png';
import earnBanner from '../../public/earnbanner.png';
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import Signup from '../components/client/drawers/Signup';
import SignIn from '../components/client/drawers/SignIn';
// import crypto3dImg from '../../public/photo_2026-03-20_13-41-06.jpg';
// import landingImg from "../../public/photo_2026-03-20_13-41-09.jpg"
const Landing = ({ home }) => {
  const [openDrawer, setopenDrawer] = useState({ signin: false, signup: false });
  const open  = (k) => setopenDrawer(p => ({ ...p, [k]: true  }));
  const close = (k) => setopenDrawer(p => ({ ...p, [k]: false }));

  const features = [
    { icon: Zap,         title: 'Instant Payouts', desc: 'Receive INR directly to your bank within minutes.'     },
    { icon: TrendingUp,  title: 'Best Rates',       desc: 'Competitive exchange rates updated in real time.'     },
    { icon: ShieldCheck, title: 'Secure & Trusted', desc: '100% verified transactions and encrypted payments.'   },
  ];

  return (
    /* No PageWrapper — Layout's <main> is already the scroll container */
    <>
      {home ? (
        <div style={{ background: '#f0f2f7', minHeight: '100%' }}>

          {/* Hero image */}
          <div style={{ position: 'relative', lineHeight: 0 }}>
            <img
              src="https://res.cloudinary.com/dj5inosqh/image/upload/v1750281670/jruwcyz9wwz8n5qfqq6s.jpg"
              // src={landingImg}
              alt="banner"
              style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
            />
            {/* <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.55))',
            }} /> */}
          </div>

          <div style={{ padding: '20px 18px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Welcome + CTA */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '22px 20px', border: '0.5px solid #e5e8ef' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
              </div>
              {/* <img className='h-5 mb-4' src={crypto3dImg} alt="" /> */}
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 6 }}>
                Sell USDT for INR<br />
                <span style={{ color: '#2563eb' }}>Fast &amp; Secure</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22, lineHeight: 1.5 }}>
                The simplest way to convert crypto to cash — right in your pocket.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => open('signup')}
                  style={{ width: '100%', padding: '13px', borderRadius: 13, background: '#0d1f3c', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.2px' }}
                >
                  Create an Account
                </button>
                <button
                  onClick={() => open('signin')}
                  style={{ width: '100%', padding: '13px', borderRadius: 13, background: 'transparent', color: '#0f172a', border: '0.5px solid #d1d5db', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Log In
                </button>
              </div>
            </div>

            {/* Earn banner */}
            <div
              onClick={() => open('signup')}
              style={{ background: '#0d1f3c', borderRadius: 18, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: -30, right: 60, width: 110, height: 110, borderRadius: '50%', background: 'rgba(59,130,246,0.1)' }} />
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>Average earnings</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Up to ₹1 Lakh</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#93c5fd' }}>
                  Get Started <ArrowRight size={13} />
                </div>
              </div>
              <img src={earnBanner} alt="" style={{ height: 80, opacity: 0.9, flexShrink: 0 }} />
            </div>

            {/* Features */}
            <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid #e5e8ef', overflow: 'hidden' }}>
              {features.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '14px 18px', borderBottom: i < features.length - 1 ? '0.5px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color="#2563eb" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      ) : (
        /* ── Auth / splash variant ── */
        <div style={{
          background: '#f0f2f7',
          minHeight: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '32px 24px 48px',
        }}>
          {/* <img src={crypto3dImg} alt="" style={{ width: 200, marginBottom: 8 }} /> */}
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 8 }}>
            Welcome to FsQuickPay
          </div>
          <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.6, maxWidth: 260, marginBottom: 32 }}>
            Your trusted partner for fast, secure USDT to INR exchanges.
          </div>
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => open('signup')}
              style={{ width: '100%', padding: '13px', borderRadius: 13, background: '#0d1f3c', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Create an Account
            </button>
            <button
              onClick={() => open('signin')}
              style={{ width: '100%', padding: '13px', borderRadius: 13, background: '#fff', color: '#0f172a', border: '0.5px solid #d1d5db', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* Drawers portal to body so they always appear above everything */}
      <Signup open={openDrawer.signup} setOpenDrawer={() => close('signup')} getContainer={() => document.body} />
      <SignIn open={openDrawer.signin} setOpenDrawer={() => close('signin')}  getContainer={() => document.body} />
    </>
  );
};

export default Landing;