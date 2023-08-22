import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

function ArtcleBoxTitle({ sx, no, title, author, date, view, ...otherProps }) {
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

        <Box
          sx={{
            width: "60%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {title}
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

ArtcleBoxTitle.defaultProps = {
  sx: {},
};

ArtcleBoxTitle.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  view: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ArtcleBoxTitle;
