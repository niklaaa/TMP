import React from "react";

const meetingStatus = props => {
  const color = props.status === 1 ? "#57ca33" : "#f3f314";

  return (
    <span
      style={{
        width: "13px",
        height: "13px",
        borderRadius: "50%",
        display: "inline-block",
        position: "absolute",
        backgroundColor: color,
        top: "10px",
        right: "10px"
      }}
    ></span>
  );
};

export default meetingStatus;
