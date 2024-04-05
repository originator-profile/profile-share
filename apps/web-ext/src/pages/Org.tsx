import { useParams, useSearchParams } from "react-router-dom";
import useProfileSet from "../utils/use-profile-set";
import NotFound from "../components/NotFound";
import Template from "../templates/Org";
import Loading from "../components/Loading";

type Props = { back: string };

function Org(props: Props) {
  const [queryParams] = useSearchParams();
  const { orgIssuer, orgSubject } = useParams<{
    orgIssuer: string;
    orgSubject: string;
  }>();
  const { profileSet } = useProfileSet();

  if (profileSet.isLoading) {
    return <Loading />;
  }

  const op =
    orgSubject && orgIssuer ? profileSet.getOp(orgSubject, orgIssuer) : null;

  if (!op) {
    return <NotFound variant="op" />;
  }
  const holder = op.findHolderItem();
  if (!holder) {
    return <NotFound variant="holder" />;
  }
  const roles = op.roles;
  const paths = {
    back: {
      pathname: props.back,
      search: queryParams.toString(),
    },
  };
  return <Template paths={paths} op={op} holder={holder} roles={roles} />;
}

export default Org;
