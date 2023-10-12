import { useLocation, useParams } from "react-router-dom";
import { isOp, isOpHolder, isDp, isOgWebsite } from "@originator-profile/core";
import { findProfileGenericError } from "@originator-profile/ui/src/utils";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import Unsupported from "../components/Unsupported";

function Publ() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hasUnsafeParam = queryParams.has("unsafe");

  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const { profiles, error } = useProfileSet();
  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }
  const result = findProfileGenericError(profiles);
  // TODO: 禁止のケースの見た目を実装して
  if (result && !hasUnsafeParam) {
    return <Unsupported error={result} />;
  }
  const dp = profiles
    .filter(isDp)
    .find((dp) => dp.issuer === issuer && dp.subject === subject);
  const op = profiles.filter(isOp).find((op) => op.subject === issuer);
  if (!(dp && op)) {
    return <NotFound variant="profile" />;
  }
  const website = dp.item.find(isOgWebsite);
  if (!website) {
    return <NotFound variant="website" />;
  }
  const holder = op.item.find(isOpHolder);
  if (!holder) {
    return <NotFound variant="holder" />;
  }

  const unsafeQuery = hasUnsafeParam ? "?unsafe" : "";

  const paths = {
    org: `${routes.org.build({
      orgIssuer: op.issuer,
      orgSubject: op.subject,
    })}${unsafeQuery}`,
  } as const;

  return (
    <Template op={op} dp={dp} website={website} holder={holder} paths={paths} />
  );
}

export default Publ;
