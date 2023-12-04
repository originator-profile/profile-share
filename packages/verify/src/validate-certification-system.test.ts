import { test, describe, expect } from "vitest";
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

describe("無効な形式の認証制度のとき検証に失敗", async () => {
  test("オブジェクトでない", async () => {
    const invalidCertificationSystem = "invalid";
    const result = validateCertificationSystem(invalidCertificationSystem);
    expect(result).instanceOf(CertificationSystemValidationFailed);
  });
  test("必要なプロパティがない", async () => {
    const invalidCertificationSystem = {};
    const result = validateCertificationSystem(invalidCertificationSystem);
    expect(result).instanceOf(CertificationSystemValidationFailed);
  });
  test("余分なプロパティがある", async () => {
    const invalidCertificationSystem = {
      ...certificationSystem,
      invalid: "invalid",
    };
    const result = validateCertificationSystem(invalidCertificationSystem);
    expect(result).instanceOf(CertificationSystemValidationFailed);
  });
  test("定数値が一致しない", async () => {
    const invalidCertificationSystem = {
      ...certificationSystem,
      type: "invalid",
    };
    const result = validateCertificationSystem(invalidCertificationSystem);
    expect(result).instanceOf(CertificationSystemValidationFailed);
  });
  test("文字列値ではない", async () => {
    const invalidCertificationSystem = {
      ...certificationSystem,
      name: 1,
    };
    const result = validateCertificationSystem(invalidCertificationSystem);
    expect(result).instanceOf(CertificationSystemValidationFailed);
  });
});
