import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "../../util/axiosInstance";
import { setQueue, setPlayer } from "../../store/queueSlice";

function EntryQueue({ queue }) {
  const dispatch = useDispatch();
  // 대기열 메뉴의 anchorEl
  const [anchorEl, setAnchorEl] = useState(null);
  // 대기열 메뉴를 열고 닫는 상태
  const queueOpen = Boolean(anchorEl);
  // 대기열 메뉴의 옵션
  const [options, setOptions] = useState(["1 - "]);
  // 대기열 메뉴의 selectedIndex
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const endIndexInterval = setInterval(() => {
      setSelectedIndex((selectedIndex + 1) % options.length);
    }, 5000);
    return () => {
      clearInterval(endIndexInterval);
    };
  }, [selectedIndex, options.length]);

  useEffect(() => {
    const endUpdateQueue = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/game/queue`)
        .then((res) => {
          dispatch(setQueue(res.data));
        });
    }, 2000);

    const endUpdatePlayer = setInterval(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/game`).then((res) => {
        dispatch(setPlayer(res.data));
      });
    }, 2000);

    return () => {
      clearInterval(endUpdateQueue);
      clearInterval(endUpdatePlayer);
    };
  }, [dispatch]);

  // currentQueue가 변경되면 options를 업데이트
  useEffect(() => {
    const sliceQueue = [];
    for (let i = 0; i < queue.queueLength; i += 2) {
      sliceQueue.push(
        `${i / 2 + 1} : ${queue.splitQueue.slice(i, i + 2).join(" vs ")}`
      );
    }
    if (sliceQueue.length === 0) {
      setOptions(["1 : "]);
    }
    if (queue.currentQueue) {
      setOptions(sliceQueue);
    }
  }, [queue]);

  // 메뉴 버튼을 클릭하면 anchorEl을 설정
  const handleClickListItem = (event) => {
    if (event.currentTarget instanceof Element) {
      setAnchorEl(event.currentTarget);
    }
  };
  // 메뉴 아이템을 클릭하면 해당 아이템의 인덱스를 selectedIndex에 저장
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };
  // 메뉴를 닫으면 anchorEl을 null로 설정
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      sx={{
        width: "35%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "rgba(6, 24, 44, 0.4) 0px 0px 0px 1px, rgba(6, 24, 44, 0.65) 0px 2px 3px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",

        borderTopRightRadius: "15px",
        borderBottomRightRadius: "15px",
      }}
    >
      <Box
        elevation={3}
        sx={{
          display: "flex",
          height: "60%",
          width: "95%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <List
          component="nav"
          // aria-label="Device settings"
          sx={{
            width: "70%",
            height: "60%",
          }}
        >
          <ListItem
            button
            key={options[0].id}
            id="lock-button"
            aria-expanded={queueOpen ? "true" : undefined}
            onClick={handleClickListItem}
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <ListItemText primary={options[selectedIndex]} />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={queueOpen}
          onClose={handleClose}
          MenuListProps={{
            role: "listbox",
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              disabled={index === selectedIndex}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}

EntryQueue.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  queue: propTypes.object.isRequired,
};

export default EntryQueue;
