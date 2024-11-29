import { OriginatorProfileSet } from "@originator-profile/model";
import { decodeOps } from "@originator-profile/verify";

const REGISTRY_OPS: OriginatorProfileSet = import.meta.env.REGISTRY_OPS;
/**
 * OP レジストリの OPS を取得する
 * @returns レジストリのOPS複合結果
 */
export function getRegistryOps(): ReturnType<typeof decodeOps> {
  return decodeOps(REGISTRY_OPS);
}
