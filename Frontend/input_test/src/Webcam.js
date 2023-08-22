import { useRef } from "react";
import React from "react";
import Webcam from "react-webcam";

const WebcamWithRef = ({ className }) => {
  const webcamRef = useRef(null);

  const handleUserMedia = (stream) => {
    webcamRef.current.srcObject = stream;
    webcamRef.current.addEventListener("keydown", (event) => {
      console.log(event.key);
    });
    webcamRef.current.focus();
  };

  return (
    <div tabIndex={-1} ref={webcamRef}>
      <Webcam
        tabIndex={-1}
        ref={webcamRef}
        onUserMedia={handleUserMedia}
        className={className}
      />
    </div>
  );
};

export default WebcamWithRef;
