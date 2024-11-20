import Ajv, { Schema } from "ajv";
import addFormats from "ajv-formats";
import { BadRequestError } from "http-errors-enhanced";
import { Op, Dp, Jwk, OriginatorProfile } from "@originator-profile/model";
import {
  ProfileClaimsValidationFailed,
  SignedProfileValidator,
  TokenDecoder,
} from "@originator-profile/verify";

export function ValidatorService() {
  const ajv = addFormats(new Ajv({ removeAdditional: true }));
  const signedProfileValidator = SignedProfileValidator();
  const decodeToken = TokenDecoder(signedProfileValidator);

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
     * OP の確認 (注: 署名の検証は別で行ってください)
     * @deprecated
     * @param input 対象のオブジェクト
     * @throws {BadRequestError} バリデーション失敗
     * @return 妥当な OP
     */
    opValidate: createValidator<Op>(Op),

    /**
     * JWK の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @throws {BadRequestError} バリデーション失敗
     * @return 妥当な JWK
     */
    jwkValidate: createValidator<Jwk>(Jwk),

    /**
     * DP の確認 (注: 署名の検証は別で行ってください)
     * @param input 対象のオブジェクト
     * @throws {BadRequestError} バリデーション失敗
     * @return 妥当な DP
     */
    dpValidate: createValidator<Dp>(Dp),

    /**
     * Profile の Token の復号
     * @param jwt JWT
     * @throws {BadRequestError} バリデーション失敗
     * @return 復号結果
     */
    decodeToken(jwt: string) {
      const decoded = decodeToken(jwt);

      if (decoded instanceof ProfileClaimsValidationFailed) {
        throw new BadRequestError(
          `ProfileClaimsValidationFailed: ${decoded.message}`,
        );
      }

      return decoded;
    },
  };
}

export type ValidatorService = ReturnType<typeof ValidatorService>;
