import axios from 'axios'
const userAPI = import.meta.env.VITE_USER_API_URL

const userAxios=()=>{
  const userAxiosInstance = axios.create({
        baseURL: userAPI,
        withCredentials: true
  })
  return userAxiosInstance
}

export default userAxios;