/* eslint-disable */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthAdmin = (Component) => {
  return (props) => {
    const user = useSelector((state) => state.login.user);
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user.nickname !== "관리자") {
      alert("관리자만 접근 가능합니다.");
      return <Navigate to="/noticeBoard" />;
    }
    return <Component {...props} />;
  };
};

export default AuthAdmin;
