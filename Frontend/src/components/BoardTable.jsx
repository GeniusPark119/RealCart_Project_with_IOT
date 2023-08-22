import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Link } from "react-router-dom";
import axios from "../util/axiosInstance";
import "../index.css";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function CustomPaginationActionsTable({ address, link }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    address === "record" ? 12 : 5
  );
  const [rows, setRows] = useState([]);

  // 공지사항 게시글 백으로부터 가져오기
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/${address}`).then((res) => {
      const articles = res.data;
      const List = [];
      if (articles.length === 0) {
        if (address === "board/notice") {
          List.push([
            {
              id: "번호",
              title: "제목",
              nickname: "글쓴이",
            },
            {
              id: "-",
              title: "게시글이 없습니다.",
              nickname: "운영자",
            },
          ]);
        } else if (address === "board/free") {
          List.push([
            {
              id: "번호",
              title: "제목",
              nickname: "글쓴이",
            },
            {
              id: "-",
              title: "게시글이 없습니다.",
              nickname: "-",
            },
          ]);
        } else if (address === "record") {
          List.push([
            {
              nickname: "닉네임",
              lapTime: "주행시간",
              rank: "랭킹",
            },
            {
              nickname: "-",
              lapTime: "게시글이 없습니다.",
              rank: "-",
            },
          ]);
        }
      } else {
        if (address === "board/notice") {
          List.push({
            id: "번호",
            title: "제목",
            nickname: "글쓴이",
          });
          for (let i = 0; i < articles.length; i += 1) {
            List.push({
              id: i + 1,
              title: articles[i].title,
              nickname: "운영자",
            });
          }
        } else if (address === "board/free") {
          List.push({
            id: "번호",
            title: "제목",
            nickname: "글쓴이",
          });
          for (let i = 0; i < articles.length; i += 1) {
            List.push({
              id: i + 1,
              title: articles[i].title,
              nickname: articles[i].nickname,
            });
          }
        } else if (address === "record") {
          List.push({
            rank: "랭킹",
            nickname: "닉네임",
            lapTime: "주행시간",
          });
          for (let i = 0; i < articles.length; i += 1) {
            List.push({
              rank: articles[i].rank,
              nickname: articles[i].nickname,
              lapTime: articles[i].lapTime,
            });
          }
        }
        console.log("error");
      }
      setRows(List);
    });
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function tableRow() {
    if (address === "board/notice" || address === "board/free") {
      return (
        rowsPerPage > 0
          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
      ).map((row) => (
        <TableRow key={row.id}>
          <TableCell style={{ width: 10 }} component="th" scope="row">
            {row.id}
          </TableCell>

          <TableCell style={{ width: 200 }} align="center">
            <Link
              to={link}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              {row.title}
            </Link>
          </TableCell>
          <TableCell style={{ width: 200 }} align="center">
            {row.nickname}
          </TableCell>
        </TableRow>
      ));
      // eslint-disable-next-line no-else-return
    } else if (address === "record") {
      return (
        rowsPerPage > 0
          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
      ).map((row) => (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" style={{ width: 70 }}>
            {row.rank}
          </TableCell>
          <TableCell style={{ width: 200 }} align="center">
            {row.nickname}
          </TableCell>
          <TableCell style={{ width: 200 }} align="center">
            {row.lapTime}
          </TableCell>
        </TableRow>
      ));
    }
    return console.log("error");
  }

  return (
    <TableContainer sx={{ border: "solid 1px #D7D6E0" }}>
      <Table aria-label="custom pagination table">
        <TableBody>
          {tableRow()}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={address === "record" ? [3, 5, 11] : [3, 5]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
CustomPaginationActionsTable.defaultPros = {
  address: "",
  link: "",
};
CustomPaginationActionsTable.propTypes = {
  // eslint-disable-next-line react/require-default-props
  address: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  link: PropTypes.string,
};
export default CustomPaginationActionsTable;
