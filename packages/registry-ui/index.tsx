import "./style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Pages from "./pages/index";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Pages />
    </StrictMode>,
  );
}
