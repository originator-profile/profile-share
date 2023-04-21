import { useParams } from "react-router-dom";
import { isOp, isOpHolder, isDp, isOgWebsite } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import { routes } from "../utils/routes";
import findProfileGenericError from "../utils/find-profile-generic-error";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import Unsupported from "../components/Unsupported";

function Publ() {
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const { profiles, error } = useProfiles();
  if (error) {
    return <Unsupported error={error} />;
  }
  if (!profiles) {
    return <Loading />;
  }
  const result = findProfileGenericError(profiles);
  // TODO: 禁止のケースの見た目を実装して
  if (result) {
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

  const paths = {
    org: routes.org.build({ orgIssuer: op.issuer, orgSubject: op.subject }),
  } as const;
  return (
    <Template op={op} dp={dp} website={website} holder={holder} paths={paths} />
  );
}

export default Publ;
