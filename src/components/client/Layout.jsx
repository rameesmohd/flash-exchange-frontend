// Layout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Wallet, User, Settings ,HelpCircle,NotebookIcon} from "lucide-react";

const tabs = [
  { label: "Home", icon: <Home />, path: "/home" },
  { label: "Exchange", icon: <Wallet />, path: "/exchange" },
  { label: "Account", icon: <User />, path: "/account" },
];

const Layout = () => {
  return (
    // <div className="flex flex-col h-[100dvh] sm:max-w-[375px]  mx-auto bg-gray-50 shadow-lg">
    <div className="flex flex-col w-full max-w-[375px] min-h-[100dvh] mx-auto bg-gray-50 shadow-lg">
      {/* Top Navbar */}
     <div className="text-xs text-center bg-black text-gray-300">Beta Version</div>

      {/* Page content */}
      <main className="flex-grow relative overflow-x-hidden">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="flex justify-around items-center bg-white border-t p-2 z-30">
        { 
        tabs.map((tab) => (
          <NavLink
              to={tab.path}
              end
              key={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive ? "text-black" : "text-gray-500"
                }`
              }
            >
            <div className="text-xl">{tab.icon}</div>
            <span>{tab.label}</span>
          </NavLink>
        ))
        }
      </nav>
    </div>
  );
};

export default Layout;
