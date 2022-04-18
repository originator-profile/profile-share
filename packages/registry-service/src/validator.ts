import Ajv from "ajv";
import addFormats from "ajv-formats";
import { BadRequestError } from "http-errors-enhanced";
import omit from "just-omit";
import Op from "@webdino/profile-model/src/op";
import Jwk from "@webdino/profile-model/src/jwk";
// TODO: Node.js 17+ ならば不要
import structuredClone from "@ungap/structured-clone";

export function ValidatorService() {
  const ajv = addFormats(new Ajv({ removeAdditional: true }));
  const op = ajv.compile(Op);
  const jwk = ajv.compile(omit(Jwk, "$id"));

  /**
   * OP の確認 (注: 署名の検証は別で行ってください)
   * @param input 対象のオブジェクト
   * @return 妥当な OP
   */
  function opValidate(input: unknown): Op | Error {
    const output = structuredClone(input);
    if (op(output)) {
      return output as Op;
    } else {
      return Object.assign(new BadRequestError(ajv.errorsText(op.errors)), {
        errors: op.errors,
      });
    }
  }

  /**
   * JWK の確認 (注: 署名の検証は別で行ってください)
   * @param input 対象のオブジェクト
   * @return 妥当な JWK
   */
  function jwkValidate(input: unknown): Jwk | Error {
    const output = structuredClone(input);
    if (jwk(output)) {
      return output as Jwk;
    } else {
      return Object.assign(new BadRequestError(ajv.errorsText(jwk.errors)), {
        errors: jwk.errors,
      });
    }
  }

  return { opValidate, jwkValidate };
}

export type ValidatorService = ReturnType<typeof ValidatorService>;
