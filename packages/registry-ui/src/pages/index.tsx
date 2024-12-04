import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export default function Index() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      navigate("/app/");
    } else {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, navigate]);
  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }
}
