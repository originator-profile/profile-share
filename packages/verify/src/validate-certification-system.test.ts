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
  certifier: {
    id: "d011896c-2d44-4f8b-8d8c-30ce516ed68b",
    name: "Certifier (Example)",
  },
  verifier: {
    id: "d5ff9af0-2cfa-42e5-a430-1971486bfe12",
    name: "Verifier (Example)",
  },
};

test("有効な形式の認証制度のとき検証に成功", async () => {
  const result = validateCertificationSystem(certificationSystem);
  expect(result).toMatchObject(certificationSystem);
});

describe("無効な形式の認証制度のとき検証に失敗", () => {
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
