/* eslint-disable */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../util/axiosInstance";

const AuthPlayer = (Component) => {
  return (props) => {
    const user = useSelector((state) => state.login.user);
    if (!user) {
      return <Navigate to="/login" />;
    }
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/game`).then((res) => {
      if (
        user.nickname !== res.data.player1 &&
        user.nickname !== res.data.player2
      ) {
        alert("게임에 참여하지 않은 유저입니다.");
        return <Navigate to="/spect" />;
      }
    });
    return <Component {...props} />;
  };
};

export default AuthPlayer;
