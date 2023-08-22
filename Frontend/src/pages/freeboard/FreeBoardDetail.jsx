import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Textarea from "@mui/joy/Textarea";
import Pagination from "@mui/material/Pagination";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import axios from "../../util/axiosInstance";
import AppButton from "../../components/AppButton";
import AppBlackButton from "../../components/AppBlackButton";
import Logo from "../../assets/logo.png";
import CommentBox from "../../components/CommentBox";

function FreeBoardDetail() {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [comments, setComments] = useState([]);
  const [searchParams] = useSearchParams();
  const no = Number(searchParams.get("no"));
  const [chat, setChat] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [nickname, setNickname] = useState("");
  const [date, setDate] = useState("");
  const [isUser, setIsUser] = useState("none");

  const onChangePage = (event, value) => {
    setPage(value - 1);
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/board/free/${no}`)
      .then((res) => {
        const article = res.data;

        let resContent = article.content;
        try {
          resContent = JSON.parse(resContent);
          resContent = draftToHtml(resContent);
        } finally {
          setContent(resContent);
        }
        setTitle(article.title);
        setNickname(article.nickname);
        setDate(new Date(article.createdTime).toLocaleDateString());
        setCommentsCount(article.comments.length);
        if (user.nickname === article.nickname) {
          setIsUser("");
        } else {
          setIsUser("none");
        }

        if (article.comments.length === 0) {
          setComments([
            [
              {
                content: "댓글이 없습니다.",
                nickname: "-",
              },
            ],
          ]);
        } else {
          const numberOfArticlesPerUnit = 5;
          const numberOfUnits = Math.ceil(
            article.comments.length / numberOfArticlesPerUnit
          );
          const List = [];
          for (let i = 0; i < numberOfUnits; i += 1) {
            List.push(
              article.comments.slice(
                i * numberOfArticlesPerUnit,
                (i + 1) * numberOfArticlesPerUnit
              )
            );
          }
          setComments(List);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/board/free/${no}`, {})
      .then((response) => {
        navigate("/freeboard");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onChange = (event) => {
    setCount(chat.replace(/<br\s*\/?>/gm, "\n").length);
    if (count > 100) {
      alert("100자까지만 작성할 수 있습니다.");
    } else {
      setChat(event.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (chat === "") return;
    const data = {
      content: e.target[0].value,
      nickname: user.nickname,
    };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/board/free/${no}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    setChat("");
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          height: "150vh",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            height: "20%",
            width: "100%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              borderTop: "solid 1px black",
              borderBottom: "solid 1px black",
              height: "100%",
              width: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              component="h1"
              sx={{
                marginBottom: "10px",
                fontWeight: "400",

                marginLeft: "100px",
              }}
            >
              {title}
            </Box>

            <Box component="span" sx={{ marginLeft: "100px" }}>
              {date}
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "solid 1px black",
              borderBottom: "solid 1px black",
              borderLeft: "solid 1px black",
              height: "100%",
              width: "20%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              alt="logo"
              src={Logo}
              sx={{
                height: 100,
                width: 100,
              }}
            />
            <Box component="h2">{nickname}</Box>
          </Box>
        </Box>
        <Box
          sx={{
            height: "30%",
            width: "100%",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "200px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link to="/freeBoard">
            <AppButton sx={{ border: "solid 1px black", marginRight: "10px" }}>
              목록
            </AppButton>
          </Link>
          <Link to={`/freeBoard/modify?no=${no}`}>
            <AppBlackButton
              sx={{ display: isUser, borderRadius: "5px", marginRight: "10px" }}
            >
              수정
            </AppBlackButton>
          </Link>
          <AppBlackButton
            sx={{ display: isUser, borderRadius: "5px" }}
            onClick={handleDelete}
          >
            삭제
          </AppBlackButton>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Box component="h3" sx={{ fontWeight: "400", marginLeft: "20px" }}>
            댓글 :
          </Box>
          <Box component="h3" sx={{ fontWeight: "500", marginLeft: "20px" }}>
            {commentsCount} 개
          </Box>
        </Box>
        <Box
          sx={{
            height: "15%",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Box
            sx={{
              height: "20%",
              width: "100%",
            }}
          >
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
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onSubmit={onSubmit}
              >
                <Textarea
                  onChange={onChange}
                  type="text"
                  maxLength="200"
                  style={{
                    width: "98%",
                    height: "100px",
                    border: "solid 1px #E8E8E8",
                    marginTop: "70px",
                    padding: " 5px",
                  }}
                  placeholder="저작권 등 다른 사람의 권리를 침해하거나 명예를 훼손하는 게시물은 이용약관 및 관련 법률에 의해 제재를 받을 수 있습니다.&#13;&#10;건전한 토론 문화와 양질의 댓글 문화를 위해, 타인에게 불쾌감을 주는 욕설 또는 특정 계측/민족, 종교 등을 비하하는 단어들은 신고의 대상이 될 수 있습니다."
                />

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Box
                    sx={{
                      width: "95%",
                    }}
                  >
                    {count}/100
                  </Box>
                  <AppButton type="submit">등록</AppButton>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>

        {comments[page].map((comment) => (
          <CommentBox
            sx={{
              width: "100%",
            }}
            no={no}
            id={comment.id}
            content={comment.content}
            author={comment.nickname}
            date={new Date(comment.createdTime).toLocaleDateString()}
          />
        ))}
        <Pagination
          count={comments.length}
          variant="outlined"
          shape="rounded"
          onChange={onChangePage}
          sx={{
            margin: 2,
          }}
        />
      </Box>
    </Box>
  );
}

export default FreeBoardDetail;
