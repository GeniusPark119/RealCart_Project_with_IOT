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
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import axios from "../util/axiosInstance";

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

function CustomPaginationActionsTable({ address, user }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/${address}`).then((res) => {
      const articles = res.data;
      const List = [];
      if (articles.length === 0) {
        if (address === `record/best/${user}`) {
          List.push([
            {
              lapTime: "최고기록",
              rank: "랭킹",
            },
            {
              lapTime: "경기 기록이 없습니다.",
              rank: "-",
            },
          ]);
        } else if (address === `record/${user}`) {
          List.push([
            {
              gameTime: "날짜",
              isWin: "결과",
              lapTime: "주행시간",
              oppo: "상대",
              oppoLapTime: "상대 주행시간",
            },
            {
              gameTime: "경기 기록이 없습니다.",
              isWin: "-",
              lapTime: "-",
              oppo: "-",
              oppoLapTime: "-",
            },
          ]);
        }
      } else {
        if (address === `record/best/${user}`) {
          List.push({
            lapTime: "최고기록",
            rank: "랭킹",
          });
          console.log(articles.lapTime);
          List.push({
            lapTime: articles.lapTime,
            rank: articles.rank,
          });
        } else if (address === `record/${user}`) {
          List.push({
            gameTime: "날짜",
            isWin: "결과",
            lapTime: "주행시간",
            oppo: "상대",
            oppoLapTime: "상대 주행시간",
          });
          for (let i = 0; i < articles.length; i += 1) {
            List.push({
              gameTime: new Date(articles[i].gameTime).toLocaleDateString(),
              isWin: articles[i].isWin === 1 ? "WIN" : "LOSE",
              lapTime: articles[i].lapTime,
              oppo: articles[i].oppo,
              oppoLapTime: articles[i].oppoLapTime,
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
    if (address === `record/best/${user}`) {
      return (
        rowsPerPage > 0
          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
      ).map((row) => (
        <TableRow>
          <TableCell style={{ width: 10 }} align="center">
            {row.lapTime}
          </TableCell>
          <TableCell style={{ width: 200 }} align="center">
            {row.rank}
          </TableCell>
        </TableRow>
      ));
      // eslint-disable-next-line no-else-return
    } else if (address === `record/${user}`) {
      return (
        rowsPerPage > 0
          ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : rows
      ).map((row) => (
        <TableRow width="100%">
          <TableCell style={{ width: 70 }} align="center">
            {row.gameTime}
          </TableCell>
          <TableCell style={{ width: 20 }} align="center">
            {row.rank}
          </TableCell>
          <TableCell style={{ width: 20 }} align="center">
            {row.isWin}
          </TableCell>
          <TableCell style={{ width: 50 }} align="center">
            {row.lapTime}
          </TableCell>
          <TableCell style={{ width: 20 }} align="center">
            {row.oppo}
          </TableCell>
          <TableCell style={{ width: 30 }} align="center">
            {row.oppoLapTime}
          </TableCell>
        </TableRow>
      ));
    }
    return console.log("tablerow");
  }

  return (
    <TableContainer sx={{ width: 650 }} component={Paper}>
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
              rowsPerPageOptions={[3, 5]}
              colSpan={5}
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
  address: {},
  user: {},
};
CustomPaginationActionsTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  address: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object.isRequired,
};
export default CustomPaginationActionsTable;
