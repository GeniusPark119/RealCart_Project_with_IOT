import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import axios from "../../util/axiosInstance";
import { betOnA, betOnB, setA, setB } from "../../store/betSlice";

// 배팅 창 컴포넌트
function BetWindow() {
  // redux store에서 배팅 정보를 가져옴
  const user = useSelector((state) => state.login.user);
  const bet = useSelector((state) => state.bet);
  const dispatch = useDispatch();
  // 배팅 비율을 계산하여 저장
  const [proportionA, setProportionA] = useState(0.5);
  const [proportionB, setProportionB] = useState(0.5);
  const [rcolor, setRColor] = useState("white");
  const [bcolor, setBColor] = useState("white");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/game/bet`)
      .then((response) => {
        dispatch(setA(response.data.red));
        dispatch(setB(response.data.blue));
      })
      .catch((error) => {
        console.error(error);
      });
    const endBet = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/game/bet`)
        .then((response) => {
          dispatch(setA(response.data.red));
          dispatch(setB(response.data.blue));
        })
        .catch((error) => {
          console.error(error);
        });
    }, 5000);
    return () => clearInterval(endBet);
  }, []);

  useEffect(() => {
    if (bet.betA + bet.betB !== 0) {
      setProportionA(bet.betA / (bet.betA + bet.betB));
      setProportionB(bet.betB / (bet.betA + bet.betB));
    }
  }, [bet]);

  const handleRHover = () => {
    setRColor("#F52A54");
  };

  const handleROut = () => {
    setRColor("white");
  };
  const handleBHover = () => {
    setBColor("#4236F5");
  };
  const handleBOut = () => {
    setBColor("white");
  };

  return (
    <Box
      display="flex"
      sx={{
        width: "100%",
        height: "25%",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "90%",
        }}
      >
        <Box
          display="flex"
          sx={{
            width: "100%",
            height: "30%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          배팅상황
        </Box>
        <Box
          display="flex"
          sx={{
            width: "100%",
            height: "40%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            display="flex"
            sx={{
              width: "80%",
              height: "100%",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                width: `${Math.max(proportionA * 70 + 30, 30)}%`,
              }}
            >
              <Button
                onClick={() => {
                  if (user && !bet.isBet) {
                    dispatch(betOnA());
                    const data = { teamId: 1 };
                    axios
                      .post(
                        `${process.env.REACT_APP_BACKEND_URL}/game/up`,
                        data
                      )
                      .then(() => {
                        axios
                          .get(`${process.env.REACT_APP_BACKEND_URL}/game/bet`)
                          .then((response) => {
                            dispatch(setA(response.data.red));
                            dispatch(setB(response.data.blue));
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "#F52A54",
                  color: rcolor,
                }}
                onMouseOver={handleRHover}
                onMouseOut={handleROut}
              >
                Red
              </Button>
            </Paper>
            <Paper
              elevation={3}
              sx={{
                width: `${Math.max(proportionB * 70 + 30, 30)}%`,
                animation: "widthChange 0.5s ease-in-out",
              }}
              onMouseOver={handleBHover}
              onMouseOut={handleBOut}
            >
              <Button
                onClick={() => {
                  if (user && !bet.isBet) {
                    dispatch(betOnB());
                    const data = { teamId: 2 };
                    axios
                      .post(
                        `${process.env.REACT_APP_BACKEND_URL}/game/up`,
                        data
                      )
                      .then(() => {
                        axios
                          .get(`${process.env.REACT_APP_BACKEND_URL}/game/bet`)
                          .then((response) => {
                            dispatch(setA(response.data.red));
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "#4236F5",
                  color: bcolor,
                }}
              >
                Blue
              </Button>
            </Paper>
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            width: "100%",
            height: "30%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            display="flex"
            sx={{
              width: "50%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {bet.betA}명
          </Box>
          <Box
            display="flex"
            sx={{
              width: "50%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {bet.betB}명
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default BetWindow;
