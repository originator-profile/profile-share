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

  return {
    op,
    dp,
    content,
    holder,
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
  if (!(dp && op)) {
    return <NotFound variant="profile" />;
  }
  const article = extractFromOpDp(op, dp);
  if (!("dp" in article)) {
    return article;
  }
  return {
    ...article,
    paths: {
      org: {
        pathname: routes.org.build(
          routes.org.getParams({ contentType: dp.getContentType(), op }),
        ),
        search: queryParams.toString(),
      },
    },
  };
}

function extractFromProfilePair(
  profiles: ProfileSet,
  queryParams: URLSearchParams,
) {
  const { op, dp } = profiles.getWebsiteProfilePair();
  const website = extractFromOpDp(op, dp);
  if (!("dp" in website)) {
    return website;
  }
  return {
    ...website,
    paths: {
      org: {
        pathname: routes.org.build(
          routes.org.getParams({ contentType: "サイト", op }),
        ),
        search: queryParams.toString(),
      },
    },
  };
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
  const website = extractFromProfilePair(profileSet, queryParams);

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
