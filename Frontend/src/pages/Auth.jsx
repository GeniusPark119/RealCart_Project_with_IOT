/* eslint-disable */
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Auth = (Component) => {
  return (props) => {
    const user = useSelector((state) => state.login.user);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return <Component {...props} />;
  };
};

export default Auth;
