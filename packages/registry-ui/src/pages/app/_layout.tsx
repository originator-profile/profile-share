import { Outlet } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import AppBar from "../../components/AppBar";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <>
      <AppBar />
      <Outlet />
      {children}
    </>
  );
}

export default withAuthenticationRequired(Layout);
