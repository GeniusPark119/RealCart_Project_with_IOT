import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function FullWidthTextField(props) {
  const data = props;
  const [value, setValue] = useState("");
  let idx = 0;
  if (data.content === "비밀번호" || data.content === "비밀번호 확인") {
    idx = 1;
  }
  if (data.content === "닉네임") idx = 2;
  const msg = [
    "유효한 이메일 형식이 아닙니다.",
    "비밀번호는 8자 이상입니다.",
    "닉네임은 5자 이상입니다.",
  ];
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const verifyEmail = () => {
    if (value === "") return false;
    // eslint-disable-next-line
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (value.match(regExp) != null) {
      return false;
    }
    return true;
  };
  const verifyPassword = () => {
    if (value === "") return false;
    if (value.length < 8) return true;
    return false;
  };
  const verifyNickname = () => {
    if (value === "") return false;
    if (value.length < 5) return true;
    return false;
  };
  const verifier = [verifyEmail, verifyPassword, verifyNickname];
  return (
    <Box
      sx={{
        width: 400,
        maxWidth: "90%",
        margin: 2,
      }}
    >
      <TextField
        required
        error={verifier[idx]()}
        onChange={onChange}
        helperText={verifier[idx]() ? msg[idx] : ""}
        value={value}
        type="email"
        name="customer"
        fullWidth
        id="outlined-required"
        label={data.content}
      />
    </Box>
  );
}
