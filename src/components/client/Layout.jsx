import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Wallet, User } from "lucide-react";

const tabs = [
  { label: "Home", icon: <Home />, path: "/home" },
  { label: "Exchange", icon: <Wallet />, path: "/exchange" },
  { label: "Account", icon: <User />, path: "/account" },
];

const Layout = () => {
  return (
    <div className="flex flex-col w-full sm:max-w-[375px] h-[100dvh] overflow-hidden mx-auto bg-neutral-100 shadow-lg">
      
      {/* Top Notice Bar */}
      <div className="text-xs text-center bg-gray-900 text-white py-1 shadow-sm">
        Beta Release — For Testing & Feedback
      </div>

      {/* Main Page Content */}
      <main className="flex-grow relative overflow-y-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t p-2 z-30 sm:static sm:w-full">
        {tabs.map(({ label, icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-black" : "text-gray-500"
              }`
            }
          >
            <div className="text-xl">{icon}</div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
