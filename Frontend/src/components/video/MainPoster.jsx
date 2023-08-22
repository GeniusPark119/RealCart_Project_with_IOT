import React from "react";
import Box from "@mui/material/Box";

function Poster1() {
  return (
    <Box
      sx={{
        width: "800px",
        height: "600px",
        bgcolor: "#171717",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
      }}
    >
      다음 게임을 준비 중입니다...
      <Box sx={{ fontSize: "100px" }}>🚗</Box>
    </Box>
  );
}

export default Poster1;
