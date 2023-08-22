import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { setForbidClose } from "../../store/modalSlice";

function ForbidModal() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  return (
    <Modal
      open={modal.forbidOpen}
      onClose={() => {
        dispatch(setForbidClose());
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
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
            >
              현재 게임에 참여중이기 때문에
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
            >
              대기할 수 없습니다.
            </Typography>
          </Stack>
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
                dispatch(setForbidClose());
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

export default ForbidModal;
