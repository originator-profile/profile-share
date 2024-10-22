import { OpVc } from "@originator-profile/model";
import { jwtVerify, JWTVerifyResult } from "jose";
import { JOSEError } from "jose/errors";
import { Keys } from "@originator-profile/cryptography";

// type Decoder<T extends OpVc> = (vc: string) => T | Error;
// type Validator<T extends OpVc> = (vc: T, cxt: any) => boolean;

// export class Verifier<T extends OpVc> {
//   decoder: Decoder<T>;
//   validators: Validator<T>[];
//   rootOPS: any;
//   constructor(decoder: Decoder<T>, validators: Validator<T>[], rootOPS) {
//     this.decoder = decoder;
//     this.validators = validators;
//     this.rootOPS = rootOPS;
//   }

//   async verify(jwt: string, context: any) {
//     const decoded = this.decoder(jwt);
//     if (decoded instanceof Error) return decoded;
//     const verified = await jwtVerify(jwt, keys, { issuer }).catch(
//       (e: JOSEError) => e,
//     );
//     this.validators.forEach((validator) => {
//       validator(decoded, context);
//     });
//     if (verified instanceof Error) {
//       // TODO: 署名検証失敗時のエラーを定義して
//       return verified;
//     }
//     return { ...verified, payload: decoded };
//   }
// }

/**
 * JWT VC の検証者の作成
 * @param keys 公開鍵
 * @param issuer 公開鍵の有効な発行者
 * @param decoder 復号器
 * @return 検証者
 */
export function JwtVcVerifier<T extends OpVc>(
  keys: Keys,
  issuer: string,
  decoder: (vc: string) => T | Error,
  /* TODO: originの確認をする */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  origin?: URL["origin"],
): (jwt: string) => Promise<(JWTVerifyResult & { payload: T }) | Error> {
  /**
   * JWT VC の検証
   * @param jwt JWT
   * @return 検証結果
   */
  async function verify(jwt: string) {
    const decoded = decoder(jwt);
    if (decoded instanceof Error) return decoded;
    const verified = await jwtVerify(jwt, keys, { issuer }).catch(
      (e: JOSEError) => e,
    );
    if (verified instanceof Error) {
      // TODO: 署名検証失敗時のエラーを定義して
      return verified;
    }
    return { ...verified, payload: decoded };
  }

  return verify;
}

export type JwtVcVerifier = ReturnType<typeof JwtVcVerifier>;
