// App.jsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/client/Layout";
import Home from "./pages/Home";
import Exchange from "./pages/Exchange";
import Account from "./pages/Account";
import Landing from './pages/Landing'
import AuthGuard from './components/client/AuthGuard'
import { useSelector } from "react-redux";

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.User.isAuthenticated)
  const isHomePath = location.pathname === "/home";

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? (
      element
    ) : (
      <Landing home={isHomePath} />
    );
  };
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={ <Layout /> }>
          <Route path="/" element={<Landing home={true}/>} />
          <Route path="/home" element={<PrivateRoute element={<Home />}/>} />
          <Route path="/exchange" element={<PrivateRoute element={<Exchange />}/>} />
          <Route path="/account" element={<PrivateRoute element={<Account />}/>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
     <AuthGuard>
        <AppContent />
     </AuthGuard>
    </BrowserRouter>
  );
}
