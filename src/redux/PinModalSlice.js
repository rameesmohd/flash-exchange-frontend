// redux/PinModalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false
};

const pinModalSlice = createSlice({
  name: 'PinModal',
  initialState,
  reducers: {
    openPinModal: (state) => {
      state.isOpen = true;
    },
    closePinModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openPinModal, closePinModal } = pinModalSlice.actions;
export default pinModalSlice.reducer;
