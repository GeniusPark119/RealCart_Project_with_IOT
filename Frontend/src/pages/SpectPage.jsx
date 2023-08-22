import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Stomp from "stompjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import axios from "../util/axiosInstance";
import BetWindow from "../components/spect/BetWindow";
import EntryQueue from "../components/spect/EntryQueue";
import Versus from "../components/spect/Versus";
import ReceptionModal from "../components/spect/ReceptionModal";
import ConfirmModal from "../components/spect/ConfirmModal";
import EntryModal from "../components/spect/EntryModal";
import ForbidModal from "../components/spect/ForbidModal";
import Viewer1 from "../components/video/Viewer1";
import Viewer2 from "../components/video/Viewer2";
import Viewer3 from "../components/video/Viewer3";
import Poster1 from "../components/video/Poster1";
import {
  setReceptionOpen,
  setEntryOpen,
  setEntryClose,
  setRoomId,
  setIsWait,
  setIsPlay,
} from "../store/modalSlice";
import { setVideo1, setVideo2, setVideo3 } from "../store/videoSlice";

function SpectPage() {
  const videoSlice = useSelector((state) => state.video);
  const [videoReady, setVideoReady] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stompClient, setStompClient] = useState(null);

  const [chats, setChats] = useState([]);

  const [flicker, setFlicker] = useState(false);

  const text = useRef(null);
  const chatRef = useRef(null);

  const user = useSelector((state) => state.login.user);
  const queue = useSelector((state) => state.queue);
  const modal = useSelector((state) => state.modal);

  // Kurento 관련 함수 시작
  function sendChat(e) {
    e.preventDefault();
    if (text.current.value === "") return;
    if (text.current.value.length > 100) {
      alert("채팅은 100자 이내로 입력해주세요");
      return;
    }
    stompClient.send(
      "/publish/messages",
      {},
      JSON.stringify({
        message: `${user.nickname} : ${text.current.value}`,
        senderId: 7,
        receiverId: 14,
      })
    );
    text.current.value = "";
  }
  // Kurento 관련 함수 끝

  useEffect(() => {
    const endBet = setInterval(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/game`).then((res) => {
        if (res.data.player1 === "" || res.data.player2 === "") {
          dispatch(setVideo1(false));
          dispatch(setVideo2(false));
          dispatch(setVideo3(false));
          setVideoReady(false);
        } else if (
          videoSlice.video1 === false &&
          videoSlice.video2 === false &&
          videoSlice.video3 === false
        ) {
          dispatch(setVideo1(false));
          dispatch(setVideo2(false));
          dispatch(setVideo3(true));
          setVideoReady(true);
        }
      });
    }, 10000);

    const socketConst = new WebSocket(
      `${process.env.REACT_APP_MEDIA_URL}/chat`
    );
    const stompClientConst = Stomp.over(socketConst);
    stompClientConst.connect({}, function () {
      stompClientConst.subscribe("/subscribe", function (greeting) {
        console.log(greeting.body);
        setChats((currentArray) => [...currentArray, greeting.body]);
      });
    });

    setStompClient(stompClientConst);

    return () => {
      clearInterval(endBet);
      socketConst.close();
    };
  }, []);

  useEffect(() => {
    if (videoSlice.video1 || videoSlice.video2 || videoSlice.video3) {
      setVideoReady(true);
    }
  }, [videoSlice]);

  useEffect(() => {
    chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
  }, [chats]);

  useEffect(() => {
    let endFlicker;
    let endParticipate;
    if (modal.isWait) {
      endFlicker = setInterval(() => {
        setFlicker((prev) => !prev);
      }, 1000);
      endParticipate = setInterval(() => {
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/game/participate?nickname=${user.nickname}`
          )
          .then((res) => {
            if (res.data === -1) {
              clearInterval(endParticipate);
              dispatch(setIsWait(false));
              dispatch(setRoomId(1));
              dispatch(setEntryOpen());
              dispatch(setIsPlay(true));
              setTimeout(() => {
                navigate(`/play/1`);
                dispatch(setEntryClose());
                dispatch(setRoomId(null));
              }, 10000);
            }
            if (res.data === -2) {
              clearInterval(endParticipate);
              dispatch(setIsWait(false));
              dispatch(setRoomId(2));
              dispatch(setEntryOpen());
              dispatch(setIsPlay(true));
              setTimeout(() => {
                navigate(`/play/2`);
                dispatch(setEntryClose());
                dispatch(setRoomId(null));
              }, 10000);
            }
            if (res.data === -100) {
              alert("오류가 발생했습니다. 재접속해주세요.");
              clearInterval(endParticipate);
              dispatch(setIsWait(false));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 2000);
    }
    return () => {
      if (endFlicker) {
        clearInterval(endFlicker);
      }
    };
  }, [modal.isWait]);

  return (
    <Box
      display="flex"
      sx={{
        justifyContent: "center",
        marginBottom: "50px",
      }}
    >
      <Box
        sx={{
          width: "70%",
          height: 700,
          marginRight: "50px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "5%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "65%",
              height: "100%",
            }}
          />
          <Box
            sx={{
              width: "35%",
              height: "100%",
              color: "#FFA114",
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
            }}
          >
            {modal.isWait ? (
              <Box
                sx={{
                  opacity: flicker ? 0 : 1,
                  animation: "flicker 0.5s linear infinite",
                }}
              >
                대기 중 - 현재 대기 인수 : {queue.queueLength}명
              </Box>
            ) : null}
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            width: "100%",
            height: "10%",
          }}
        >
          <Versus queue={queue} />
          <EntryQueue queue={queue} />
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "90%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: "95%",
                height: "95%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                border: "solid 1px #bdbdbd",
              }}
            >
              <div>
                <div className="row">
                  <div className="col-md-5">
                    <div className="row">
                      <div className="col-md-12">
                        <Typography variant="h6">Camera</Typography>
                        <Button
                          onClick={() => {
                            dispatch(setVideo1(true));
                            dispatch(setVideo2(false));
                            dispatch(setVideo3(false));
                          }}
                          sx={{
                            border: "solid 1px black",
                            borderRadius: "15px",
                            color: "black",
                          }}
                        >
                          <span className="glyphicon glyphicon-user" /> Red
                        </Button>
                        &nbsp;
                        <Button
                          onClick={() => {
                            dispatch(setVideo1(false));
                            dispatch(setVideo2(true));
                            dispatch(setVideo3(false));
                          }}
                          sx={{
                            border: "solid 1px black",
                            borderRadius: "15px",
                            color: "black",
                          }}
                        >
                          <span className="glyphicon glyphicon-user" /> Blue
                        </Button>
                        &nbsp;
                        <Button
                          onClick={() => {
                            dispatch(setVideo1(false));
                            dispatch(setVideo2(false));
                            dispatch(setVideo3(true));
                          }}
                          sx={{
                            border: "solid 1px black",
                            borderRadius: "15px",
                            color: "black",
                          }}
                        >
                          <span className="glyphicon glyphicon-user" /> 관전
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    {videoSlice.video1 ? <Viewer1 /> : null}
                    {videoSlice.video2 ? <Viewer2 /> : null}
                    {videoSlice.video3 ? <Viewer3 /> : null}
                    {videoReady ? null : <Poster1 />}
                  </div>
                </div>
              </div>
            </Paper>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "20%",
          height: "700",
          borderLeft: "solid 1px #a1a1a1",
          paddingLeft: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          display="flex"
          sx={{
            height: 80,
            width: 250,
            justifyContent: "center",
            alignItems: "center",
            marginTop: "40px",
            border: "solid 1px #bdbdbd",
          }}
        >
          <Button
            sx={{
              height: 80,
              width: 250,
              bgcolor: "white",
              color: "#303038",
            }}
            onClick={() => {
              dispatch(setReceptionOpen());
            }}
          >
            Play
          </Button>
        </Paper>
        <BetWindow />
        <Box
          sx={{
            height: "50%",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            id="chat"
            sx={{
              width: "100%",
              height: "90%",
              maxHeight: 315,
              overflow: "auto",
              borderTop: "solid 1px #474747",
              borderLeft: "solid 1px #474747",
              borderRight: "solid 1px #474747",
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "15px",
            }}
            ref={chatRef}
          >
            <ul style={{ listStyleType: "none" }}>
              {chats.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Box>
          <form
            onSubmit={sendChat}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              ref={text}
              type="text"
              style={{
                width: "70%",
                height: "50px",
                border: "solid 1px #474747",
                borderBottomLeftRadius: "15px",
              }}
              placeholder="     채팅을 입력하세요"
            />
            <button
              type="submit"
              style={{
                width: "30%",
                height: "56px",
                borderTop: "solid 1px #474747",
                borderBottom: "solid 1px #474747",
                borderRight: "solid 1px #474747",
                borderLeft: "none",
                borderBottomRightRadius: "15px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <SendIcon sx={{ color: "#474747" }} />
            </button>
          </form>
        </Box>
        <Box
          display="flex"
          sx={{
            width: "100%",
            height: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            sx={{
              height: 50,
              width: "50%",
              bgcolor: "white",
              color: "black",
              marginTop: "20px",
            }}
          >
            <Link to="/reportBoard/write" style={{ textDecoration: "none" }}>
              버그 및 문제신고
            </Link>
          </Button>
          <ReceptionModal />
          <ConfirmModal />
          <EntryModal />
          <ForbidModal />
        </Box>
      </Box>
    </Box>
  );
}

export default SpectPage;
