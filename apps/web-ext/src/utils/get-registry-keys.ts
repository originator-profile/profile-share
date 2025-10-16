import { Keys, LocalKeys } from "@originator-profile/cryptography";
import { OriginatorProfileSet } from "@originator-profile/model";
import { decodeOps, OpsInvalid } from "@originator-profile/verify";

const REGISTRY_OPS: OriginatorProfileSet = import.meta.env.REGISTRY_OPS;
/**
 * OP レジストリの OPS を取得する
 * @returns レジストリのOPS復号結果
 */
function getRegistryOps(): ReturnType<typeof decodeOps> {
  return decodeOps(REGISTRY_OPS);
}

/**
 * OP レジストリの JWKS を取得する
 * @returns レジストリの Issuer, JWKS のタプル
 */
export function getRegistryKeys(): [
  issuer: string | string[] /* ← TODO */,
  Keys,
] {
  const registryOps = getRegistryOps();
  if (registryOps instanceof OpsInvalid) {
    throw registryOps;
  }

  // TODO: トラストアンカーとなる 各 CP issuers ごとでの JWKS の取得方法に変更し安全性を高めるべし
  // https://github.com/originator-profile/profile/issues/2148
  const kidSet = new Set<string>();
  const keys = registryOps
    .flatMap((op) => op.core.doc.credentialSubject.jwks.keys)
    .filter(({ kid }) => !kidSet.has(kid) && kidSet.add(kid));

  return [registryOps.flatMap((op) => op.core.doc.issuer), LocalKeys({ keys })];
}
