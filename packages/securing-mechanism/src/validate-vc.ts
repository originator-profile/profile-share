import Ajv, { AnySchema, ValidationError } from "ajv";
import addFormats from "ajv-formats";
import { VcValidateFailed } from "./errors";
import { UnverifiedVc, VcValidationFailure, VcValidationResult } from "./types";

/** データモデルへの適合性確認のためのバリデーター */
export function VcValidator<V extends UnverifiedVc>(jsonSchema: AnySchema) {
  const ajv = new Ajv();
  addFormats(ajv);
  const validateVcPayload = ajv.compile(jsonSchema);
  /**
   * VC の妥当性確認
   * @param vc VC (未検証 or 検証済み)
   * @return 妥当性確認結果
   */
  function validate(vc: V): VcValidationResult<V, VcValidationFailure<V>> {
    if (!validateVcPayload(vc.doc)) {
      return new VcValidateFailed<VcValidationFailure<V>>(
        ajv.errorsText(validateVcPayload.errors),
        {
          ...vc,
          error: new ValidationError(validateVcPayload.errors ?? []),
        },
      );
    }

    return vc;
  }
  return validate;
}

/** データモデルへの適合性確認のためのバリデーター */
export type VcValidator<V extends UnverifiedVc> = ReturnType<
  typeof VcValidator<V>
>;
