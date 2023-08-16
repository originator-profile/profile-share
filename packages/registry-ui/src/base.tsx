import { StrictMode } from "react";
import { Routes } from "./routes";

export function createApp() {
  return (
    <StrictMode>
      <Routes />
    </StrictMode>
  );
}
