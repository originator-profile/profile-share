import { useParams, useSearchParams } from "react-router-dom";
import { isOp, isOpHolder } from "@originator-profile/core";
import { toRoles } from "@originator-profile/ui/src/utils";
import useProfileSet from "../utils/use-profile-set";
import NotFound from "../components/NotFound";
import Template from "../templates/Org";

type Props = { back: string };

function Org(props: Props) {
  const [queryParams] = useSearchParams();
  const { orgIssuer, orgSubject } = useParams<{
    orgIssuer: string;
    orgSubject: string;
  }>();
  const {
    advertisers = [],
    publishers = [],
    profiles,
    website,
  } = useProfileSet();

  const op = [...(profiles ?? []), ...(website ?? [])]
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
