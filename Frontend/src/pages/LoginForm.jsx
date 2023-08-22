import React from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "../util/axiosInstance";
import { login } from "../store/loginSlice";
import AppForm from "../components/AppForm";
import ArrowButton from "../components/ArrowButton";

function TokenLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { id: e.target[0].value, password: e.target[2].value };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/accounts/auth/login`, data)
      .then((response) => {
        localStorage.setItem("access-token", response.data.body.token);
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .get(`https://i8a403.p.ssafy.io/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((response) => {
        dispatch(login(response.data.body.user));
        localStorage.setItem("user", JSON.stringify(response.data.body.user));
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "grid",
          height: 700,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            width: 500,
            height: 550,
            justifyContent: "center",
            alignItems: "center",
            border: 1,
          }}
        >
          <Box
            sx={{
              height: 30,
            }}
          />
          <h1>로그인</h1>
          <Box
            sx={{
              height: 10,
            }}
          />
          <Stack
            spacing={3}
            sx={{
              width: "80%",
            }}
          >
            <AppForm variant="outlined" content="email" />
            <AppForm variant="outlined" content="password" />
          </Stack>
          <Box
            sx={{
              height: 10,
            }}
          />
          <Stack
            spacing={1}
            sx={{
              width: "80%",
              height: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowButton
              type="submit"
              sx={{
                width: 300,
                height: 50,
              }}
            >
              로그인
            </ArrowButton>
            <Link to="/findPass" style={{ textDecoration: "none" }}>
              <ArrowButton
                sx={{
                  width: 300,
                  height: 50,
                }}
              >
                비밀번호 찾기
              </ArrowButton>
            </Link>
            <Button
              sx={{
                width: 300,
                height: 50,
                color: "black",
                bgcolor: "white",
                border: 1,
              }}
              onClick={() => {
                window.open(
                  "https://i8a403.p.ssafy.io/api/oauth2/authorization/google?redirect_uri=https://i8a403.p.ssafy.io/oauth/redirect"
                );
              }}
            >
              <Box
                sx={{
                  width: "31%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    marginRight: 1,
                    color: "primary",
                  }}
                >
                  <GoogleIcon />
                </Box>
              </Box>
              <Box
                sx={{
                  width: "38%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>구글로 시작하기</Box>
              </Box>
              <Box
                sx={{
                  width: "31%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <ArrowForwardIcon />
              </Box>
            </Button>
            <Link to="/regist" style={{ textDecoration: "none" }}>
              <ArrowButton
                sx={{
                  width: 300,
                  height: 50,
                }}
              >
                회원가입
              </ArrowButton>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default TokenLoginForm;
