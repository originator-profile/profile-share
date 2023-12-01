import compare from "just-compare";
import { CertificationSystemValidationFailed } from "./errors";
import { CertificationSystem } from "@originator-profile/model";

/** 認証制度ペイロードの確認のためのバリデーター */
export function CertificationSystemValidator() {
  return function validate(
    payload: unknown,
  ): true | CertificationSystemValidationFailed {
    if (typeof payload !== "object")
      return new CertificationSystemValidationFailed("should be an object", {
        payload,
      });
    if (payload === null)
      return new CertificationSystemValidationFailed("should be an object", {
        payload,
      });
    if (
      !compare(
        Object.keys(payload),
        Object.keys(CertificationSystem.properties),
      )
    )
      return new CertificationSystemValidationFailed(
        "should be contain required properties or no contain the other properties",
        { payload },
      );
    const entries = Object.entries(payload) as Array<
      [keyof CertificationSystem, unknown]
    >;
    for (const entry of entries) {
      const [key, value] = entry;
      const propertySchema = CertificationSystem.properties[key];
      if ("const" in propertySchema && value !== propertySchema.const)
        return new CertificationSystemValidationFailed(
          `should be contain value of '${value}' in '${key}' property`,
          { payload },
        );
      if ("type" in propertySchema && typeof value !== propertySchema.type)
        return new CertificationSystemValidationFailed(
          `should be contain ${propertySchema.type} value in '${key}' property`,
          { payload },
        );
    }
    return true;
  };
}

export type CertificationSystemValidator = ReturnType<
  typeof CertificationSystemValidator
>;

/**
 * 認証制度の検証
 * @param payload ペイロード
 * @return 検証結果
 */
export function validateCertificationSystem(
  payload: unknown,
): CertificationSystem | CertificationSystemValidationFailed {
  const validator = CertificationSystemValidator();
  const result = validator(payload);
  if (result !== true) {
    return result;
  }
  return payload as CertificationSystem;
}
