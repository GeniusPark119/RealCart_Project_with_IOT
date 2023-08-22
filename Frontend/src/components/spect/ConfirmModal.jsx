import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { setConfirmClose } from "../../store/modalSlice";

function ConfirmModal() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  return (
    <Modal
      open={modal.confirmOpen}
      onClose={() => {
        dispatch(setConfirmClose());
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
          <h2>대기 신청이 완료되었습니다.</h2>
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
              width: "100%",
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
                dispatch(setConfirmClose());
              }}
            >
              확인
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ConfirmModal;
