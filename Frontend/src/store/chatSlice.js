import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    newChat: null,
    chatList: [],
  },
  reducers: {
    setChat: (state, action) => {
      state.newChat = action.payload;
    },
    pushList: (state, action) => {
      state.chatList.push(action.payload);
    },
    clearList: (state) => {
      state.chatList = [];
    },
  },
});

export const { setChat, pushList, clearList } = chatSlice.actions;
export default chatSlice.reducer;
