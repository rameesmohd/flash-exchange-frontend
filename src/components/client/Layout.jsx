// Layout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, Wallet, User, Settings ,HelpCircle,NotebookIcon} from "lucide-react";

const tabs = [
  { label: "Home", icon: <Home />, path: "/" },
  { label: "Exchange", icon: <Wallet />, path: "/wallet" },
  { label: "Account", icon: <User />, path: "/account" },
];

const Layout = () => {
  return (
    <div className="flex flex-col h-screen sm:max-w-[375px]  mx-auto bg-gray-50 shadow-lg">
      {/* Top Navbar */}
     

      {/* Page content */}
      <main className="flex-grow overflow-hidden relative ">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="flex justify-around items-center bg-white border-t p-2">
        {tabs.map((tab) => (
          <NavLink
            to={tab.path}
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
        ))}
      </nav>
    </div>
  );
};

export default Layout;
