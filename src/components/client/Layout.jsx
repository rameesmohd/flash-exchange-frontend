import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Wallet, User } from "lucide-react";

const tabs = [
  { label: "Home",     icon: Home,   path: "/home"     },
  { label: "Exchange", icon: Wallet, path: "/exchange" },
  { label: "Account",  icon: User,   path: "/account"  },
];

const NAV_H = 60; // px — exact nav height so main gets the remaining space

const Layout = () => {
  return (
    /*
      Outer div:
        - fixed viewport height via h-[100dvh]
        - flex column
        - NO overflow on itself — it must NOT scroll
    */
    <div
      className="flex flex-col w-full sm:max-w-[375px] mx-auto bg-neutral-100 shadow-lg"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      {/* ── Page content — the ONLY scroll container ── */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: NAV_H, // push content above fixed nav
          minHeight: 0,         // critical for flex children to shrink correctly
        }}
      >
        <Outlet />
      </main>

      {/* ── Bottom Tab Navigation ── */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          height: NAV_H,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          background: '#ffffff',
          borderTop: '0.5px solid #e5e7eb',
          zIndex: 30,
          /* centre inside the max-width shell on desktop */
          maxWidth: 375,
          margin: '0 auto',
        }}
      >
        {tabs.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end
            style={{ textDecoration: 'none', flex: 1 }}
          >
            {({ isActive }) => (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 2, padding: '4px 0',
              }}>
                <div style={{
                  width: 40, height: 32, borderRadius: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? '#0d1f3c' : 'transparent',
                  transition: 'background .18s',
                }}>
                  <Icon size={18} strokeWidth={2} color={isActive ? '#fff' : '#9ca3af'} />
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0d1f3c' : '#9ca3af',
                  letterSpacing: '0.2px',
                }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;