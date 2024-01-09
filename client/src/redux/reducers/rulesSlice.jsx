import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  updated: false,
  reload: false,
};

const rule = createSlice({
  name: "rule",
  initialState,
  reducers: {
    ruleUpdated: (state) => {
      state.updated = !state.updated;
    },
    ruleReload: (state) => {
      state.reload = !state.reload;
    },
  },
});

export const { ruleUpdated, ruleReload } = rule.actions;

export default rule.reducer;
