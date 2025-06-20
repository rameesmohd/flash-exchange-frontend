import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { setIsAuthenticated, setUserData } from "../../redux/ClientSlice";
import { useDispatch } from "react-redux";
import { usersGet } from "../../services/userApi";
import FullPageLoader from './common/FullPageLoader'

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await usersGet("/auth/verify");
        if(response.user){
          dispatch(setUserData(response.user))
          dispatch(setIsAuthenticated())
        }
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

   if (loading) return <FullPageLoader />;

  return children;
};

export default AuthGuard;
