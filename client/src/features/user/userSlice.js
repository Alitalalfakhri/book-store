import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  uid:""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state , action) => {
      state.loggedIn = true;
      state.uid = action.payload.uid;
      
    },
    logout: (state) => {
      state.loggedIn = false;
      state.uid = null; // Reset uid on logout
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;