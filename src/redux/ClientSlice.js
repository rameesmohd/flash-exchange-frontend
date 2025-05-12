import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    isAuthenticated: false,
    userData: null,
    selectedAddress:{},
    selectedBankCard : {}
  },
  reducers: {
    setUserData:(state,action)=>{
      state.userData= action.payload
    },
    setIsAuthenticated  :(state,action)=>{
      state.isAuthenticated = true
    },
    setAddressSelected:(state,action)=>{
      state.selectedAddress = action.payload
    },
    setBankCardSelected:(state,action)=>{
      state.selectedBankCard = action.payload
    },
    userLogout : (state,action)=>{
      state.isAuthenticated = false
      state.userData = null
    }
  }
});

export const { 
  setUserData, 
  setIsAuthenticated,
  setAddressSelected, 
  setBankCardSelected,
  userLogout 
} = userSlice.actions;

export default userSlice.reducer;