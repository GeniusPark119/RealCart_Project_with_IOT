import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    video1: false,
    video2: false,
    video3: false,
  },
  reducers: {
    setVideo1: (state, action) => {
      state.video1 = action.payload;
    },
    setVideo2: (state, action) => {
      state.video2 = action.payload;
    },
    setVideo3: (state, action) => {
      state.video3 = action.payload;
    },
  },
});

export const { setVideo1, setVideo2, setVideo3 } = videoSlice.actions;
export default videoSlice.reducer;
