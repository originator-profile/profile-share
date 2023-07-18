import Ajv, { Schema } from "ajv";
import addFormats from "ajv-formats";
import { BadRequestError } from "http-errors-enhanced";
import { Op, Dp, Jwk } from "@originator-profile/model";
import {
  SignedProfileValidator,
  TokenDecoder,
} from "@originator-profile/verify";
// TODO: Node.js 17+ ならば不要
import structuredClone from "@ungap/structured-clone";

export function ValidatorService() {
  const ajv = addFormats(new Ajv({ removeAdditional: true }));
  const signedProfileValidator = SignedProfileValidator();
  const decodeToken = TokenDecoder(signedProfileValidator);

  /**
   * バリデーターの生成
   * @param schema スキーマ
   * @return バリデーター
   */
  function createValidator<Value>(
    schema: Schema,
  ): (input: unknown) => Value | Error {
    const validate = ajv.compile(schema);

    /**
     * バリデーター
     * @param input 対象のオブジェクト
     * @return 妥当値
     */
    function validator(input: unknown): Value | Error {
      const output = structuredClone(input);
      if (validate(output)) {
        return output as Value;
      } else {
        return Object.assign(
          new BadRequestError(ajv.errorsText(validate.errors)),
          { errors: validate.errors },
        );
      }
    }

    return validator;
  }

  return {
    /**
     * OP の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @return 妥当な OP
     */
    opValidate: createValidator<Op>(Op),

    /**
     * JWK の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @return 妥当な JWK
     */
    jwkValidate: createValidator<Jwk>(Jwk),

    /**
     * DP の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @return 妥当な DP
     */
    dpValidate: createValidator<Dp>(Dp),

    /**
     * Profile の Token の復号
     * @param jwt JWT
     * @return 復号結果
     */
    decodeToken,
  };
}

export type ValidatorService = ReturnType<typeof ValidatorService>;
