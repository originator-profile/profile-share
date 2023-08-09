import "./style.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Pages from "./pages/index";
import { createApp } from "./base";


const root = document.getElementById("root");
if (root) {
  hydrateRoot(
    document.getElementById("root"),
    createApp()
  );
}
//   createRoot(root).render(
//     <StrictMode>
//       <Pages />
//     </StrictMode>,
//   );
// }
