import crypto from "node:crypto";
import { describe, expect, test } from "vitest";
import { parseCaId } from "./content-attestation";

describe("parseCaId()", () => {
  test("UUIDを指定したとき、そのまま返す", () => {
    const uuid = crypto.randomUUID();
    expect(parseCaId(uuid)).toBe(uuid);
  });

  test("UUID URNを指定したとき、UUID文字列形式に変換", () => {
    const uuid = crypto.randomUUID();
    expect(parseCaId(`urn:uuid:${uuid}`)).toBe(uuid);
  });
});
