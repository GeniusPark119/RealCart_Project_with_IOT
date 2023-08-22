import { createSlice } from "@reduxjs/toolkit";

const betSlice = createSlice({
  name: "bet",
  initialState: {
    betA: 0,
    betB: 0,
    isBet: false,
  },
  reducers: {
    betOnA: (state) => {
      if (state.isBet) return; // 중복배팅 방지
      state.betA += 1;
      state.isBet = true;
    },
    betOnB: (state) => {
      if (state.isBet) return; // 중복배팅 방지
      state.betB += 1;
      state.isBet = true;
    },
    betClear: (state) => {
      state.isBet = false;
    },
    setA: (state, action) => {
      // if (state.isBet) return; // 중복배팅 방지
      state.betA = action.payload;
    },
    setB: (state, action) => {
      // if (state.isBet) return; // 중복배팅 방지
      state.betB = action.payload;
    },
  },
});

export const { betOnA, betOnB, betClear, setA, setB } = betSlice.actions;
export default betSlice.reducer;
