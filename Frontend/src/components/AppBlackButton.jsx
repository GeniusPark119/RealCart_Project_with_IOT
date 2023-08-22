import { React, useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function AppButton({ children, sx, ...otherProps }) {
  const [color, setColor] = useState("white");

  const handleOver = () => {
    setColor("black");
  };

  const handleOut = () => {
    setColor("white");
  };
  const mergedSx = {
    ...{
      bgcolor: "black",
      color: { color },
      textDecorationLine: "none",
      border: "solid 1px black",
      borderRadius: "15px",
    },
    ...sx,
  };
  return (
    <Button
      sx={mergedSx}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
      onMouseOver={handleOver}
      onMouseOut={handleOut}
    >
      <Box sx={{ textDecoration: "none" }}>{children}</Box>
    </Button>
  );
}

AppButton.defaultProps = {
  sx: {
    bgcolor: "black",
    color: " white",
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
