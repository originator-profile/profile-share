import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { isOp, isOpHolder, isDp, isOgWebsite } from "@originator-profile/core";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import Unsupported from "../components/Unsupported";
import useCheckErrorsAndNavigate from "../utils/use-check-errors-and-navigate";

function Publ() {
  const [queryParams] = useSearchParams();
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const { tabId, profiles, error } = useProfileSet();

  const result = useCheckErrorsAndNavigate({ profiles, tabId, queryParams });

  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }

  if (result) {
    if (result.type === "navigate") {
      return <Navigate to={result.path} />;
    }
    if (result.type === "error") {
      return <Unsupported error={result.error} />;
    }
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
