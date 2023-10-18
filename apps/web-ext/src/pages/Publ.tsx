import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { isOp, isOpHolder, isDp, isOgWebsite } from "@originator-profile/core";
import { findProfileErrors } from "@originator-profile/ui/src/utils";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import Unsupported from "../components/Unsupported";

function Publ() {
  const [queryParams] = useSearchParams();
  const hasUnsafeParam = queryParams.has("unsafe");

  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const { tabId, profiles, error } = useProfileSet();
  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }
  const results = findProfileErrors(profiles);
  const hasProfileTokenVerifyFailed = results.some(
      (result) => result.code === "ERR_PROFILE_TOKEN_VERIFY_FAILED",
    );
    if (hasProfileTokenVerifyFailed && !hasUnsafeParam) {
      return (
        <Navigate
          to={[
            routes.base.build({ tabId: String(tabId) }),
            routes.prohibition.build({}),
          ].join("/")}
        />
      );
    }
    if (!hasProfileTokenVerifyFailed && results[0]) {
      return <Unsupported error={results[0]} />;
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

  const paths = {
  org: {
      pathname: routes.org.build({
        orgIssuer: op.issuer,
        orgSubject: op.subject,
      }),
      search: queryParams.toString(), 
    },
  } as const;

  return (
    <Template op={op} dp={dp} website={website} holder={holder} paths={paths} />
  );
}

export default Publ;
