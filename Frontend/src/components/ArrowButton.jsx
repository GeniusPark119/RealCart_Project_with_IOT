import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function ArrowButton({ children, sx, ...otherProps }) {
  const mergedSx = {
    ...{ bgcolor: "white", color: "black", textDecoration: "none", border: 1 },
    ...sx,
  };
  return (
    <Button
      variant="outlined"
      sx={mergedSx}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    >
      <Box
        sx={{
          width: "10%",
        }}
      />
      <Box
        sx={{
          width: "80%",
        }}
      >
        {children}
      </Box>
      <Box
        sx={{
          width: "10%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ArrowForwardIcon />
      </Box>
    </Button>
  );
}

ArrowButton.defaultProps = {
  sx: {},
  children: "",
};

ArrowButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  children: PropTypes.string,
};

export default ArrowButton;
