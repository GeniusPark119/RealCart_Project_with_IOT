import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function RaceTime({ isRunning }) {
  const [hundredthsOfSeconds, setHundredthsOfSeconds] = useState(0);

  useEffect(() => {
    let intervalId = null;
    if (isRunning) {
      intervalId = setInterval(() => {
        setHundredthsOfSeconds((prev) => prev + 1);
      }, 10);
    } else {
      setHundredthsOfSeconds(0);
      clearInterval(intervalId);
    }
    return () => {
      setHundredthsOfSeconds(0);
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const formattedHundredthsOfSeconds = (hundredthsOfSeconds % 100)
    .toString()
    .padStart(2, "0");
  const formattedSeconds = Math.floor((hundredthsOfSeconds / 100) % 60)
    .toString()
    .padStart(2, "0");
  const formattedMinutes = Math.floor(hundredthsOfSeconds / 6000)
    .toString()
    .padStart(2, "0");

  return (
    <div>
      <p>{`${formattedMinutes}:${formattedSeconds}:${formattedHundredthsOfSeconds}`}</p>
    </div>
  );
}

RaceTime.propTypes = {
  isRunning: PropTypes.bool.isRequired,
};

export default RaceTime;
