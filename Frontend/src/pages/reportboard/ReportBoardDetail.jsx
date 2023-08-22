import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import draftToHtml from "draftjs-to-html";
import axios from "../../util/axiosInstance";
import AppButton from "../../components/AppButton";
import AppBlackButton from "../../components/AppBlackButton";
import Logo from "../../assets/logo.png";

function ReportBoardDetail() {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [nickname, setNickname] = useState();
  const [date, setDate] = useState();
  const [searchParams] = useSearchParams();
  const [isUser, setIsUser] = useState("none");
  const no = Number(searchParams.get("no"));

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/board/report/${no}`)
      .then((res) => {
        let resContent = res.data.content;
        try {
          resContent = JSON.parse(resContent);
          resContent = draftToHtml(resContent);
        } finally {
          setTitle(res.data.title);
          setContent(resContent);
          setNickname(res.data.nickname);
          setDate(new Date(res.data.createdTime).toLocaleDateString());
        }
        if (user.nickname === res.data.nickname) {
          setIsUser("");
        } else {
          setIsUser("none");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/board/report/${no}`, {})
      .then((response) => {
        navigate("/reportboard");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          height: "70vh",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          marginTop: "60px",
        }}
      >
        <Box
          sx={{
            height: "20%",
            width: "100%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              borderTop: "solid 1px black",
              borderBottom: "solid 1px black",
              height: "100%",
              width: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              component="h1"
              sx={{
                marginBottom: "10px",
                fontWeight: "400",

                marginLeft: "100px",
              }}
            >
              {title}
            </Box>

            <Box component="span" sx={{ marginLeft: "100px" }}>
              {date}
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "solid 1px black",
              borderBottom: "solid 1px black",
              borderLeft: "solid 1px black",
              height: "100%",
              width: "20%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              alt="logo"
              src={Logo}
              sx={{
                height: 100,
                width: 100,
              }}
            />
            <Box component="h2">{nickname}</Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "30%",
            width: "100%",
          }}
        >
          <Box component="h3" sx={{ fontWeight: "300", padding: "20px" }}>
            <Box
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "200px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link to="/reportBoard">
            <AppButton sx={{ border: "solid 1px black", marginRight: "10px" }}>
              목록
            </AppButton>
          </Link>
          <Link to={`/reportBoard/modify?no=${no}`}>
            <AppBlackButton
              sx={{
                display: isUser,
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              수정
            </AppBlackButton>
          </Link>
          <AppBlackButton
            sx={{ display: isUser, borderRadius: "5px" }}
            onClick={handleDelete}
          >
            삭제
          </AppBlackButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ReportBoardDetail;
