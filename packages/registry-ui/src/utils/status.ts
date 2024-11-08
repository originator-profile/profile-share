import { useSession } from "./session";
import { useAccountDraft } from "./draft";
import { useAccount, useAccountLogo } from "./account";
import { usePublicKeys } from "../components/publicKeys";
import { isExpired } from "@originator-profile/core";

export function useStatus() {
  const session = useSession();
  const user = session.data?.user;
  const accountIdOrNull = useSession().data?.user?.accountId ?? null;
  const { data: account } = useAccount(accountIdOrNull);
  const [draft] = useAccountDraft(user?.id);
  const hasDraft = !!draft;
  const { data: keys } = usePublicKeys();
  const { data: logo } = useAccountLogo(accountIdOrNull);
  const validCredentials = account?.credentials?.filter(
    (credential) => !isExpired(credential.expiredAt),
  );
  type FlowState = "registered" | "hasDraft";
  const statusValue: {
    holder?: FlowState | null;
    "public-key"?: FlowState | null;
    logo?: FlowState | null;
    credential?: FlowState | null;
  } = {};

  const getHolder = () => {
    if (hasDraft) {
      return "hasDraft";
    } else if (account?.name) {
      return "registered";
    }
    statusValue.holder = null;
  };

  statusValue.holder = getHolder();

  const getPublicKey = () => {
    if ((keys?.keys.length ?? 0) > 0) {
      return "registered";
    }
    return null;
  };
  statusValue["public-key"] = getPublicKey();

  const getLogo = () => {
    if (logo?.url) {
      return "registered";
    }
    return null;
  };
  statusValue.logo = getLogo();

  const getCredential = () => {
    if ((validCredentials?.length ?? 0) > 0) {
      return "registered";
    }
    return null;
  };
  statusValue.credential = getCredential();

  return statusValue;
}
