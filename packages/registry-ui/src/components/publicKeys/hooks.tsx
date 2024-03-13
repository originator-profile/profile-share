import fetcher from "../../utils/fetcher";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSession } from "../../utils/session";
import { Jwk, Jwks } from "./types";

type GetKeys = `/account/${string}/keys`;
type RegisterOrDestroyKey = `/internal/accounts/${string}/keys/`;

type RegisterKey = {
  url: RegisterOrDestroyKey;
  token: string;
  jwk: Jwk;
};

type DestroyKey = {
  url: RegisterOrDestroyKey;
  token: string;
  kid: Jwk["kid"];
};

/** 登録済み公開鍵の一覧の取得 */
async function getKeys(url: GetKeys) {
  return fetcher<Jwks>({ url });
}

/** 公開鍵の登録 */
async function registerKey(req: RegisterKey) {
  return fetcher<Jwks>({
    method: "POST",
    url: req.url,
    token: req.token,
    body: JSON.stringify({ key: req.jwk }),
    headers: { "Content-Type": "application/json" },
  });
}

/** 公開鍵の削除 */
async function destroyKey(req: DestroyKey) {
  const url: `${RegisterOrDestroyKey}${Jwk["kid"]}` = `${req.url}${req.kid}`;
  return fetcher<Jwk["kid"]>({
    method: "DELETE",
    url,
    token: req.token,
  });
}

/** 公開鍵 */
export function usePublicKeys() {
  const session = useSession();
  const accountIdOrNull = session.data?.user?.accountId ?? null;
  const accessTokenOrNull = session.data?.accessToken ?? null;
  const key: GetKeys | null = accountIdOrNull
    ? `/account/${accountIdOrNull}/keys`
    : null;
  const registerOrDestroyKey: RegisterOrDestroyKey | null = accountIdOrNull
    ? `/internal/accounts/${accountIdOrNull}/keys/`
    : null;

  const publicKeys = useSWR(key, getKeys);
  const registerKeyMutation = useSWRMutation(
    key,
    async (_, { arg }: { arg: Pick<RegisterKey, "jwk"> }) => {
      if (!accessTokenOrNull || !registerOrDestroyKey) return;
      return registerKey({
        url: registerOrDestroyKey,
        token: accessTokenOrNull,
        ...arg,
      });
    },
  );
  const destroyKeyMutation = useSWRMutation(
    key,
    async (_, { arg }: { arg: Pick<DestroyKey, "kid"> }) => {
      if (!accessTokenOrNull || !registerOrDestroyKey) return;
      return destroyKey({
        url: registerOrDestroyKey,
        token: accessTokenOrNull,
        ...arg,
      });
    },
  );

  return {
    ...publicKeys,
    register: registerKeyMutation.trigger,
    destroy: destroyKeyMutation.trigger,
  };
}
