import React from "react";
import missing from "./images/404.png";
import missingDark from "./images/404Dark.png";
import { useAppContext } from "../context/main";

const NotFound = () => {
  const { mode } = useAppContext();
  return (
    <div style={{ marginTop: "60px" }}>
      <img alt="404 Not Found" src={mode === "dark" ? missingDark : missing} />
    </div>
  );
};

export default NotFound;
