import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Poster1() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        color: "#171717",
        display: "flex",
        justifyContent: "center",
        align: "center",
        fontSize: "40px",
        marginTop: "20px",
        flexDirection: "column",
      }}
    >
      다음 게임을 준비 중입니다...
      <Typography variant="h5" component="p">
        광고문의 : 2023-0217
      </Typography>
      <Box sx={{ fontSize: "100px" }}>🚗</Box>
    </Box>
  );
}

export default Poster1;
