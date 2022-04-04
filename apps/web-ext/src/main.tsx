import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import App from "./App";

// NOTE: @types/react-dom が v18 対応したら取り除いて
// @ts-expect-error TS2339: Property 'createRoot' does not exist
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
