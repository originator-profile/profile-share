import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../../utils/user";
import { useLatestRequest } from "../../../utils/request";

function Home() {
  const { user: token } = useAuth0();
  const { data: user } = useUser(token?.sub ?? null);
  const { data: request } = useLatestRequest(user?.accountId ?? null);
  return (
    <article>
      <pre>{JSON.stringify(request, null, 2)}</pre>
    </article>
  );
}

export default Home;
