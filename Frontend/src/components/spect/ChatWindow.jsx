import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import propTypes from "prop-types";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";

// 채팅 창 컴포넌트
function ChatWindow({ sendChat }) {
  // 채팅 입력창의 ref
  const textRef = useRef();
  // 채팅창의 ref
  const chatRef = useRef();
  // redux store에서 채팅 정보를 가져옴
  const chatList = useSelector((state) => state.chat.chatList);

  // 채팅창을 최하단으로 스크롤
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatList]);

  return (
    <Box
      display="flex"
      sx={{
        width: "100%",
        height: "50%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "100%",
        }}
      >
        <Box
          id="chat"
          sx={{
            width: "99.2%",
            height: "90%",
            maxHeight: 315,
            overflow: "auto",
            border: "solid 1px #E8E8E8",
          }}
          ref={chatRef}
        >
          <ul style={{ listStyleType: "none" }}>
            {chatList.map((item) => (
              <li key={item.id}>{item}</li>
            ))}
          </ul>
        </Box>
        <Box
          display="flex"
          sx={{
            height: "10%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={() => {
              sendChat(textRef.current.value);
              textRef.current.value = "";
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              ref={textRef}
              type="text"
              style={{
                width: "70%",
                padding: "15px 30px",
                border: "solid 1px #E8E8E8",
              }}
              placeholder="채팅을 입력하세요"
            />
            <button
              type="submit"
              style={{
                width: "40%",
                padding: "10px",
                border: "solid 1px #E8E8E8",
              }}
            >
              <SendIcon />
            </button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

ChatWindow.propTypes = {
  sendChat: propTypes.func.isRequired,
};

export default ChatWindow;
