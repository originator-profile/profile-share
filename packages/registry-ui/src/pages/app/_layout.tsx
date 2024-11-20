import { Outlet } from "react-router-dom";
import AppBar from "../../components/AppBar";
import AppVersion from "../../components/AppVersion";
import React from "react";

const Layout: React.FC = () => (
  <>
    <AppBar />
    <Outlet />
    <AppVersion />
  </>
);

export default Layout;
