import { generateKey } from "@originator-profile/cryptography";
import { CoreProfile } from "@originator-profile/model";
import { DecodedOps } from "../originator-profile-set";
import { getMappedKeys, getTupledKeys } from "./get-keys";
import { patch, cp, wmp } from "../helper";
import { describe, expect, test } from "vitest";

const opId = {
  some: "dns:some.example.org" as const,
  another: "dns:another.example.org" as const,
};

describe("get-keys", async () => {
  const some = await generateKey();
  const another = await generateKey();
  const someCp: CoreProfile = patch(cp, [
    {
      op: "replace",
      path: ["credentialSubject", "id"],
      value: opId.some,
    },
    {
      op: "add",
      path: ["credentialSubject", "jwks", "keys", 0],
      value: some.publicKey,
    },
  ]);
  const anotherCp: CoreProfile = patch(cp, [
    {
      op: "replace",
      path: ["credentialSubject", "id"],
      value: opId.another,
    },
    {
      op: "add",
      path: ["credentialSubject", "jwks", "keys", 0],
      value: another.publicKey,
    },
  ]);
  const ops: DecodedOps = [
    {
      core: {
        doc: someCp,
        source: "",
      },
      media: { doc: wmp, source: "" },
    },
    {
      core: {
        doc: anotherCp,
        source: "",
      },
      media: { doc: wmp, source: "" },
    },
  ];

  test("getMappedKeys()はOP IDと鍵の連想配列が得られる", () => {
    const result = getMappedKeys(ops);

    // 2つのOP IDが存在すること
    expect(Object.keys(result)).toHaveLength(2);
    expect(result[opId.some]).toBeDefined();
    expect(result[opId.another]).toBeDefined();

    // 各OP IDに対応する鍵が正しく取得されていること
    expect(result[opId.some].keys).toHaveLength(1);
    expect(result[opId.some].keys[0]).toEqual(some.publicKey);

    expect(result[opId.another].keys).toHaveLength(1);
    expect(result[opId.another].keys[0]).toEqual(another.publicKey);
  });

  test("getTupledKeys()はOP IDと鍵のタプルが得られる", () => {
    const [opIds, jwks] = getTupledKeys(ops);

    // OP IDが配列で返されること
    expect(Array.isArray(opIds)).toBe(true);
    expect(opIds).toHaveLength(2);
    expect(opIds).toContain(opId.some);
    expect(opIds).toContain(opId.another);

    // すべての鍵が含まれていること
    expect(jwks.keys).toHaveLength(2);
    expect(jwks.keys).toContainEqual(some.publicKey);
    expect(jwks.keys).toContainEqual(another.publicKey);
  });

  test("getMappedKeys()は同じOP IDの鍵を重複排除する", async () => {
    const additionalKey1 = await generateKey();
    const additionalKey2 = await generateKey();

    // 同じOP IDで異なる鍵を持つCPを作成
    const cpWithMultipleKeys: CoreProfile = patch(someCp, [
      {
        op: "add",
        path: ["credentialSubject", "jwks", "keys", 1],
        value: additionalKey1.publicKey,
      },
      {
        op: "add",
        path: ["credentialSubject", "jwks", "keys", 2],
        value: additionalKey2.publicKey,
      },
    ]);

    const opsWithMultipleKeys: DecodedOps = patch(ops, [
      {
        op: "add",
        path: [2],
        value: {
          core: { doc: cpWithMultipleKeys, source: "" },
          media: { doc: wmp, source: "" },
        },
      },
    ]);

    const result = getMappedKeys(opsWithMultipleKeys);

    // 同じOP IDでも鍵が重複排除されていること
    expect(result[opId.some].keys).toHaveLength(3);
    expect(result[opId.some].keys).toContainEqual(some.publicKey);
    expect(result[opId.some].keys).toContainEqual(additionalKey1.publicKey);
    expect(result[opId.some].keys).toContainEqual(additionalKey2.publicKey);
  });

  test("getMappedKeys()は空のOPSに対して空のオブジェクトを返す", () => {
    const result = getMappedKeys([]);
    expect(Object.keys(result)).toHaveLength(0);
  });

  test("getTupledKeys()は空のOPSに対して空の配列と空のJWKSを返す", () => {
    const [opIds, jwks] = getTupledKeys([]);
    expect(opIds).toHaveLength(0);
    expect(jwks.keys).toHaveLength(0);
  });
});
