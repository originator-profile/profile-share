import { OpCredential, OpHolder } from "@originator-profile/model";

/** 検証種別 */
export type VerificationType = "自己宣言" | "第三者検証";

/** 検証種別の取得 */
export const getVerificationType = (
  credential: OpCredential,
  holder: OpHolder,
): VerificationType =>
  credential.verifier === holder.domainName ? "自己宣言" : "第三者検証";
