import { Keys, LocalKeys } from "@originator-profile/cryptography";
import { OriginatorProfileSet } from "@originator-profile/model";
import {
  OpsInvalid,
  decodeOps,
  getTupledKeys,
} from "@originator-profile/verify";

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
export function getRegistryKeys(): [issuer: string | string[], Keys] {
  const registryOps = getRegistryOps();
  if (registryOps instanceof OpsInvalid) {
    throw registryOps;
  }

  const [issuer, jwks] = getTupledKeys(registryOps);

  return [issuer, LocalKeys(jwks)];
}
