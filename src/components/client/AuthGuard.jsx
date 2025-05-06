import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAxios from "../../axios/userAxios"
import { Spinner } from "flowbite-react";

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosInstance = userAxios()
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/verify");
        navigate("/home");
      } catch (err) {
        console.log(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <Spinner/>

  return children;
};

export default AuthGuard;
