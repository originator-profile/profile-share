import { CoreProfile, Jwk } from "@originator-profile/model";
import { signJwtVc } from "@originator-profile/securing-mechanism";

/**
 * CP への署名
 * @param cp CoreProfile オブジェクト
 * @param privateKey プライベート鍵
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
  return signJwtVc(cp, privateKey, options);
}
