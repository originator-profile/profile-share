import "../style.css";
import { createRoot } from "react-dom/client";
import { createApp } from "./base";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(createApp());
}
