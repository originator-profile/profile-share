import { Outlet } from "react-router-dom";
import AppBar from "../../components/AppBar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <AppBar />
      <Outlet />
      {children}
    </>
  );
}
