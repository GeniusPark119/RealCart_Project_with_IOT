import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import propTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { setPlayer } from "../../store/queueSlice";

// eslint-disable-next-line no-unused-vars
function Versus({ queue }) {
  const queue2 = useSelector((state) => state.queue);
  const dispatch = useDispatch();
  useEffect(() => {
    const endGetGame = setInterval(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/game`).then((res) => {
        dispatch(setPlayer(res.data));
      });
    }, 10000);
    return () => {
      clearInterval(endGetGame);
    };
  }, [queue2, dispatch]);
  return (
    <Box
      display="flex"
      sx={{
        width: "65%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: "15px",
        borderBottomLeftRadius: "15px",
        boxShadow:
          "rgba(6, 24, 44, 0.4) 0px 0px 0px 1px, rgba(6, 24, 44, 0.65) 0px 2px 3px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
      }}
    >
      <Box
        elevation={0}
        sx={{
          display: "flex",
          height: "60%",
          width: "95%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          display="flex"
          sx={{
            height: "100%",
            width: "45%",
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
                color: "#F52A54",
                fontWeight: "bold",
              }}
            >
              RED
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
              {queue2.player1}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          sx={{
            height: "100%",
            width: "10%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#2E4B8A",
            }}
          >
            vs
          </h2>
        </Box>
        <Box
          display="flex"
          sx={{
            height: "100%",
            width: "45%",
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
                color: "#4236F5",
                fontWeight: "bold",
              }}
            >
              BLUE
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
              {queue2.player2}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

Versus.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  queue: propTypes.object.isRequired,
};

export default Versus;
