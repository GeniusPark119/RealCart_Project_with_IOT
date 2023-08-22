import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import axios from "../util/axiosInstance";
import AppButton from "../components/AppButton";
import RecordTable from "../components/RecordTable";
import AppForm from "../components/AppForm";

function MyPage() {
  const user = useSelector((state) => state.login.user);
  const [nickname, setNickname] = useState("");
  const [nicknameCheck, setNicknameCheck] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = { nickname };
    const headers = {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
    };
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/user/checknickname`,
        { params },
        { headers }
      )
      .then((res) => {
        setNicknameCheck(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  const handleModifyNick = () => {
    const data = {
      email: user.email,
      nickname,
    };
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/user/nickname`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const originalUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(originalUser);
        parsedUser.nickname = res.data.nickname;
        localStorage.setItem("user", JSON.stringify(parsedUser));
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleModifyPass = () => {
    const data = {
      email: user.email,
      password,
    };
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/user/password`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        alert("비밀번호 변경이 완료되었습니다.");
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      display="flex"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 800,
      }}
    >
      <Box
        sx={{
          width: "80%",
        }}
      >
        <Typography variant="h5" flexGrow={1}>
          My Page
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "50px",
        }}
      >
        <Box>
          <Box component="h3">랭킹&최고기록</Box>
          <RecordTable
            address={`record/best/${user.nickname}`}
            user={user.nickname}
          />
        </Box>
        <Box>
          <Box component="h3">히스토리</Box>
          <RecordTable
            address={`record/${user.nickname}`}
            user={user.nickname}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "80%",
          marginTop: "60px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <KeyboardArrowRightIcon />
          <Typography
            variant="h5"
            flexGrow={1}
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "25px",
            }}
          >
            나의 정보 수정하기
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "30px 0px 0px 50px",
          }}
        >
          <Box
            sx={{
              marginRight: "44px",
              fontSize: "25px",
            }}
          >
            닉네임
          </Box>
          <AppForm
            content="nickname"
            variant="standard"
            placeholder={user.nickname}
            nicknameCheck={nicknameCheck}
            sx={{
              width: 200,
              maxWidth: "90%",
              margin: 2,
            }}
            onInput={(e) => {
              setNickname(e.target.value);
              setNicknameCheck("");
            }}
          />
          <AppButton
            sx={{
              fontSize: "15px",
              border: "solid 1px gray",
              borderRadius: "20px",
              marginLeft: "20px",
            }}
            onClick={handleModifyNick}
          >
            변경
          </AppButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "30px 0px 0px 50px",
          }}
        >
          <Box
            sx={{
              marginRight: "20px",
              fontSize: "25px",
            }}
          >
            비밀번호
          </Box>
          <AppForm
            content="password"
            variant="standard"
            sx={{
              width: 200,
              maxWidth: "90%",
              margin: 2,
            }}
            onInput={(e) => {
              setPassword(e.target.value);
            }}
          />

          <AppButton
            sx={{
              fontSize: "15px",
              border: "solid 1px gray",
              borderRadius: "20px",
              marginLeft: "20px",
            }}
            onClick={handleModifyPass}
          >
            변경
          </AppButton>
        </Box>
      </Box>
    </Box>
  );
}

export default MyPage;
