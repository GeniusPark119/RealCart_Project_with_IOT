import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import axios from "../util/axiosInstance";
import AppButton from "./AppButton";

function ArticleBox({ sx, no, id, content, author, date, ...otherProps }) {
  const mergedSx = {
    ...{
      bgcolor: "white",
      color: "black",
      borderBottom: "solid 1px gray",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ...sx,
  };

  const handleDelete = async (e) => {
    console.log(`${process.env.REACT_APP_BACKEND_URL}/board/free/${no}/${id}`);
    e.preventDefault();
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/board/free/${no}/${id}`, {})
      .then((response) => {
        console.log(response);
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Box
      sx={mergedSx}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "90%" }}>
        <PersonIcon
          sx={{
            width: "5%",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "95%",
            height: 50,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "10%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {author}
            </Box>
            <Box
              style={{
                textDecoration: "none",
                fontSize: "12px",
                color: "gray",
              }}
            >
              {date}
            </Box>
          </Box>
          <Box
            sx={{
              width: "70%",

              paddingLeft: "100px",
            }}
          >
            {content}
          </Box>
        </Box>
      </Box>
      <AppButton onClick={handleDelete}>삭제</AppButton>
    </Box>
  );
}

ArticleBox.defaultProps = {
  sx: {},
};

ArticleBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default ArticleBox;
