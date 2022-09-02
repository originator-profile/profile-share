import { useParams } from "react-router-dom";
import { isOp, isOpHolder, isDp, isOgWebsite } from "@webdino/profile-core";
import useProfiles from "../utils/use-profiles";
import { routes } from "../utils/routes";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import ErrorPlaceholder from "../components/ErrorPlaceholder";
import Template from "../templates/Publ";

function Publ() {
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const { profiles, error, targetOrigin, profileEndpoint } = useProfiles();
  if (error) {
    return (
      <ErrorPlaceholder>
        <p className="whitespace-pre-wrap">{error.message}</p>
      </ErrorPlaceholder>
    );
  }
  if (!profiles) {
    return (
      <LoadingPlaceholder>
        <p>
          {targetOrigin && `${targetOrigin} の`}
          プロファイルを取得検証しています...
        </p>
      </LoadingPlaceholder>
    );
  }
  const dp = profiles
    .filter(isDp)
    .find((dp) => dp.issuer === issuer && dp.subject === subject);
  const op = profiles.filter(isOp).find((op) => op.subject === issuer);
  if (!(dp && op)) {
    return (
      <ErrorPlaceholder>
        <p>プロファイルが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const website = dp.item.find(isOgWebsite);
  if (!website) {
    return (
      <ErrorPlaceholder>
        <p>ウェブサイトが見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }
  const holder = op.item.find(isOpHolder);
  if (!holder) {
    return (
      <ErrorPlaceholder>
        <p>所有者情報が見つかりませんでした</p>
      </ErrorPlaceholder>
    );
  }

  const paths = {
    org: routes.org.build({ orgIssuer: op.issuer, orgSubject: op.subject }),
  } as const;
  return (
    <Template
      dp={dp}
      website={website}
      holder={holder}
      paths={paths}
      profileEndpoint={profileEndpoint ?? ""}
    />
  );
}

export default Publ;
