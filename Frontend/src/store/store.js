import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginSlice";
import betReducer from "./betSlice";
import chatReducer from "./chatSlice";
import queueReducer from "./queueSlice";
import modalReducer from "./modalSlice";
import videoReducer from "./videoSlice";

const initialState = {
  login: {
    isLogged: JSON.parse(localStorage.getItem("isLogged")),
    user: JSON.parse(localStorage.getItem("user")),
  },
  bet: {
    betA: 0,
    betB: 0,
    isBet: false,
  },
  chat: {
    newChat: null,
    chatList: [],
  },
  queue: {
    player1: null,
    player2: null,
    rank1: null,
    rank2: null,
    currentQueue: null,
    splitQueue: null,
    queueLength: 0,
  },
  modal: {
    receptionOpen: false,
    confirmOpen: false,
    entryOpen: false,
    forbidOpen: false,
    playEndOpen: false,
    isPlayEndClicked: false,
    roomId: null,
    isWait: false,
    isPlay: false,
  },
  video: {
    video1: false,
    video2: false,
    video3: false,
  },
};

const store = configureStore({
  reducer: {
    login: loginReducer,
    bet: betReducer,
    chat: chatReducer,
    queue: queueReducer,
    modal: modalReducer,
    video: videoReducer,
  },
  preloadedState: initialState,
});

export default store;
