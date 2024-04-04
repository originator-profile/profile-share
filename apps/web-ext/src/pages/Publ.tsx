import { useParams, useSearchParams } from "react-router-dom";
import { OgWebsite } from "@originator-profile/model";
import useProfileSet from "../utils/use-profile-set";
import { routes } from "../utils/routes";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import {
  DocumentProfile,
  OriginatorProfile,
  ProfileSet,
} from "@originator-profile/ui";
import Loading from "../components/Loading";

function extractFromOpDp(
  op: OriginatorProfile | undefined,
  dp: DocumentProfile | undefined,
  queryParams: URLSearchParams,
) {
  if (!(dp && op)) {
    return <NotFound variant="profile" />;
  }
  const website = dp.findOgWebsiteItem();
  const advertisement = dp.findAdvertisementItem();
  const content = website || advertisement;
  if (!content) {
    return <NotFound variant="website" />;
  }
  const holder = op.findHolderItem();
  if (!holder) {
    return <NotFound variant="holder" />;
  }
  const paths = {
    org: {
      pathname: routes.org.build(routes.org.getParams(op)),
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

function extractFromProfiles(
  profiles: ProfileSet,
  queryParams: URLSearchParams,
  issuer?: string,
  subject?: string,
) {
  if (!issuer || !subject) {
    return <NotFound variant="profile" />;
  }
  const dp = profiles.getDp(subject, issuer);
  const op = profiles.getOp(issuer);
  return extractFromOpDp(op, dp, queryParams);
}

function Publ() {
  const [queryParams] = useSearchParams();
  const { issuer, subject, tabId } = useParams<{
    issuer: string;
    subject: string;
    tabId: string;
  }>();

  const { profileSet } = useProfileSet();

  if (profileSet.isLoading) {
    return <Loading />;
  }

  const article = extractFromProfiles(profileSet, queryParams, issuer, subject);
  const { op, dp } = profileSet.getWebsiteProfilePair();
  const website = extractFromOpDp(op, dp, queryParams);

  const handleClickDp = (dp: DocumentProfile) => async () => {
    await chrome.tabs.sendMessage(Number(tabId), {
      type: "overlay-profiles",
      ...profileSet.serialize(),
      activeDp: dp.serialize(),
    });
  };

  return (
    <Template
      /* ここに来る場合は article はかならずdpを持つはずだが型チェックがエラーにならないように */
      article={
        "dp" in article
          ? {
              profiles: profileSet,
              dpItemContent: article.content,
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
      handleClickDp={handleClickDp}
    />
  );
}

export default Publ;
