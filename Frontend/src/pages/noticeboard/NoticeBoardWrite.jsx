import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../util/axiosInstance";
import AppButton from "../../components/AppButton";
import AppBlackButton from "../../components/AppBlackButton";

function FreeBoardWrite() {
  const titleRef = useRef();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (eState) => {
    setEditorState(eState);
  };

  const user = useSelector((state) => state.login.user);

  const handleSubmit = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const data = {
      title: titleRef.current.value,
      content: JSON.stringify(rawContentState),
      nickname: user.nickname,
    };
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/board/notice`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/noticeBoard");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 700,
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: "10%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" flexGrow={1}>
          공지사항
        </Typography>
      </Box>
      <Box
        sx={{
          width: "80%",
          height: "15%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTop: 2,
          borderBottom: 3,
        }}
      >
        <TextField
          placeholder="제목을 입력하세요"
          inputRef={titleRef}
          sx={{
            width: "100%",
          }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            height: "80%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              border: 1,
              padding: "2px",
              minHeight: "400px",
            }}
          >
            <Editor
              wrapperStyle={{ margin: "10px" }}
              placeholder="내용을 작성해주세요."
              localization={{ locale: "ko" }}
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "20%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "80%",
              height: "30%",
              display: "flex",
              justifyContent: "end",
              alignContent: "end",
              marginTop: "30px",
            }}
          >
            <Box flexGrow={1} />
            <Link
              to="/noticeboard"
              style={{ color: "black", textDecoration: "none" }}
            >
              <AppButton
                sx={{
                  width: "100px",
                  height: "40px",
                  marginRight: "10px",
                  border: 1,
                }}
              >
                취소
              </AppButton>
            </Link>
            <AppBlackButton
              sx={{
                width: "100px",
                height: "40px",
                bgcolor: "black",
                borderRadius: "5px",
              }}
              onClick={handleSubmit}
            >
              등록
            </AppBlackButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FreeBoardWrite;
