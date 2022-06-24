import Ajv from "ajv";
import addFormats from "ajv-formats";
import { decodeJwt, JWTPayload } from "jose";
import JwtOpPayload from "@webdino/profile-model/src/jwt-op-payload";
import JwtDpPayload from "@webdino/profile-model/src/jwt-dp-payload";
import { isJwtOpPayload, isJwtDpPayload } from "@webdino/profile-core";
import { JOSEError } from "jose/dist/types/util/errors";
import { ProfileClaimsValidationFailed } from "./errors";
import { DecodeResult } from "./types";

/** ペイロードの確認用 */
function Validator() {
  const ajv = new Ajv();
  addFormats(ajv);
  const validateJwtOpPayload = ajv.compile(JwtOpPayload);
  const validateJwtDpPayload = ajv.compile(JwtDpPayload);
  return { ajv, validateJwtOpPayload, validateJwtDpPayload };
}

/**
 * Profile の Token の復号器の生成
 * @return 復号器
 */
export function TokenDecoder() {
  const validator = Validator();

  /**
   * Profile の Token の復号
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
        }
      );
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
