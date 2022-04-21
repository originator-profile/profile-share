import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";

const init = () => {
  const root = document.getElementById("root");
  if (!root) return;
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

init();
