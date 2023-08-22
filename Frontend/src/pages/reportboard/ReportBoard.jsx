import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import axios from "../../util/axiosInstance";
import AppBlackButton from "../../components/AppBlackButton";
import ReportBox from "../../components/ReportBox";
import ReportBoxTitle from "../../components/ReportBoxTitle";

function ReportBoard() {
  const [page, setPage] = useState(0);

  const onChangePage = (event, value) => {
    setPage(value);
  };

  const [loading, setLoading] = useState(true);
  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/board/report`)
      .then((res) => {
        console.log(res);
        const articles = res.data;
        if (articles.length === 0) {
          setArticleList([
            [
              {
                id: "-",
                title: "게시글이 없습니다.",
                nickname: "-",
                hit: "-",
              },
            ],
          ]);
        } else {
          const numberOfArticlesPerUnit = 10;
          const numberOfUnits = Math.ceil(
            articles.length / numberOfArticlesPerUnit
          );
          const List = [];
          for (let i = 0; i < numberOfUnits; i += 1) {
            List.push(
              articles.slice(
                i * numberOfArticlesPerUnit,
                (i + 1) * numberOfArticlesPerUnit
              )
            );
          }
          console.log(articles);
          setArticleList(List);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 700,
        marginTop: "20px",
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: "10%",
          display: "flex",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5" flexGrow={1} sx={{ color: "#34343C" }}>
          문의게시판
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "80%",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ReportBoxTitle
            sx={{
              width: "80%",
            }}
            board="reportboard"
            no="번호"
            title="제목"
            author="작성자"
            date="등록일"
            view="조회수"
          />
          {articleList[page].map((article) => (
            <ReportBox
              sx={{
                width: "80%",
                color: "black",
              }}
              board="reportboard"
              key={article.id}
              no={article.id}
              category={article.category}
              title={article.title}
              author={article.nickname}
              date={new Date(article.createdTime).toLocaleDateString()}
              view={article.hit}
            />
          ))}
          <Box
            sx={{
              width: "80%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link to="/reportBoard/write">
              <AppBlackButton
                sx={{
                  marginTop: "20px",
                }}
              >
                글쓰기
              </AppBlackButton>
            </Link>
          </Box>
          <Pagination
            count={articleList.length}
            variant="outlined"
            shape="rounded"
            onChange={onChangePage}
            sx={{
              margin: 2,
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default ReportBoard;
