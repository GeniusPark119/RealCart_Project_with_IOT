import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import axios from "../util/axiosInstance";
import NewContent from "./NewContent";

function InitialContent({
  wait,
  setWait,
  handleModalOpen,
  handleModalClose,
  setIsReady,
  setSelectedIndex,
  options,
  nickname,
}) {
  const [isInitial, setIsInitial] = useState(true);

  const handleWait = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/game/participate?nickname=${nickname}`
      )
      .then((res) => {
        console.log(res.data);
        switch (res.data) {
          case "-1":
            console.log("1번유저");
            setIsReady(true);
            break;
          case "-2":
            console.log("2번유저");
            setIsReady(true);
            break;
          case "-100":
            console.log("에러");
            break;
          default:
            setIsInitial(false);
            console.log("대기");
            break;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Box>
      {isInitial ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            width: "25%",
            height: "25%",
          }}
        >
          <Box
            display="flex"
            sx={{
              width: "100%",
              height: "55%",
              justifyContent: "center",
              alignItems: "end",
            }}
          >
            <h2>현재 대기자 수는 {wait} 명입니다.</h2>
          </Box>
          <Box
            display="flex"
            sx={{
              width: "100%",
              height: "45%",
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
              <Button
                variant="contained"
                sx={{
                  width: "50%",
                  height: "35%",
                  bgcolor: "white",
                  color: "black",
                }}
                onClick={() => {
                  setSelectedIndex(options.length);
                  handleWait();
                }}
              >
                대기하기
              </Button>
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
              <Button
                variant="contained"
                sx={{
                  width: "50%",
                  height: "35%",
                  bgcolor: "white",
                  color: "black",
                }}
                onClick={handleModalClose}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <NewContent
          setWait={setWait}
          handleModalOpen={handleModalOpen}
          handleModalClose={handleModalClose}
          setIsReady={setIsReady}
        />
      )}
    </Box>
  );
}

InitialContent.propTypes = {
  wait: PropTypes.number.isRequired,
  setWait: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  setIsReady: PropTypes.func.isRequired,
  setSelectedIndex: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array.isRequired,
  nickname: PropTypes.string.isRequired,
};

export default InitialContent;
