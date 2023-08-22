import React, { useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";

function AppForm({
  content,
  emailCheck,
  pwd,
  nicknameCheck,
  sx,
  placeholder,
  variant,
  ...otherProps
}) {
  const [input, setInput] = useState("");

  const verifier = {
    email: () => {
      if (input === "") return false;
      if (emailCheck === "Duplicate") return true;
      // eslint-disable-next-line
      const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (input.match(regExp) != null) {
        return false;
      }
      return true;
    },
    password: () => {
      if (input === "") return false;
      if (input.length < 8) return true;
      return false;
    },
    passwordCheck: () => {
      if (input === "") return false;
      if (input !== pwd) return true;
      return false;
    },
    nickname: () => {
      if (input === "") return false;
      if (nicknameCheck === "Duplicate") return true;
      if (input.length < 3) return true;
      return false;
    },
  };
  const msg = {
    email: "유효한 이메일 형식이 아닙니다.",
    emailCheckError: "이미 사용중인 이메일입니다.",
    emailCheckSuccess: "사용 가능한 이메일입니다.",
    password: "비밀번호는 8자 이상입니다.",
    passwordCheck: "비밀번호가 일치하지 않습니다.",
    nickname: "닉네임은 3자 이상입니다.",
    nicknameCheckError: "이미 사용중인 닉네임입니다.",
    nicknameCheckSuccess: "사용 가능한 닉네임입니다.",
  };

  const emailHelper = () => {
    if (verifier.email()) {
      if (emailCheck === "Duplicate") {
        return msg.emailCheckError;
      }
      return msg.email;
    }
    if (emailCheck === "Unique" && input.length > 0) {
      return msg.emailCheckSuccess;
    }
    return "";
  };

  const nicknameHelper = () => {
    if (verifier.nickname()) {
      if (nicknameCheck === "Duplicate") {
        return msg.nicknameCheckError;
      }
      return msg.nickname;
    }
    if (nicknameCheck === "Unique" && input.length > 0) {
      return msg.nicknameCheckSuccess;
    }
    return "";
  };

  const onChange = (e) => {
    setInput(e.target.value);
  };

  switch (content) {
    case "email":
      return (
        <TextField
          sx={sx}
          required
          label="이메일"
          variant={variant}
          type="email"
          fullWidth
          error={verifier.email()}
          helperText={emailHelper()}
          onChange={onChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
        />
      );
    case "password":
      return (
        <TextField
          sx={sx}
          required
          label="비밀번호"
          variant={variant}
          type="password"
          fullWidth
          error={verifier.password()}
          helperText={verifier.password() ? msg.password : ""}
          onChange={onChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
        />
      );
    case "passwordCheck":
      return (
        <TextField
          sx={sx}
          required
          variant={variant}
          label="비밀번호 확인"
          type="password"
          fullWidth
          error={verifier.passwordCheck()}
          helperText={verifier.passwordCheck() ? msg.passwordCheck : ""}
          onChange={onChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
        />
      );
    case "nickname":
      return (
        <TextField
          sx={sx}
          required
          label="닉네임"
          type="text"
          placeholder={placeholder}
          variant={variant}
          fullWidth
          error={verifier.nickname()}
          helperText={nicknameHelper()}
          onChange={onChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
        />
      );
    default:
      return <TextField />;
  }
}

AppForm.defaultProps = {
  sx: {},
  content: "",
  emailCheck: "",
  pwd: "",
  nicknameCheck: "",
  placeholder: "",
  variant: "",
};

AppForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  content: PropTypes.string,
  emailCheck: PropTypes.string,
  pwd: PropTypes.string,
  nicknameCheck: PropTypes.string,
  placeholder: PropTypes.string,
  variant: PropTypes.string,
};

export default AppForm;
