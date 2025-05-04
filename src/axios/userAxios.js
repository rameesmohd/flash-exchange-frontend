import axios from 'axios'
import { useSelector } from 'react-redux'
const userAPI = import.meta.env.VITE_USER_API_URL

const userAxios=()=>{
  const token = useSelector((store)=>store.User.token)
    const userAxiosInstance = axios.create({
        baseURL: userAPI,
        withCredentials: true
    })
  
  userAxiosInstance.interceptors.request.use((config)=>{
      if(token) {
          config.headers["Authorization"]=`Bearer ${token}`;
      }
      return config
  },(error)=>{
      return Promise.reject(error)
  })

  return userAxiosInstance
}

export default userAxios;