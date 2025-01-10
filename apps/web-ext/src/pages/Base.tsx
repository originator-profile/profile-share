import { useTitle } from "react-use";
import { Navigate } from "react-router";
import { buildPublUrl, routes } from "../utils/routes";
import { useSiteProfile } from "../components/siteProfile";
import {
  SiteProfileFetchFailed,
  SiteProfileInvalid,
  SiteProfileVerifyFailed,
  VerifiedOps,
  VerifiedSp,
  OpsVerifyFailed,
} from "@originator-profile/verify";
import Unsupported from "../components/Unsupported";
import { _ } from "@originator-profile/ui";
import {
  CasVerifyFailed,
  useCredentials,
  VerifiedCas,
} from "../components/credentials";
import Loading from "../components/Loading";

function Redirect({ tabId, cas }: { tabId: number; cas?: VerifiedCas }) {
  /* TODO: オーバーレイ表示を新モデルに対応して
  /*
  useMount(() => {
    if (cas) {
      chrome.tabs.sendMessage(Number(tabId), {
        type: "overlay-profiles",
        timestamp: Date.now(),
        cas: JSON.stringify(cas),
        activeCa: ca ? JSON.stringify(ca) : undefined,
      });
    }
  });
  */
  const [ca] = cas ?? [];

  return <Navigate to={buildPublUrl(tabId, ca?.attestation.doc)} />;
}

function Prohibition({ tabId }: { tabId: number }) {
  const path = [
    routes.base.build({ tabId: String(tabId) }),
    routes.prohibition.build({}),
  ].join("/");
  return <Navigate to={path} />;
}

function isLoading({
  siteProfile,
  sp_error,
  ops,
  cas,
  credentials_error,
}: {
  siteProfile?: VerifiedSp;
  sp_error?: Error;
  ops?: VerifiedOps;
  cas?: VerifiedCas;
  credentials_error?: Error;
}) {
  return (!siteProfile && !sp_error) || (!ops && !cas && !credentials_error);
}

function isSpVerifyError(sp_error?: Error) {
  if (!sp_error) {
    return false;
  }

  return (
    "code" in sp_error &&
    (sp_error.code === SiteProfileVerifyFailed.code ||
      sp_error.code === SiteProfileInvalid.code)
  );
}

function isCredentialsVerifyError(credentials_error?: Error) {
  if (!credentials_error) {
    return false;
  }

  return (
    "code" in credentials_error &&
    (credentials_error.code === OpsVerifyFailed.code ||
      credentials_error.code === CasVerifyFailed.code)
  );
}

function Base() {
  const { tabId, siteProfile, error: sp_error } = useSiteProfile();
  const { ops, cas, error: credentials_error } = useCredentials();
  useTitle([_("Base_ContentsInformation"), origin].filter(Boolean).join(" ― "));

  if (isLoading({ siteProfile, sp_error, ops, cas, credentials_error })) {
    return <Loading />;
  }

  if (
    isSpVerifyError(sp_error) ||
    isCredentialsVerifyError(credentials_error)
  ) {
    return <Prohibition tabId={tabId} />;
  }

  // NOTE: SP と CAS のいずれかが閲覧可能なら表示する
  if (siteProfile || (cas && cas.length > 0)) {
    return <Redirect tabId={tabId} cas={cas} />;
  }

  const errors = [sp_error, credentials_error].filter(
    (
      error,
    ): error is
      | SiteProfileInvalid
      | SiteProfileFetchFailed
      | OpsVerifyFailed
      | CasVerifyFailed => {
      if (!error) {
        return false;
      }
      // NOTE: デシリアライズされたが Error インスタンスでないエラーが得られうる
      return error instanceof Error || "code" in error;
    },
  );
  return <Unsupported errors={errors} />;
}

export default Base;
