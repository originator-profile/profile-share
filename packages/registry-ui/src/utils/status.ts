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

  if (hasDraft) {
    statusValue.holder = "hasDraft";
  } else if (account?.name) {
    statusValue.holder = "registered";
  } else {
    statusValue.holder = null;
  }
  if ((keys?.keys.length ?? 0) > 0) {
    statusValue["public-key"] = "registered";
  } else {
    statusValue["public-key"] = null;
  }
  if (logo?.url) {
    statusValue.logo = "registered";
  } else {
    statusValue.logo = null;
  }
  if ((validCredentials?.length ?? 0) > 0) {
    statusValue.credential = "registered";
  } else {
    statusValue.credential = null;
  }
  return statusValue;
}
