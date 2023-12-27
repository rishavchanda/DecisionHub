import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  darkMode: true,
  reload: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload.user;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      localStorage.setItem("decisionhub-token-auth-x4", action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("decisionhub-token-auth-x4");
    },
    reload: (state) => {
      state.reload = !state.reload;
    },
  },
});

export const { updateUser, setDarkMode, loginSuccess, logout, reload } =
  userSlice.actions;

export default userSlice.reducer;
