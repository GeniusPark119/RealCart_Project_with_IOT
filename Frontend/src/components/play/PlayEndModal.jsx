import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { setPlayEndClose, setIsPlayEndClicked } from "../../store/modalSlice";

function PlayEndModal() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const navigate = useNavigate();
  return (
    <Modal
      open={modal.playEndOpen}
      onClose={() => {
        dispatch(setPlayEndClose());
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
            <h2>게임이 종료되었습니다.</h2>
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
                  dispatch(setPlayEndClose());
                  dispatch(setIsPlayEndClicked(true));
                  navigate("/spect");
                }}
              >
                관전페이지로
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
                  dispatch(setPlayEndClose());
                  dispatch(setIsPlayEndClicked(true));
                  navigate("/myPage");
                }}
              >
                마이페이지로
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default PlayEndModal;
