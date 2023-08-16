import { StrictMode } from "react";
import { Routes } from "@generouted/react-router";

export function createApp() {
  return (
    <StrictMode>
      <Routes />
    </StrictMode>
  );
}
