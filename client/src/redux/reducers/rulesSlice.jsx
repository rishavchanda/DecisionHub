import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  updated: false,
};

const rule = createSlice({
  name: "rule",
  initialState,
  reducers: {
    ruleUpdated: (state) => {
      state.updated = !state.updated;
    },
  },
});

export const { ruleUpdated } = rule.actions;

export default rule.reducer;
