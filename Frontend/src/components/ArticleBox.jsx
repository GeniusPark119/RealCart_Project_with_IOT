import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

function ArticleBox({
  sx,
  board,
  no,
  title,
  author,
  date,
  view,
  ...otherProps
}) {
  const mergedSx = {
    ...{ bgcolor: "white", color: "black", borderBottom: 1 },
    ...sx,
  };
  return (
    <Box
      sx={mergedSx}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
        }}
      >
        <Box
          sx={{
            width: "5%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {no}
        </Box>
        <Link
          to={`/${board}/detail?no=${no}`}
          style={{
            textDecoration: "none",
            width: "60%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
          }}
        >
          <Box>{title}</Box>
        </Link>
        <Box
          sx={{
            width: "10%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {author}
        </Box>
        <Box
          sx={{
            width: "15%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {date}
        </Box>
        <Box
          sx={{
            width: "10%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {view}
        </Box>
      </Box>
    </Box>
  );
}

ArticleBox.defaultProps = {
  sx: {},
};

ArticleBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  board: PropTypes.string.isRequired,
  no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  view: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ArticleBox;
