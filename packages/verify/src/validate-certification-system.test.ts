import { test, expect } from "vitest";
import { validateCertificationSystem } from "./validate-certification-system";
import { CertificationSystemValidationFailed } from "./errors";
import { CertificationSystem } from "@originator-profile/model";

const certificationSystem: CertificationSystem = {
  type: "certification-system",
  name: "Certification System Name",
  description: "Certification System Description",
  url: "https://example.com/",
  urlTitle: "Example Website",
};

test("有効な形式の認証制度のとき検証に成功", async () => {
  const result = validateCertificationSystem(certificationSystem);
  expect(result).toMatchObject(certificationSystem);
});

test("無効な形式の認証制度のとき検証に失敗", async () => {
  const invalidCertificationSystem = {
    ...certificationSystem,
    invalid: "invalid",
  };
  const result = validateCertificationSystem(invalidCertificationSystem);
  expect(result).instanceOf(CertificationSystemValidationFailed);
});
