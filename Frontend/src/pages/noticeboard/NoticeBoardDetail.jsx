import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import axios from "../../util/axiosInstance";
import Logo from "../../assets/logo.png";
import AppButton from "../../components/AppButton";
import AppBlackButton from "../../components/AppBlackButton";

function NoticeBoardDetail() {
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [date, setDate] = useState("");
  const [searchParams] = useSearchParams();
  const [displayWright, setDisplayWright] = useState("none");
  const no = Number(searchParams.get("no"));
  const user = useSelector((state) => state.login.user);

  useEffect(() => {
    if (user && user.nickname === "관리자") {
      setDisplayWright("");
    } else {
      setDisplayWright("none");
    }
    console.log(displayWright);
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/board/notice/${no}`)
      .then((res) => {
        let resContent = res.data.content;
        try {
          resContent = JSON.parse(resContent);
          resContent = draftToHtml(resContent);
        } finally {
          setTitle(res.data.title);
          setContent(resContent);
          setDate(new Date(res.data.createdTime).toLocaleDateString());
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
      .delete(`${process.env.REACT_APP_BACKEND_URL}/board/notice/${no}`, {})
      .then((response) => {
        navigate("/noticeboard");
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
            }}
          >
            <Box
              component="img"
              alt="logo"
              src={Logo}
              sx={{
                height: 120,
                width: 120,
                marginLeft: "60px",
                marginBottom: "5px",
              }}
            />
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
          <Link to="/noticeBoard">
            <AppButton
              sx={{
                border: "solid 1px black",
                marginRight: "10px",
              }}
            >
              목록
            </AppButton>
          </Link>
          <Link to={`/noticeBoard/modify?no=${no}`}>
            <AppBlackButton
              sx={{
                display: displayWright,
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              수정
            </AppBlackButton>
          </Link>
          <AppBlackButton
            sx={{ display: displayWright, borderRadius: "5px" }}
            onClick={handleDelete}
          >
            삭제
          </AppBlackButton>
        </Box>
      </Box>
    </Box>
  );
}

export default NoticeBoardDetail;
