import { Outlet, useLocation } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import AppBar from "../../components/AppBar";
import React from "react";

type LayoutProps = {
  children?: React.ReactNode;
};

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => (
  <>
    <AppBar />
    <Outlet />
    {children}
  </>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  if (location.pathname === "/app/debugger") {
    return <LayoutComponent>{children}</LayoutComponent>;
  }

  const LayoutWithAuth = withAuthenticationRequired(LayoutComponent);
  return <LayoutWithAuth>{children}</LayoutWithAuth>;
};

export default Layout;
