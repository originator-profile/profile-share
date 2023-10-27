import { useParams, useSearchParams } from "react-router-dom";
import { isOp, isOpHolder } from "@originator-profile/core";
import { toRoles } from "@originator-profile/ui/src/utils";
import useProfileSet from "../utils/use-profile-set";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";
import Template from "../templates/Org";
import useCheckErrorsAndNavigate from "../utils/use-check-errors-and-navigate";

type Props = { back: string };

function Org(props: Props) {
  const [queryParams] = useSearchParams();
  const { orgIssuer, orgSubject } = useParams<{
    orgIssuer: string;
    orgSubject: string;
  }>();
  const {
    tabId,
    advertisers = [],
    publishers = [],
    profiles,
    error,
  } = useProfileSet();

  const element = useCheckErrorsAndNavigate({
    profiles,
    tabId,
    queryParams,
  });

  if (element) {
    return element;
  }

  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }

  const op = profiles
    .filter(isOp)
    .find(
      (profile) =>
        profile.issuer === orgIssuer && profile.subject === orgSubject,
    );
  if (!op) {
    return <NotFound variant="op" />;
  }
  const holder = op.item.find(isOpHolder);
  if (!holder) {
    return <NotFound variant="holder" />;
  }
  const roles = toRoles(op.subject, advertisers, publishers);
  const paths = {
    back: {
      pathname: props.back,
      search: queryParams.toString(),
    },
  };
  return <Template paths={paths} op={op} holder={holder} roles={roles} />;
}

export default Org;
