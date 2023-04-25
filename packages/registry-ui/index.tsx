import "@exampledev/new.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Pages from "./pages/index";

const root = document.createElement("div");
document.body.append(root);
createRoot(root).render(
  <StrictMode>
    <Pages />
  </StrictMode>
);
