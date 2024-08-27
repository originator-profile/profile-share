import { useParams, useSearchParams } from "react-router-dom";
import useProfiles from "../utils/use-profiles";
import { routes } from "../utils/routes";
import NotFound from "../components/NotFound";
import Template from "../templates/Publ";
import { DocumentProfile, OriginatorProfile } from "@originator-profile/ui";
import { DpItemContent } from "@originator-profile/core";
import { OpHolder, OgWebsite } from "@originator-profile/model";
import Loading from "../components/Loading";

function getTemplateProps<
  T extends boolean | undefined,
  R = T extends true ? OgWebsite : DpItemContent,
>({
  op,
  dp,
  mustWebsite,
  queryParams,
}: {
  op?: OriginatorProfile;
  dp?: DocumentProfile;
  mustWebsite?: T;
  queryParams: URLSearchParams;
}):
  | {
      op: OriginatorProfile;
      dp: DocumentProfile;
      dpItemContent: R;
      holder: OpHolder;
      paths: {
        org: {
          pathname: string;
          search: string;
        };
      };
    }
  | undefined {
  if (!(op && dp)) return;
  const holder = op.findHolderItem();
  const dpItemContent = (
    mustWebsite
      ? dp.findOgWebsiteItem()
      : dp.findOgWebsiteItem() ?? dp.findAdvertisementItem()
  ) as R | undefined;
  if (!(holder && dpItemContent)) return;
  return {
    op,
    dp,
    dpItemContent,
    holder,
    paths: {
      org: {
        pathname: routes.org.build(
          routes.org.getParams({
            contentType: mustWebsite ? "サイト" : dp.getContentType(),
            op,
          }),
        ),
        search: queryParams.toString(),
      },
    },
  };
}

function Publ() {
  const [queryParams] = useSearchParams();
  const {
    issuer = "",
    subject = "",
    tabId,
  } = useParams<{
    issuer?: string;
    subject?: string;
    tabId: string;
  }>();

  const { profileSet } = useProfiles();

  if (profileSet.isLoading) {
    return <Loading />;
  }
  const article = getTemplateProps({
    op: profileSet.getOp(issuer),
    dp: profileSet.getDp(subject, issuer),
    queryParams,
  });
  const website = getTemplateProps({
    ...profileSet.getWebsiteProfilePair(),
    mustWebsite: true,
    queryParams,
  });
  if (!(article || website)) {
    return <NotFound variant="profile" />;
  }

  const handleClickDp = (dp: DocumentProfile) => async () => {
    await chrome.tabs.sendMessage(Number(tabId), {
      type: "overlay-profiles",
      timestamp: Date.now(),
      ...profileSet.serialize(),
      activeDp: dp.serialize(),
    });
  };

  return (
    <Template
      profiles={profileSet}
      article={article}
      website={website}
      handleClickDp={handleClickDp}
    />
  );
}

export default Publ;
