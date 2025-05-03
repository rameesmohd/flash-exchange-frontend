// App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/client/Layout";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import Account from "./pages/Account";
import Landing from './pages/Landing'

const AppContent = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
