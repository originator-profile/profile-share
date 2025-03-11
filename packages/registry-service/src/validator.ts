import Ajv, { Schema } from "ajv";
import addFormats from "ajv-formats";
import { BadRequestError } from "http-errors-enhanced";
import { Jwk, OriginatorProfile } from "@originator-profile/model";

export function ValidatorService() {
  const ajv = addFormats(new Ajv({ removeAdditional: true }));

  /**
   * バリデーターの生成
   * @param schema スキーマ
   * @return バリデーター
   */
  function createValidator<Value>(schema: Schema): (input: unknown) => Value {
    const validate = ajv.compile(schema);

    /**
     * バリデーター
     * @param input 対象のオブジェクト
     * @throws {BadRequestError} バリデーション失敗
     * @return 妥当値
     */
    function validator(input: unknown): Value {
      const output = structuredClone(input);
      if (!validate(output)) {
        throw Object.assign(
          new BadRequestError(ajv.errorsText(validate.errors)),
          { errors: validate.errors },
        );
      }

      return output as Value;
    }

    return validator;
  }

  return {
    /**
     * Originator Profile の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @throws {BadRequestError} バリデーション失敗
     * @return 妥当な Originator Profile
     */
    originatorProfileValidate:
      createValidator<OriginatorProfile>(OriginatorProfile),

    /**
     * JWK の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @throws {BadRequestError} バリデーション失敗
     * @return 妥当な JWK
     */
    jwkValidate: createValidator<Jwk>(Jwk),
  };
}

export type ValidatorService = ReturnType<typeof ValidatorService>;
