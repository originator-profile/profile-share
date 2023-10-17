import { useParams } from "react-router-dom";
import { isOp, isOpHolder } from "@originator-profile/core";
import { toRoles, findProfileError } from "@originator-profile/ui/src/utils";
import useProfileSet from "../utils/use-profile-set";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Unsupported from "../components/Unsupported";
import Template from "../templates/Org";

type Props = { back: string };

function Org(props: Props) {
  const { orgIssuer, orgSubject } = useParams<{
    orgIssuer: string;
    orgSubject: string;
  }>();
  const {
    advertisers = [],
    publishers = [],
    profiles,
    error,
  } = useProfileSet();
  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }
  const result = findProfileError(profiles);
  // TODO: 禁止のケースの見た目を実装して
  if (result) {
    return <Unsupported error={result} />;
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
    back: props.back,
  } as const;
  return <Template paths={paths} op={op} holder={holder} roles={roles} />;
}

export default Org;
