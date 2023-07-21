import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastConfig = ({ darkMode }) => {
  return (
    <ToastContainer
      transition={Slide}
      position="bottom-right"
      autoClose={2500}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      progress={undefined}
      theme={darkMode ? "dark" : "light"}
    />
  );
};
