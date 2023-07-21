import React from "react";
import { useAppContext } from "../context/main";

const Footer = () => {
  const { mode } = useAppContext;

  return (
    <footer
      className={mode === "dark" ? "footerDark mt-5" : "footerLight mt-5"}
    >
      <a href="https://tylerw.xyz">© 2023 Tyler Wertman Developments</a>
    </footer>
  );
};

export default Footer;
