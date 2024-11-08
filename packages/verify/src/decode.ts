import Ajv from "ajv";
import addFormats from "ajv-formats";
import { decodeJwt, JWTPayload } from "jose";
import { JwtOpPayload, JwtDpPayload } from "@originator-profile/model";
import { isJwtOpPayload, isJwtDpPayload } from "@originator-profile/core";
import { JOSEError } from "jose/errors";
import { ProfileClaimsValidationFailed } from "./errors";
import { DecodeResult } from "./types";

/** Signed Profile ペイロードの確認のためのバリデーター */
export function SignedProfileValidator() {
  const ajv = new Ajv();
  addFormats(ajv);
  const validateJwtOpPayload = ajv.compile(JwtOpPayload);
  const validateJwtDpPayload = ajv.compile(JwtDpPayload);
  return { ajv, validateJwtOpPayload, validateJwtDpPayload };
}

/** Signed Profile ペイロードの確認のためのバリデーター */
export type SignedProfileValidator = ReturnType<typeof SignedProfileValidator>;

/**
 * Signed Profile の復号器の生成
 * @param validator ペイロード確認のためのバリデーター (null: 無効)
 * @return 復号器
 * @deprecated
 */
export function TokenDecoder(validator: SignedProfileValidator | null) {
  /**
   * Signed Profile の復号
   * @param jwt JWT
   * @return 復号結果
   */
  function decodeToken(jwt: string): DecodeResult {
    let payload: JWTPayload;
    try {
      payload = decodeJwt(jwt);
    } catch (e) {
      const error = e as JOSEError;
      return new ProfileClaimsValidationFailed(error.message, { error, jwt });
    }
    if (validator) {
      const valid = isJwtOpPayload(payload)
        ? validator.validateJwtOpPayload(payload)
        : validator.validateJwtDpPayload(payload);

      if (!valid) {
        const errors = isJwtOpPayload(payload)
          ? validator.validateJwtOpPayload.errors
          : validator.validateJwtDpPayload.errors;

        return new ProfileClaimsValidationFailed(
          validator.ajv.errorsText(errors),
          {
            errors: errors ?? [],
            payload,
            jwt,
          },
        );
      }
    }
    if (isJwtOpPayload(payload)) return { op: true, payload, jwt };
    if (isJwtDpPayload(payload)) return { dp: true, payload, jwt };
    return new ProfileClaimsValidationFailed("Unknown Claims Set", {
      errors: [],
      payload,
      jwt,
    });
  }

  return decodeToken;
}

export type TokenDecoder = ReturnType<typeof TokenDecoder>;
