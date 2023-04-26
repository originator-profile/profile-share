import { OpCredential, OpHolder } from "@webdino/profile-model";

/** 検証種別の取得 */
export const getVerificationType = (
  credential: OpCredential,
  holder: OpHolder
) => (credential.verifier === holder.domainName ? "自己検証" : "第三者検証");
