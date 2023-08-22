import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "../../util/axiosInstance";
import {
  setReceptionClose,
  setConfirmOpen,
  setEntryOpen,
  setEntryClose,
  setRoomId,
  setIsPlay,
  setIsWait,
} from "../../store/modalSlice";

function ReceptionModal() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const queue = useSelector((state) => state.queue);
  const modal = useSelector((state) => state.modal);

  const navigate = useNavigate();
  return (
    <Modal
      open={modal.receptionOpen}
      onClose={() => {
        dispatch(setReceptionClose());
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
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
            <h2>현재 대기자 수는 {queue.queueLength} 명입니다.</h2>
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
                  axios
                    .get(
                      `${process.env.REACT_APP_BACKEND_URL}/game/participate?nickname=${user.nickname}`
                    )
                    .then((res) => {
                      if (res.data === -100) {
                        dispatch(setReceptionClose());
                        alert("게임 도중 기권했거나 유효하지 않은 유저입니다.");
                        dispatch(setIsWait(false));
                      } else if (res.data === -1) {
                        dispatch(setReceptionClose());
                        dispatch(setIsWait(false));
                        dispatch(setRoomId(1));
                        dispatch(setEntryOpen());
                        dispatch(setIsPlay(true));
                        setTimeout(() => {
                          navigate(`/play/1`);
                          dispatch(setEntryClose());
                          dispatch(setRoomId(null));
                        }, 10000);
                      } else if (res.data === -2) {
                        dispatch(setReceptionClose());
                        dispatch(setIsWait(false));
                        dispatch(setRoomId(2));
                        dispatch(setEntryOpen());
                        dispatch(setIsPlay(true));
                        setTimeout(() => {
                          navigate(`/play/2`);
                          dispatch(setEntryClose());
                          dispatch(setRoomId(null));
                        }, 10000);
                      } else {
                        dispatch(setReceptionClose());
                        dispatch(setConfirmOpen());
                        dispatch(setIsWait(true));
                      }
                    });
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
                onClick={() => {
                  dispatch(setReceptionClose());
                }}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ReceptionModal;
