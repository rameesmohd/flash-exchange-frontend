import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    token : null,
    userData : null,
    referral : ""
  },
  reducers: {
    setUserData:(state,action)=>{
      state.userData= action.payload
    },
    setToken  :(state,action)=>{
      state.token = action.payload
    },
    userLogout : (state,action)=>{
      state.token = null
      state.userData = null
    },
    setReferral : (state,action)=>{
      state.referral = action.payload;
    }
  },
});

export const { setUserData,setToken ,setRecentManager,userLogout,setReferral } = userSlice.actions;

export default userSlice.reducer;