import { OpVc } from "@originator-profile/model";
import addFormats from "ajv-formats";
import Ajv from "ajv/dist/2019";
import { AnySchema, ValidationError } from "ajv";
import * as draft7MetaSchema from "ajv/dist/refs/json-schema-draft-07.json";
import { decodeJwt, JWTPayload } from "jose";
import { JOSEError } from "jose/errors";
import { JwtVcDecodeFailed, JwtVcValidateFailed } from "./errors";
import { JwtVcDecodingResult } from "./types";

/** 復元されたデータモデルの確認のためのバリデーター */
export function JwtVcValidator(jsonSchema: AnySchema) {
  const ajv = new Ajv();
  addFormats(ajv);
  ajv.addMetaSchema(draft7MetaSchema);
  const validateVcPayload = ajv.compile(jsonSchema);
  return { ajv, validateVcPayload };
}

/** 復元されたデータモデルの確認のためのバリデーター */
export type JwtVcValidator = ReturnType<typeof JwtVcValidator>;

/**
 * データモデルの復号器の生成
 * @param validator 復元されたペイロード確認のためのバリデーター (undefined: 無効)
 * @return 復号器
 */
export function JwtVcDecoder<T extends OpVc>(validator?: JwtVcValidator) {
  /**
   * データモデルの複号
   * @param jwt JWT
   * @return 複号結果
   */
  function decode(jwt: string): JwtVcDecodingResult<T> {
    let jwtPayload: JWTPayload;
    try {
      jwtPayload = decodeJwt(jwt);
    } catch (e) {
      const error = e as JOSEError;
      return new JwtVcDecodeFailed("JWT VC Decoding Failed", { jwt, error });
    }
    const vc = jwtPayload as T;
    if (typeof validator === "undefined") {
      return { payload: vc, jwt };
    }
    if (validator.validateVcPayload(vc)) {
      return { payload: vc, jwt };
    }
    return new JwtVcValidateFailed(
      validator.ajv.errorsText(validator.validateVcPayload.errors),
      {
        payload: vc,
        jwt,
        error: new ValidationError(validator.ajv.errors ?? []),
      },
    );
  }

  return decode;
}

export type JwtVcDecoder<T extends OpVc> = ReturnType<typeof JwtVcDecoder<T>>;
