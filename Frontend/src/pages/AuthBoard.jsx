/* eslint-disable */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthBoard = (Component) => {
  return (props) => {
    const user = useSelector((state) => state.login.user);
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user.nickname !== "admin") {
      alert("관리자만 접근 가능합니다.");
      return <Navigate to="/noticeBoard" />;
    }
    return <Component {...props} />;
  };
};

export default AuthBoard;
