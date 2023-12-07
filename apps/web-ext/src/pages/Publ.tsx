import { isValidElement } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { isOp, isOpHolder, isDp, isOgWebsite } from "@originator-profile/core";
import { Profile } from "@originator-profile/model";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import Unsupported from "../components/Unsupported";
import useVerifyFailureFeedback from "../utils/use-verify-failure-feedback";

function extractFromProfiles(
  profiles: Profile[],
  queryParams: URLSearchParams,
  issuer?: string,
  subject?: string,
  findFirstOpDp?: boolean,
) {
  const dp = findFirstOpDp
    ? profiles.find(isDp)
    : profiles
        .filter(isDp)
        .find((dp) => dp.issuer === issuer && dp.subject === subject);
  const op = findFirstOpDp
    ? profiles.find(isOp)
    : profiles.filter(isOp).find((op) => op.subject === issuer);
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

  return {
    op,
    dp,
    website,
    holder,
    paths,
  };
}

function Publ() {
  const [queryParams] = useSearchParams();
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const {
    tabId,
    profiles = [],
    main = [],
    error,
    website: websiteProfiles = [],
  } = useProfileSet();

  const element = useVerifyFailureFeedback({
    profiles: [...profiles, ...websiteProfiles],
    tabId,
    queryParams,
  });

  if (element) {
    return element;
  }
  if (error) {
    return <Unsupported error={error} />;
  }

  const article = extractFromProfiles(profiles, queryParams, issuer, subject);
  const website = extractFromProfiles(
    websiteProfiles,
    queryParams,
    undefined,
    undefined,
    true,
  );
  /* 記事について ReactElement(有効なプロファイルがない)なら記事のElementを表示することにする */
  /* そもそもそのケースではPublが呼ばれないはずではある */
  if (isValidElement(article)) {
    return article;
  }

  return (
    <Template
      /* ここに来る場合は article はかならずdpを持つはずだが型チェックがエラーにならないように */
      article={"dp" in article ? { profiles, main, ...article } : undefined}
      /* 技術情報の表示を実装する際にはwebsiteProfiles を追加する必要がある */
      website={"dp" in website ? website : undefined}
    />
  );
}

export default Publ;
