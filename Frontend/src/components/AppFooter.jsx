import React from "react";
import { Box, Grid, Divider, Toolbar, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import footerLogo from "../assets/footer_logo.png";

function AppFooter() {
  return (
    <Box>
      <Toolbar
        sx={{
          height: 150,
          bgcolor: "white",
        }}
      >
        <Grid container>
          <Grid item xs={10}>
            <Box
              component="img"
              alt="logo"
              src={footerLogo}
              sx={{
                height: 50,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              sx={{
                color: "black",
              }}
            >
              서비스 소개
            </Button>
            <Button
              sx={{
                color: "black",
              }}
            >
              이용약관
            </Button>
            <Button
              sx={{
                color: "black",
              }}
            >
              문의
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <br />
          <Grid item xs={10}>
            <Box
              sx={{
                margin: 1,
              }}
            >
              © RealCart All Rights Reserved.
            </Box>
          </Grid>
          <Grid item xs={2}>
            <FacebookIcon
              sx={{
                margin: 1,
              }}
            />
            <TwitterIcon
              sx={{
                margin: 1,
              }}
            />

            <InstagramIcon
              sx={{
                margin: 1,
              }}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </Box>
  );
}

export default AppFooter;
