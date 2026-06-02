import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  message: '',
  appName: 'SheetSense',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = '';
    },
  },
});

export const { setLoading, setMessage, clearMessage } = appSlice.actions;
export default appSlice.reducer;