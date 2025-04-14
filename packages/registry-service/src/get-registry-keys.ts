import { Keys, LocalKeys } from "@originator-profile/cryptography";
import { decodeOps, OpsInvalid } from "@originator-profile/verify";

const { REGISTRY_OPS = "", PROFILE_ISSUER } = process.env;
/**
 * OP レジストリの OPS を取得する
 * @returns レジストリのOPS復号結果
 */
function getRegistryOps(): ReturnType<typeof decodeOps> {
  try {
    return decodeOps(JSON.parse(REGISTRY_OPS));
  } catch {
    return new OpsInvalid("Invalid Registry OPS", []);
  }
}

/**
 * OP レジストリの JWKS を取得する
 * @returns レジストリの JWKS
 */
export function getRegistryKeys(): Keys {
  const registryOps = getRegistryOps();
  if (registryOps instanceof OpsInvalid) {
    throw registryOps;
  }

  return LocalKeys(
    registryOps.find(
      (op) => op.core.doc.credentialSubject.id === `dns:${PROFILE_ISSUER}`,
    )?.core.doc.credentialSubject.jwks ?? { keys: [] },
  );
}
