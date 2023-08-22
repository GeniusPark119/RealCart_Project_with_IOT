import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

function NewContent({
  setWait,
  handleModalOpen,
  handleModalClose,
  setIsReady,
}) {
  return (
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
              handleModalClose();
              setIsReady(true);
              setTimeout(() => {
                setIsReady(false);
              }, 15000);
              setTimeout(() => {
                setWait(0);
              }, 5000);
              setTimeout(() => {
                handleModalOpen();
              }, 5000);
              setTimeout(() => {
                handleModalClose();
              }, 15000);
            }}
          >
            확인
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

NewContent.propTypes = {
  setWait: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  setIsReady: PropTypes.func.isRequired,
};

export default NewContent;
