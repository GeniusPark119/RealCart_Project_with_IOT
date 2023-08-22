import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "../../util/axiosInstance";
import { setPlayer, setRank1, setRank2 } from "../../store/queueSlice";
import { setA, setB } from "../../store/betSlice";

function PlayVersus() {
  const dispatch = useDispatch();
  const queue = useSelector((state) => state.queue);
  const bet = useSelector((state) => state.bet);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/game`).then((res) => {
      dispatch(setPlayer(res.data));
    });
    const endGetName = setTimeout(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/game`).then((res) => {
        dispatch(setPlayer(res.data));
      });
    }, 10000);
    return () => clearTimeout(endGetName);
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/record/best/${queue.player1}`)
      .then((res) => {
        dispatch(setRank1(res.data));
      });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/record/best/${queue.player2}`)
      .then((res) => {
        dispatch(setRank2(res.data));
      });
  }, [queue, dispatch]);

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
  }, [bet, dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "7%",
        display: "flex",
        marginBottom: "30px",
        borderRadius: "15px",

        boxShadow:
          "rgba(6, 24, 44, 0.4) 0px 0px 0px 1px, rgba(6, 24, 44, 0.65) 0px 2px 3px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
      }}
    >
      <Box
        sx={{
          width: "75%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "95%",
            height: "90%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            <Box
              sx={{
                width: "45%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "70%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  display="flex"
                  sx={{
                    height: "100%",
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    Red
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  sx={{
                    height: "100%",
                    width: "70%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {queue.player1}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "30%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "orange",
                }}
              >
                <h2>랭킹 {queue.rank1}위</h2>
              </Box>
            </Box>
            <Box
              sx={{
                width: "10%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2>vs</h2>
            </Box>
            <Box
              sx={{
                width: "45%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "70%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  display="flex"
                  sx={{
                    height: "100%",
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  >
                    Blue
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  sx={{
                    height: "100%",
                    width: "70%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {queue.player2}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "30%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "orange",
                }}
              >
                <h2>랭킹 {queue.rank2}위</h2>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "25%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#303038",
          borderTopRightRadius: "15px",
          borderBottomRightRadius: "15px",
          boxShadow:
            "rgba(6, 24, 44, 0.4) 0px 0px 0px 1px, rgba(6, 24, 44, 0.65) 0px 2px 3px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
        }}
      >
        <Box
          sx={{
            width: "95%",
            height: "90%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "60%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            배팅현황
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "40%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
                height: "90%",
                display: "flex",
                borderRadius: "5px",
                border: "solid 1px #E8E8E8",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "solid 2px #E8E8E8",
                  color: "white",
                }}
              >
                Red {bet.betA}명
              </Box>
              <Box
                sx={{
                  width: "50%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                Blue {bet.betA}명
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PlayVersus;
