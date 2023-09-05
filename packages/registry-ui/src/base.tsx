import { StrictMode } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { Routes } from "@generouted/react-router";

export function createApp() {
  return (
    <StrictMode>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: new URL("/app/", window.location.origin).href,
        }}
        cacheLocation="localstorage"
      >
        <Routes />
      </Auth0Provider>
    </StrictMode>
  );
}
