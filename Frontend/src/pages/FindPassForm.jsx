import * as React from "react";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid } from "@mui/material";
import FullWidthTextField from "../components/FullWidthTextField";
import ArrowButton from "../components/ArrowButton";

export default function FormPropsTextFields() {
  const theme = createTheme({
    palette: {
      white: "#ffffff",
      gray: "#f2f2f2",
    },
  });
  return (
    <Box
      justifyContent="center"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
        },
        height: 300,
        marginTop: "200px",
        marginBottom: "200px",
      }}
    >
      <Box sx={{ border: "solid 1px black" }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "30vh", minWidth: "60vh" }}
        >
          <h2>비밀번호 찾기</h2>
          <ThemeProvider theme={theme}>
            <FullWidthTextField
              error
              id="outlined-error-helper-text"
              label="Error"
              defaultValue="Hello World"
              helperText="Incorrect entry."
              content="이메일"
            />
            <br />
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { t: 10, m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <ArrowButton
                type="submit"
                sx={{
                  width: 300,
                  height: 50,
                }}
              >
                메일 전송
              </ArrowButton>
            </Box>
          </ThemeProvider>
        </Grid>
      </Box>
    </Box>
  );
}
