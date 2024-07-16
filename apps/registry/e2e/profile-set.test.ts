import { afterAll, beforeAll, describe, expect, test } from "vitest";
import jsonld from "jsonld";
import { addYears } from "date-fns";
import { Dp, DpText } from "@originator-profile/model";
import { signDp, signBody } from "@originator-profile/sign";
import {
  expandProfileSet,
  ProfilesVerifier,
  RemoteKeys,
} from "@originator-profile/verify";
import privateKey from "../account-key.example.priv.json";

const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
const dummyPassword = "bdf70f3d38c1311fa06a211a2205623a";

const dp: Dp = {
  type: "dp",
  issuedAt: new Date().toISOString(),
  expiredAt: addYears(new Date(), 1).toISOString(),
  issuer: "localhost",
  subject: "d4f2c5b6-129d-44fe-a441-837b808ef643",
  item: [],
};

describe("複数のSigned Document Profilesが存在する場合", () => {
  beforeAll(async () => {
    const text: DpText = {
      type: "text",
      location: ":not(*)",
      proof: { jws: await signBody("dummy", privateKey) },
      url: "https://dummy.example.com/",
    };
    const jwt = await signDp({ ...dp, item: [text] }, privateKey);
    const response = await fetch(
      `http://localhost:8080/admin/publisher/${accountId}/dp/`,
      {
        method: "POST",
        headers: {
          authorization: `Basic ${Buffer.from(
            `${accountId}:${dummyPassword}`,
          ).toString("base64")}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jwt,
        }),
      },
    );
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `API does not exist or server error occurred. Status: ${response.status}, Message: ${message}`,
      );
    }
  });

  afterAll(async () => {
    const response = await fetch(
      `http://localhost:8080/admin/publisher/${accountId}/`,
      {
        method: "DELETE",
        headers: {
          authorization: `Basic ${Buffer.from(
            `${accountId}:${dummyPassword}`,
          ).toString("base64")}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input: {
            id: dp.subject,
          },
        }),
      },
    );
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `API does not exist or server error occurred. Status: ${response.status}, Message: ${message}`,
      );
    }
  });

  // TODO: 拡張機能での SD-JWT OP の検証の実装ができたら .skip 外して
  test.skip("/ps.json response is a valid Profile Set", async () => {
    const res = await fetch("http://localhost:8080/ps.json");
    const profiles = await res.json();
    const { profile } = await expandProfileSet(profiles);
    const registry = "localhost";
    const keys = RemoteKeys(
      new URL("http://localhost:8080/.well-known/jwks.json"),
    );
    const origin = "http://localhost:8080";
    const verify = ProfilesVerifier({ profile }, keys, registry, null, origin);
    const verifyResults = await verify();
    verifyResults.forEach((result) => {
      expect(result).not.toBeInstanceOf(Error);
      expect(result).toHaveProperty("jwt");
    });
  });
});

test("/.well-known/ps.json response is a valid JSON-LD", async () => {
  const res = await fetch("http://localhost:8080/.well-known/ps.json");
  const json = await res.json();
  await expect(jsonld.expand(json)).resolves.not.toThrowError();
});
