import React, { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import axios from "../util/axiosInstance";
import BoardTable from "../components/BoardTable";
import MainPoster from "../components/video/MainPoster";
import { login } from "../store/loginSlice";
import { setPlayer } from "../store/queueSlice";
import Viewer3 from "../components/video/Viewer3Main";

function MainPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const queue = useSelector((state) => state.queue);
  const navigate = useNavigate();

  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/game`)
      .then((res) => {
        dispatch(setPlayer(res.data));
        if (queue.player1 === "" || queue.player2 === "") {
          setIsVideo(false);
        } else {
          setIsVideo(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    const endGetPlayer = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/game`)
        .then((res) => {
          dispatch(setPlayer(res.data));
          if (queue.player1 === "" || queue.player2 === "") {
            setIsVideo(false);
          } else {
            setIsVideo(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);

    if (!user) {
      const token = localStorage.getItem("access-token");
      if (token) {
        axios
          .get(`https://i8a403.p.ssafy.io/api/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          })
          .then((response) => {
            dispatch(login(response.data.body.user));
            localStorage.setItem(
              "user",
              JSON.stringify(response.data.body.user)
            );
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return () => {
      clearInterval(endGetPlayer);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: 1600,
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "45%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              width: "1300px",
              height: "700px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isVideo ? <Viewer3 /> : <MainPoster />}
          </Paper>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "50%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
                height: "90%",
                editable: "false",
              }}
            >
              <Box
                sx={{
                  height: "5%",
                }}
              >
                <Typography
                  variant="h7"
                  sx={{
                    fontWeight: "bold",
                    color: " black",
                  }}
                >
                  공지사항
                </Typography>
              </Box>
              <BoardTable address="board/notice" link="/noticeBoard" />

              <Box
                sx={{
                  height: "5%",
                  margin: "20px 0px",
                }}
              >
                <Typography
                  variant="h7"
                  sx={{
                    fontWeight: "bold",
                    color: " black",
                  }}
                >
                  게시글
                </Typography>
              </Box>
              <BoardTable address="board/free" link="/freeBoard" />
            </Box>
          </Box>
          <Box
            sx={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
                height: "90%",
              }}
            >
              <Box
                sx={{
                  height: "5%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h7"
                  sx={{
                    width: "50%",
                    fontWeight: "bold",
                    textAlign: "Left",
                    color: " black",
                  }}
                >
                  Ranking
                </Typography>
                <Typography
                  variant="h7"
                  sx={{
                    width: "50%",
                    textAlign: "Right",
                  }}
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/myPage"
                  >
                    <MilitaryTechIcon />
                    나의 랭킹 보러가기
                  </Link>
                </Typography>
              </Box>

              <BoardTable address="record" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MainPage;
