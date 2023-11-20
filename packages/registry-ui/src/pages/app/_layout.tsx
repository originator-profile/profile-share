import { Outlet, useLocation } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import AppBar from "../../components/AppBar";
import React from "react"; // Reactをインポート

type LayoutProps = {
  children?: React.ReactNode; // ここでReact.ReactNode型を指定
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

  // debuggerページの場合、認証不要のLayoutをそのまま使用
  if (location.pathname === "/app/debugger") {
    return <LayoutComponent>{children}</LayoutComponent>;
  }

  // それ以外のページの場合、認証が必要なLayoutを使用
  const LayoutWithAuth = withAuthenticationRequired(LayoutComponent);
  return <LayoutWithAuth>{children}</LayoutWithAuth>;
}

export default Layout;
