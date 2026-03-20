import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Wallet, User } from "lucide-react";

const tabs = [
  { label: "Home",     icon: Home,   path: "/home"     },
  { label: "Exchange", icon: Wallet, path: "/exchange" },
  { label: "Account",  icon: User,   path: "/account"  },
];

const NAV_H = 60;

const Layout = () => {
  return (
    <div
      className="flex flex-col w-full sm:max-w-[375px] mx-auto bg-neutral-100 shadow-lg"
      style={{ height: '100dvh', overflow: 'hidden', position: 'relative' }}
    >
      {/* ── Only scroll container ── */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
      }}>
        <Outlet />
      </main>

      {/* ── Bottom nav ──
          position:relative keeps it in normal flow at the bottom of the flex column.
          It never uses position:fixed/absolute so it cannot overlap portalled modals/drawers
          which render into document.body above this stacking context entirely.
      ── */}
      <nav style={{
        flexShrink: 0,
        height: NAV_H,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: '#ffffff',
        borderTop: '0.5px solid #e5e7eb',
        /* no z-index — stays in natural stacking order below portalled overlays */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
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