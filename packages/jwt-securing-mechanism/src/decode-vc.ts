import { OpVc } from "@originator-profile/model";
import addFormats from "ajv-formats";
import Ajv from "ajv/dist/2019";
import { AnySchema } from "ajv";
import * as draft7MetaSchema from "ajv/dist/refs/json-schema-draft-07.json";
import { decodeJwt, JWTPayload } from "jose";
import { JOSEError } from "jose/errors";
import { mapToVcDataModel } from "./mapping";

/** 復元されたデータモデルの確認のためのバリデーター */
export function VcValidator(jsonSchema: AnySchema) {
  const ajv = new Ajv();
  addFormats(ajv);
  ajv.addMetaSchema(draft7MetaSchema);
  const validateVcPayload = ajv.compile(jsonSchema);
  return { ajv, validateVcPayload };
}

/** 復元されたデータモデルの確認のためのバリデーター */
export type VcValidator = ReturnType<typeof VcValidator>;

/**
 * データモデルの復号器の生成
 * @param validator 復元されたペイロード確認のためのバリデーター (undefined: 無効)
 * @return 復号器
 */
export function VcDecoder<T extends OpVc>(validator?: VcValidator) {
  /**
   * データモデルの複号
   * @param jwt JWT
   * @return 複号結果
   */
  function decode(jwt: string): T | Error {
    let jwtPayload: JWTPayload;
    try {
      jwtPayload = decodeJwt(jwt);
    } catch (e) {
      const error = e as JOSEError;
      // TODO: 複号失敗時のエラーを定義して
      return error;
    }
    /* JWTペイロードからデータモデルを復元する */
    const vc = mapToVcDataModel(jwtPayload);
    if (typeof validator === "undefined") {
      return vc as T;
    }
    if (validator.validateVcPayload(vc)) {
      return vc as T;
    }
    // TODO: ペイロード検証失敗時のエラーを定義して
    return new Error(
      validator.ajv.errorsText(validator.validateVcPayload.errors),
    );
  }

  return decode;
}

export type VcDecoder = ReturnType<typeof VcDecoder>;
