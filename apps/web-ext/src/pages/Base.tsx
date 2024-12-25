import { useTitle } from "react-use";
import { Navigate } from "react-router";
import { buildPublUrl, routes } from "../utils/routes";
import { useSiteProfile } from "../components/siteProfile";
import {
  ProfilesFetchFailed,
  SiteProfileFetchFailed,
  SiteProfileFetchInvalid,
  SiteProfileInvalid,
  SiteProfileVerifyFailed,
  VerifiedOps,
  VerifiedSp,
} from "@originator-profile/verify";
import Unsupported from "../components/Unsupported";
import NotFound from "../components/NotFound";
import { _ } from "@originator-profile/ui";
import {
  CasVerifyFailed,
  useCredentials,
  VerifiedCas,
} from "../components/credentials";
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

function isSpVerifyError(sp_error?: Error): sp_error is Error {
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
    credentials_error.code === CasVerifyFailed.code
  );
}

function isInvalid(
  ops?: VerifiedOps,
  cas?: VerifiedCas,
  sp_error?: Error,
): sp_error is Error {
  // opsとcasはhtml内埋め込みも外部リンクもない場合はFetch Errorにならないためopsとcasの存在で判定を行う
  return isSpFetchError(sp_error) && (isOpsNotFound(ops) || isCasNotFound(cas));
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

  if (!isInvalid(ops, cas, sp_error)) {
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

  return (
    <Unsupported
      errors={credentials_error ? [sp_error, credentials_error] : [sp_error]}
    />
  );
}

export default Base;
