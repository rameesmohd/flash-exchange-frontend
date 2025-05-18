import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    isAuthenticated: false,
    userData: null,
    selectedFund : null,
    selectedAddress:{},
    selectedBankCard : {},
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
    setFund : (state,action)=>{
      state.selectedFund = action.payload
    },
    userLogout : (state,action)=>{
      state.isAuthenticated = false
      state.userData = null
      state.selectedFund = null
      state.selectedAddress = {}
      state.selectedBankCard = {}
    }
  }
});

export const { 
  setUserData, 
  setIsAuthenticated,
  setAddressSelected, 
  setBankCardSelected,
  setFund,
  userLogout 
} = userSlice.actions;

export default userSlice.reducer;