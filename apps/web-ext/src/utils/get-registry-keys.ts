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
 * @returns レジストリの JWKS
 */
export function getRegistryKeys(): Keys {
  const registry = import.meta.env.PROFILE_ISSUER;
  const registryOps = getRegistryOps();
  if (registryOps instanceof OpsInvalid) {
    throw registryOps;
  }

  return LocalKeys(
    registryOps.find(
      (op) => op.core.doc.credentialSubject.id === `dns:${registry}`,
    )?.core.doc.credentialSubject.jwks ?? { keys: [] },
  );
}
