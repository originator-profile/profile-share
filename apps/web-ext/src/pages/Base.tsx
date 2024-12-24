import { useTitle } from "react-use";
import { Navigate } from "react-router";
import { buildPublUrl } from "../utils/routes";
import { useSiteProfile } from "../components/siteProfile";
import {
  ProfilesFetchFailed,
  SiteProfileFetchFailed,
  SiteProfileFetchInvalid,
  VerifiedOps,
  VerifiedSp,
} from "@originator-profile/verify";
import { _ } from "@originator-profile/ui/src/utils";
import Unsupported from "../components/Unsupported";
import NotFound from "../components/NotFound";
import { useCredentials, VerifiedCas } from "../components/credentials";
import Loading from "../components/Loading";

function Redirect({ tabId }: { tabId: number; siteProfile?: VerifiedSp }) {
  /* TODO: cas を送る */
  /*
  useMount(() => {
    if (profiles) {
      chrome.tabs.sendMessage(tabId, {
        type: "overlay-profiles",
        timestamp: Date.now(),
        ...profiles.serialize(),
        activeDp: dp?.serialize(),
      });
    }
  });
  */

  return <Navigate to={buildPublUrl(tabId, undefined)} />;
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

function isSpFetchError(sp_error?: Error): sp_error is Error {
  if (!sp_error) {
    return false;
  }

  return (
    "code" in sp_error &&
    (sp_error.code === SiteProfileFetchFailed.code ||
      sp_error.code === SiteProfileFetchInvalid.code)
  );
}

function isCredentialsFetchError(
  credentials_error?: Error,
): credentials_error is Error {
  if (!credentials_error) {
    return false;
  }

  return (
    "code" in credentials_error &&
    credentials_error.code === ProfilesFetchFailed.code
  );
}

// html組み込みのOPSのFetchError判定用
function isOpsNotFound(ops?: VerifiedOps): boolean {
  return ops === undefined || ops.length === 0;
}

// html組み込みのCASのFetchError判定用
function isCasNotFound(cas?: VerifiedCas): boolean {
  return cas === undefined || cas.length === 0;
}

function Base() {
  const { tabId, siteProfile, error: sp_error } = useSiteProfile();
  const { ops, cas, error: credentials_error } = useCredentials();
  useTitle([_("Base_ContentsInformation"), origin].filter(Boolean).join(" ― "));

  if (isLoading({ siteProfile, sp_error, ops, cas, credentials_error })) {
    return <Loading />;
  }

  if (!isSpFetchError(sp_error)) {
    return <Redirect tabId={tabId} />;
  }

  // opsとcasはhtml内埋め込みも外部リンクもない場合はFetch Errorにならないためopsとcasの存在で判定を行う
  if (!isOpsNotFound(ops) && !isCasNotFound(cas)) {
    return <Redirect tabId={tabId} />;
  }

  if (isCredentialsFetchError(credentials_error)) {
    return (
      <NotFound
        variant="websiteAndCas"
        errors={[sp_error, credentials_error]}
      />
    );
  }

  if (isOpsNotFound(ops) && isCasNotFound(cas)) {
    return <NotFound variant="websiteAndCas" errors={[sp_error]} />;
  }

  return <Unsupported error={sp_error} />;
}

export default Base;
