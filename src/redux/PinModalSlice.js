import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: true,
  onSubmit: null, // callback to run after successful PIN
};

const pinModalSlice = createSlice({
  name: 'PinModal',
  initialState,
  reducers: {
    openPinModal: (state, action) => {
      state.isOpen = true;
      state.onSubmit = action.payload; // function to call on pin submit
    },
    closePinModal: (state) => {
      state.isOpen = false;
      state.onSubmit = null;
    },
  },
});

export const { openPinModal, closePinModal } = pinModalSlice.actions;
export default pinModalSlice.reducer;
