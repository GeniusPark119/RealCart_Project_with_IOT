import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import AppButton from "./AppButton";
import { logout } from "../store/loginSlice";
import logo from "../assets/logo.png";
import "../index.css";

function AppHeader() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.login.user);

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access-token");
    dispatch(logout());
    setAnchorEl2(null);
  };

  const useb = () => {
    if (user) {
      return (
        <Box>
          <AppButton sx={{ width: 150, height: 70 }} onClick={handleClick2}>
            {user.nickname}
          </AppButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={handleClose2}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={handleClose2}
              sx={{
                width: 150,
                height: 50,
                display: "flex",
                justifyContent: "center",
                borderTop: "solid 1px #f2f2f2",
              }}
            >
              <Link
                to="/myPage"
                style={{
                  color: " black",
                  textDecoration: "none",
                }}
              >
                마이페이지
              </Link>
            </MenuItem>
            <Link
              to="/"
              style={{
                color: "black",
                textDecoration: "none",
              }}
            >
              <MenuItem
                sx={{
                  borderBottom: "solid 1px  #f2f2f2",
                  borderTop: "solid 1px  #f2f2f2",
                  width: 150,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  color: " black",
                }}
                onClick={handleLogout}
              >
                로그아웃
              </MenuItem>
            </Link>
          </Menu>
        </Box>
      );
      // eslint-disable-next-line no-else-return
    } else {
      return (
        <Link to="/login" style={{ textDecoration: "none" }}>
          <AppButton sx={{ width: 150, height: 70 }}>LOGIN</AppButton>
        </Link>
      );
    }
  };
  return (
    <Box
      sx={{
        height: 100,
      }}
    >
      <AppBar
        elevation={0}
        sx={{
          borderBottom: "solid 1px #dedfe0",
          bgcolor: "white",
        }}
      >
        <Toolbar>
          <Link to="/">
            <Box
              component="img"
              alt="logo"
              src={logo}
              sx={{
                height: 90,
                margin: "5px 20px",
              }}
            />
          </Link>
          <Box flexGrow={1} />
          <Link to="/spect" style={{ color: " black", textDecoration: "none" }}>
            <AppButton sx={{ width: 150, height: 70 }}>RACE</AppButton>
          </Link>
          <AppButton sx={{ width: 150, height: 70 }} onClick={handleClick1}>
            BOARD
          </AppButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl1}
            open={Boolean(anchorEl1)}
            onClose={handleClose1}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link
              to="/noticeBoard"
              style={{ color: "black", textDecoration: "none" }}
            >
              <MenuItem
                onClick={handleClose1}
                sx={{
                  width: 150,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "solid 1px #f2f2f2",
                  color: " black",
                }}
              >
                공지사항
              </MenuItem>
            </Link>
            <Link
              to="/freeBoard"
              style={{
                color: "black",
                textDecoration: "none",
              }}
            >
              <MenuItem
                onClick={handleClose1}
                sx={{
                  borderBottom: "solid 1px  #f2f2f2",
                  borderTop: "solid 1px  #f2f2f2",
                  width: 150,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  color: " black",
                }}
              >
                자유게시판
              </MenuItem>
            </Link>
            <Link
              to="/reportBoard"
              style={{ color: "black", textDecoration: "none" }}
            >
              <MenuItem
                onClick={handleClose1}
                sx={{
                  width: 150,
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: "solid 1px  #f2f2f2",
                  color: " black",
                }}
              >
                문의
              </MenuItem>
            </Link>
          </Menu>
          <Box>{useb()}</Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppHeader;
