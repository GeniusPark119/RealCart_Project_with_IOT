/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";
import Stomp from "stompjs";
import axios from "../util/axiosInstance";
import tutorial from "../assets/toturial1.png";
import RaceTime from "../components/RaceTime";
import RectangleBest from "../assets/Rectangle_Best.png";
import RectangleRace from "../assets/Rectangle_Racetime.png";
import RectangleResult from "../assets/Rectangle_Result.png";
import TransparentImg from "../assets/img/transparent-1px.png";
import TransparentImg2 from "../assets/img/transparent-copy.png";
import CountdownOne from "../assets/count_1.png";
import CountdownTwo from "../assets/count_2.png";
import CountdownThree from "../assets/count_3.png";
import CountdownStart from "../assets/START.png";
import CarHandle from "../assets/car_handle.png";
import PlayVersus from "../components/play/PlayVersus";
import Viewer2 from "../components/video/Viewer200";
import SmallViewer3 from "../components/video/SmallViewer3";
import PlayEndModal from "../components/play/PlayEndModal";
import { setPlayEndOpen, setIsPlayEndClicked } from "../store/modalSlice";

function NewPlayPage2() {
  const [showResult, setShowResult] = useState(false);
  const [bestTime, setBestTime] = useState("00:00:00");
  const queue = useSelector((state) => state.queue);
  const [winPlayer, setWinPlayer] = useState("");
  const [losePlayer, setLosePlayer] = useState("");
  const [winPlayerTime, setWinPlayerTime] = useState("");
  const [losePlayerTime, setLosePlayerTime] = useState("");
  const [isWin, setIsWin] = useState(true);

  const rows = [
    {
      place: 1,
      nickname: winPlayer,
      laptime: winPlayerTime,
    },
    {
      place: 2,
      nickname: losePlayer,
      laptime: losePlayerTime,
    },
  ];
  const modal = useSelector((state) => state.modal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const chatRef = useRef(null);

  const [carSpeed, setCarSpeed] = useState(0);
  const [isBoost, setIsBoost] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isTutorial, setIsTutorial] = useState(true);
  const user = useSelector((state) => state.login.user);

  const [wss, setWss] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const text = useRef(null);

  const images = [
    TransparentImg2,
    CountdownThree,
    CountdownTwo,
    CountdownOne,
    CountdownStart,
    TransparentImg,
  ];

  const [currentImage, setCurrentImage] = useState(0);

  const [boostNum, setBoostNum] = useState(2);
  const [canBoost, setCanBoost] = useState(true);

  function sendChat(e) {
    e.preventDefault();
    if (text.current.value === "") return;
    if (text.current.value.length > 100) {
      alert("댓글은 100자 이내로 입력해주세요");
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

  // 베스트타임 변환 함수
  function convertTime(time) {
    const [minutes, secondsAndMillis] = time.split(":");
    const [seconds, milliseconds] = secondsAndMillis.split(".");
    const truncatedMillis = milliseconds.slice(0, 2);
    return `${minutes}:${seconds.padStart(2, "0")}:${truncatedMillis.padEnd(
      2,
      "0"
    )}`;
  }

  useEffect(() => {
    // 베스트타임 가져오기
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/record`)
      .then((res) => {
        console.log(res.data);
        const record = res.data;
        record.sort((a, b) => {
          const aTime =
            a.lapTime === "기권" ? Infinity : parseFloat(a.lapTime) * 1000;
          const bTime =
            b.lapTime === "기권" ? Infinity : parseFloat(b.lapTime) * 1000;
          return aTime - bTime;
        });
        setBestTime(convertTime(record[0].lapTime));
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => {
      setIsTutorial(false);
    }, 10000);

    // 미디어 websocket 연결
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

    // 중계 websocket 연결
    const wssConst = new WebSocket("wss://i8a403.p.ssafy.io:8582");

    setStompClient(stompClientConst);
    setWss(wssConst);

    // 종료 시
    return () => {
      socketConst.close();
      wssConst.close();
    };
  }, []);

  useEffect(() => {
    chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
  }, [chats]);

  useEffect(() => {
    if (wss) {
      wss.onmessage = (message) => {
        console.log("get message", message.data);
        const messageObj = JSON.parse(message.data);
        console.log(messageObj);
        console.log(messageObj.status);
        if (messageObj.status === 1) {
          console.log("중계 서버에서 1 받는 데 성공");
          setTimeout(() => {
            setIsRunning(true);
          }, 5000);
          console.log("nickname: ", user.nickname);
          wss.send(user.nickname);
          const intervalId = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
          }, 1000);
          setTimeout(() => {
            clearInterval(intervalId);
          }, 5800);
        }
        if (messageObj.status === 2) {
          console.log("중계 서버에서 2 받는 데 성공");
          dispatch(setPlayEndOpen());
          setTimeout(() => {
            if (!modal.isPlayEndClicked) {
              navigate("/spect");
            }
            dispatch(setIsPlayEndClicked(false));
          }, 10000);
        }
        if (messageObj.status === 3) {
          console.log("중계 서버에서 3 받는 데 성공");
          setCarSpeed(messageObj.speed);
        }
        if (messageObj.status === 4) {
          console.log("중계 서버에서 4 받는 데 성공");
          const result = messageObj.result.split(",");
          let winner, loser, winnerTime, loserTime;
          if (result[1] === "기권") {
            winner = result[2];
            loser = result[0];
            winnerTime = result[3];
            loserTime = result[1];
            0;
          }
          if (result[3] === "기권") {
            winner = result[0];
            loser = result[2];
            winnerTime = result[1];
            loserTime = result[3];
          }
          if (result[1] !== "기권" && result[3] !== "기권") {
            winner = result[1] < result[3] ? result[0] : result[2];
            loser = result[1] < result[3] ? result[2] : result[0];
            winnerTime = result[1] < result[3] ? result[1] : result[3];
            loserTime = result[1] < result[3] ? result[3] : result[1];
          }
          if (winner == user.nickname) {
            setIsWin(true);
          }
          if (loser == user.nickname) {
            setIsWin(false);
          }
          setWinPlayer(winner);
          setLosePlayer(loser);
          setWinPlayerTime(winnerTime);
          setLosePlayerTime(loserTime);
          setShowResult(true);
          setTimeout(() => {
            setShowResult(false);
          }, 10000);
        }
      };

      wss.onclose = function close() {
        console.log("disconnected");
      };
    }
  }, [wss]);

  // 키 입력 (새로운 로직)

  const [upPressed, setUpPressed] = useState(false);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    let interval = null;

    function handleKeyDown(e) {
      if (e.code === "ArrowUp") {
        e.preventDefault();
        setUpPressed(true);
      }
      if (e.code === "ArrowLeft") {
        setLeftPressed(true);
      }
      if (e.code === "ArrowRight") {
        setRightPressed(true);
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        setDownPressed(true);
      }
      if (e.code === "ShiftLeft") {
        setShiftPressed(true);
      }
      if (e.code === "ControlLeft" && boostNum > 0 && canBoost) {
        wss.send(17);
        setBoostNum((prev) => prev - 1);
        setCanBoost(false);
        setIsBoost(true);
        setTimeout(() => {
          setCanBoost(true);
          setIsBoost(false);
        }, 5000);
      }
      if (e.code === "KeyV") {
        setIsTutorial((prev) => !prev);
      }
    }

    function handleKeyUp(e) {
      if (e.code === "ArrowUp") {
        setUpPressed(false);
        wss.send(42);
      }
      if (e.code === "ArrowLeft") {
        setLeftPressed(false);
        wss.send(41);
      }
      if (e.code === "ArrowRight") {
        setRightPressed(false);
        wss.send(41);
      }
      if (e.code === "ArrowDown") {
        setDownPressed(false);
        wss.send(43);
      }
      if (e.code === "ShiftLeft") {
        setShiftPressed(false);
      }
    }

    function handleInterval() {
      if (upPressed) {
        wss.send(38);
      }
      if (leftPressed) {
        wss.send(37);
      }
      if (rightPressed) {
        wss.send(39);
      }
      if (downPressed) {
        wss.send(40);
      }
      if (shiftPressed) {
        wss.send(32);
      }
    }

    if (wss) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      interval = setInterval(handleInterval, 50);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    wss,
    upPressed,
    leftPressed,
    rightPressed,
    downPressed,
    shiftPressed,
    boostNum,
    canBoost,
    isBoost,
  ]);

  // 키 입력 끝 (새로운 로직)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: 950,
        marginTop: "20px",
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PlayVersus />
        <Paper
          elevation={3}
          sx={{
            width: "1003px",
            height: "753px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            elevation={3}
            sx={{
              width: "90%",
              height: "90%",
              position: "relative",
              borderTopRightRadius: "15px",
              borderBottomRightRadius: "15px",
              bgcolor: "black",
            }}
          >
            <Box
              component="img"
              alt="RectangleRacetime"
              src={RectangleRace}
              sx={{
                width: "25%",
                height: "13%",
                opacity: "92%",
                top: "3%",
                position: "absolute",
                zIndex: 1,
              }}
            />
            <Box
              component="h4"
              sx={{
                width: "25%",
                height: "13%",
                top: "3.5%",
                left: "7.5%",
                color: "white",
                position: "absolute",
                zIndex: 1,
              }}
            >
              RACE TIME
            </Box>
            <Box
              sx={{
                width: "25%",
                height: "13%",
                top: "7%",
                left: "7.5%",
                color: "white",
                position: "absolute",
                zIndex: 1,
              }}
            >
              <RaceTime isRunning={isRunning} />
            </Box>
            {showResult ? (
              <Box>
                <Box
                  component="img"
                  alt="RectangleResult"
                  src={RectangleResult}
                  sx={{
                    width: "50%",
                    height: "50%",
                    opacity: "92%",
                    top: "17%",
                    right: "25%",
                    position: "absolute",
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    width: "50%",
                    height: "50%",
                    top: "17%",
                    right: "25%",
                    position: "absolute",
                    zIndex: 1,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th style={{ padding: "8px" }}>Place</th>
                        <th style={{ padding: "8px" }}>Nickname</th>
                        <th style={{ padding: "8px" }}>Lap Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td>{row.place}</td>
                          <td>{row.nickname}</td>
                          <td>{row.laptime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            ) : null}

            <Box
              sx={{
                width: "25%",
                height: "13%",
                top: "2%",
                left: "40%",
                color: "white",
                position: "absolute",
                zIndex: 1,
              }}
            >
              {showResult && isWin ? (
                <Typography variant="h1">WIN</Typography>
              ) : null}
              {showResult && !isWin ? (
                <Typography variant="h1">LOSE</Typography>
              ) : null}
            </Box>
            <Box
              component="img"
              alt="RectangleBest"
              src={RectangleBest}
              sx={{
                width: "20%",
                height: "9%",
                opacity: "85%",
                top: "20%",
                position: "absolute",
                zIndex: 1,
              }}
            />
            <Box
              sx={{
                width: "20%",
                height: "9%",
                top: "19%",
                left: "7.5%",
                color: "white",
                position: "absolute",
                zIndex: 1,
              }}
            >
              <h4>BEST</h4>
            </Box>
            <Box
              component="h4"
              sx={{
                width: "25%",
                height: "13%",
                top: "22%",
                left: "7.5%",
                color: "white",
                position: "absolute",
                zIndex: 1,
              }}
            >
              {bestTime}
            </Box>
            {isBoost && (
              <Alert
                severity="error"
                sx={{
                  top: "-1.5%",
                  right: "40%",
                  position: "absolute",
                  zIndex: 1,
                }}
              >
                부스터 사용 중
              </Alert>
            )}
            <Box
              component="img"
              alt="rhombusPlace"
              src={CarHandle}
              sx={{
                width: "35%",
                height: "40%",
                top: "58%",
                right: "0%",
                position: "absolute",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
              }}
            />
            <Typography
              variant="h3"
              sx={{
                position: "absolute",
                top: "73%",
                right: "16%",
                zIndex: 1,
              }}
            >
              &nbsp;{carSpeed}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                position: "absolute",
                top: "79.5%",
                right: "14%",
                zIndex: 1,
              }}
            >
              km/h
            </Typography>
            <Button
              sx={{
                width: "13%",
                height: "6%",
                top: "84%",
                right: "10.5%",
                position: "absolute",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                color: "black",
                bgcolor: "white",
              }}
              disabled
            >
              BOOST : {boostNum}
            </Button>
            <Box
              sx={{
                width: "25%",
                height: "20%",
                top: "-1.4%",
                right: "-3.6%",
                position: "absolute",
                zIndex: 1,
              }}
            >
              <SmallViewer3 />
            </Box>
            <Box
              sx={{
                width: "26%",
                height: "50%",
                bottom: "0",
                position: "absolute",
                bgcolor: "black",
                color: "white",
                opacity: "0.5",
                zIndex: 1,
              }}
            >
              <Box
                id="chat"
                sx={{
                  width: "100%",
                  height: "87%",
                  maxHeight: 300,
                  overflow: "auto",
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
              <Box
                display="flex"
                sx={{
                  height: "10%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <form
                  onSubmit={sendChat}
                  style={{
                    display: "flex",
                  }}
                >
                  <input
                    ref={text}
                    style={{
                      width: "100%",
                      padding: "10px 30px",
                    }}
                    type="text"
                    placeholder="채팅을 입력하세요"
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "10px",
                      width: "80px",
                    }}
                  >
                    <SendIcon
                      sx={{
                        width: "50px",
                      }}
                    />
                  </button>
                </form>
              </Box>
            </Box>

            {isTutorial && (
              <Box
                component="img"
                alt="tutorial"
                src={tutorial}
                sx={{
                  width: "40%",
                  height: "50%",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  opacity: "60%",
                  zIndex: 1,
                }}
              />
            )}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                bottom: "10px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      zIndex: 1,
                      width: "20%",
                      height: "30%",
                    }}
                    component="img"
                    alt="slide"
                    src={images[currentImage]}
                  />
                </Box>
                <Viewer2 />
                <PlayEndModal />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default NewPlayPage2;
