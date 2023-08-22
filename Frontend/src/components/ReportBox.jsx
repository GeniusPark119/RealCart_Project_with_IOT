import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

function ArtcleBox({
  sx,
  board,
  no,
  category,
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
  const categoryDict = {
    BUG: "버그리포트",
    REPORT: "신고",
    QUESTION: "이용문의",
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
        <Box
          sx={{
            width: "10%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {categoryDict[category]}
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            to={`/${board}/detail?no=${no}`}
            style={{
              textDecoration: "none",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {title}
            </Box>
          </Link>
        </Box>
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
            width: "10%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {date}
        </Box>
        <Box
          sx={{
            width: "5%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {view}
        </Box>
        <Box
          sx={{
            width: "10%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          상태
        </Box>
      </Box>
    </Box>
  );
}

ArtcleBox.defaultProps = {
  sx: {},
};

ArtcleBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  board: PropTypes.string.isRequired,
  no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  view: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ArtcleBox;
