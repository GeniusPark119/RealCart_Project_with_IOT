import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function AppButton({ children, sx, ...otherProps }) {
  const mergedSx = {
    ...{ bgcolor: "white", color: " black", textDecorationLine: "none" },
    ...sx,
  };
  return (
    <Button
      sx={mergedSx}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    >
      <Box sx={{ textDecoration: "none" }}>{children}</Box>
    </Button>
  );
}

AppButton.defaultProps = {
  sx: {
    bgcolor: "white",
    color: " black",
    textDecoration: "none",
  },
  children: "",
};

AppButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  children: PropTypes.string,
};

export default AppButton;
