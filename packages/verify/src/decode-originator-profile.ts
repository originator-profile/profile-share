import Ajv from "ajv";
import addFormats from "ajv-formats";
import { JWTPayload } from "jose";
import { JOSEError } from "jose/errors";
import { OriginatorProfile } from "@originator-profile/model";
import { decodeSdJwt } from "./decode-sd-jwt";

/** Originator Profile ペイロードの確認のためのバリデーター */
export function OriginatorProfileValidator() {
  const ajv = new Ajv();
  addFormats(ajv);
  const validateOriginatorProfilePayload = ajv.compile(OriginatorProfile);
  return { ajv, validateOriginatorProfilePayload };
}

/** Signed Profile ペイロードの確認のためのバリデーター */
export type OriginatorProfileValidator = ReturnType<
  typeof OriginatorProfileValidator
>;

/**
 * Originator Profile の復号器の生成
 * @param validator ペイロード確認のためのバリデーター (null: 無効)
 * @return 復号器
 */
export function OriginatorProfileDecoder(
  validator: OriginatorProfileValidator | null,
) {
  /**
   * Originator Profile の複号
   * @param sdJwt SD-JWT
   * @return 複号結果
   */
  function decode(sdJwt: string): OriginatorProfile | Error {
    let issuerJwtPayload: JWTPayload;
    try {
      issuerJwtPayload = decodeSdJwt(sdJwt);
    } catch (e) {
      const error = e as JOSEError;
      // TODO: 複号失敗時のエラーを定義して
      return error;
    }
    if (validator) {
      const valid =
        validator.validateOriginatorProfilePayload(issuerJwtPayload);
      if (!valid) {
        // TODO: ペイロード検証失敗時のエラーを定義して
        return new Error(
          validator.ajv.errorsText(
            validator.validateOriginatorProfilePayload.errors,
          ),
        );
      }
    }
    return issuerJwtPayload as OriginatorProfile;
  }

  return decode;
}

export type OriginatorProfileDecoder = ReturnType<
  typeof OriginatorProfileDecoder
>;
