import { message } from 'antd';
import userAxios from '../axios/userAxios'
const axiosInstance = userAxios()
import { userLogout } from '../redux/ClientSlice'
import { store } from "../redux/Store";

// Function to get error message based on status code
const getErrorMessage = (status) => {
    switch (status) {
      case 401:
        return "Unauthorized access. Please log in and try again.";
      case 402:
        return "Payment required. Please check your payment details.";
      case 403:
        return "Forbidden. You do not have permission to access this resource.";
      case 404:
        return "Resource not found. Please check the URL or contact support.";
      case 504:
        return "Gateway timeout. The server took too long to respond. Please try again later.";
      case 500:
        return "Internal server error. Something went wrong on our end. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };
  
// Generic function to handle errors
const handleError = (error) => {
    const status = error.response?.status;
    const errMsg = error.response?.data?.errMsg || getErrorMessage(status);
  
    if (status === 401) {
      logoutUser(); // Correctly logout on unauthorized
    } else {
      console.log(errMsg);
    }
  
    return Promise.reject(error);
  };

// Generic function to handle responses
const handleResponse = (response) => {
    if (response.headers["content-type"] === "application/pdf") return response;
    else return response.data;
  };

const usersGet = async (url, options = {}) => {
    try {
      const response = await axiosInstance.get(url);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };
  
const usersPost = async (url, formData) => {
    try {
      const response = await axiosInstance.post(url, formData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };

const usersPatch = async (url, formData, img) => {
    try {
      const headers = {
        "Content-Type": img ? "multipart/form-data" : "application/json",
      };
      const response = await axiosInstance.patch(url, formData, { ...headers , timeout: 60000});
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };
  
const usersDelete = async (url) => {
    try {
      const response = await axiosInstance.delete(url);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };
  
//   // Custom logout function for user
const logoutUser = () => {
    store.dispatch(userLogout());
};

export { 
    usersGet,
    usersPost,
    usersPatch,
    usersDelete,
    logoutUser
}