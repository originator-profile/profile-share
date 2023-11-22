import { Outlet } from "react-router-dom";
import AppBar from "../../components/AppBar";
import React from "react";

const Layout: React.FC = () => (
  <>
    <AppBar />
    <Outlet />
  </>
);

export default Layout;
