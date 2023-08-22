import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { setEntryClose, setRoomId } from "../../store/modalSlice";

function EntryModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modal = useSelector((state) => state.modal);
  return (
    <Modal
      open={modal.entryOpen}
      onClose={() => {
        dispatch(setEntryClose());
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
            bgcolor: "white",
            color: "#333333",
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
            <Typography variant="h5">당신의 차례가 되었습니다.</Typography>
            <Typography variant="h5">입장해주세요.</Typography>
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
                navigate(`/play/${modal.roomId}`);
                dispatch(setEntryClose());
                dispatch(setRoomId(null));
              }}
            >
              입장
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default EntryModal;
