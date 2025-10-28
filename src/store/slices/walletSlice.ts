import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export const { setBalance } = walletSlice.actions;
export default walletSlice.reducer;