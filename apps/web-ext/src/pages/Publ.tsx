import { useParams, useSearchParams } from "react-router-dom";
import {
  isOp,
  isOpHolder,
  isDp,
  isOgWebsite,
  isAdvertisement,
} from "@originator-profile/core";
import { OgWebsite, Profile } from "@originator-profile/model";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";

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
  const advertisement = dp.item.find(isAdvertisement);
  const content = website || advertisement;
  if (!content) {
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
    content,
    holder,
    paths,
  };
}

function Publ() {
  const [queryParams] = useSearchParams();
  const { issuer, subject } = useParams<{ issuer: string; subject: string }>();
  const { profiles, main = [], website: websiteProfiles } = useProfileSet();

  const article = extractFromProfiles(
    profiles ?? [],
    queryParams,
    issuer,
    subject,
  );
  const website = extractFromProfiles(
    websiteProfiles ?? [],
    queryParams,
    undefined,
    undefined,
    true,
  );

  return (
    <Template
      /* ここに来る場合は article はかならずdpを持つはずだが型チェックがエラーにならないように */
      article={
        "dp" in article
          ? {
              profiles: profiles ?? [],
              main,
              dpItemContent: article.content,
              filteredDps: [],
              ...article,
            }
          : undefined
      }
      /* 技術情報の表示を実装する際にはwebsiteProfiles を追加する必要がある */
      website={
        "dp" in website
          ? { website: website.content as OgWebsite, ...website }
          : undefined
      }
    />
  );
}

export default Publ;
