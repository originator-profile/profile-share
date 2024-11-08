import { CoreProfile, Jwk } from "@originator-profile/model";
import { signVc } from "@originator-profile/jwt-securing-mechanism";

/**
 * CP への署名
 * @param cp CoreProfile オブジェクト
 * @param privateKey プライベート鍵
 * @param alg Algorithm identifier
 * @return JWT でエンコードされた CP
 */
export async function signCp(
  cp: CoreProfile,
  privateKey: Jwk,
  options: {
    alg?: string;
    issuedAt: Date;
    expiredAt: Date;
  },
): Promise<string> {
  return signVc(cp, privateKey, { ...options, alg: "ES256" });
}
