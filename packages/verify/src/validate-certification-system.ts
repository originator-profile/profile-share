import Ajv from "ajv";
import { CertificationSystemValidationFailed } from "./errors";
import { CertificationSystem } from "@originator-profile/model";

/** 認証制度ペイロードの確認のためのバリデーター */
export function CertificationSystemValidator() {
  const ajv = new Ajv();
  const validateCertificationSystemPayload = ajv.compile(CertificationSystem);
  return { ajv, validateCertificationSystemPayload };
}

/**
 * 認証制度の検証
 * @param payload ペイロード
 * @return 検証結果
 */
export function validateCertificationSystem(
  payload: unknown,
): CertificationSystem | CertificationSystemValidationFailed {
  const validator = CertificationSystemValidator();
  const valid = validator.validateCertificationSystemPayload(payload);
  if (!valid) {
    const errors = validator.validateCertificationSystemPayload.errors;
    return new CertificationSystemValidationFailed(
      validator.ajv.errorsText(errors),
      {
        errors: errors ?? [],
        payload,
      },
    );
  }
  return payload;
}
