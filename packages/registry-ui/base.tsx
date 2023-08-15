import { StrictMode } from "react";
import Pages from "./pages/index";

export function createApp() {
  return (
    <StrictMode>
      <Pages />
    </StrictMode>
  );
}
