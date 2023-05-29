import { afterAll, beforeAll, describe, expect, test } from "vitest";
import crypto from "node:crypto";
import jsonld from "jsonld";
import {
  expandProfileSet,
  ProfilesVerifier,
  RemoteKeys,
} from "@webdino/profile-verify";
import { AdminCreate } from "../src/commands/admin/create";
import { AdminDelete } from "../src/commands/admin/delete";

const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
const dummyPassword = crypto.randomBytes(16).toString("hex");
const dummyJwt =
  "eyJhbGciOiJFUzI1NiIsImtpZCI6IktzLUpscm1nMUhIVE82NHdUSlB0bEUxQ1RqTFEtR1k3dGkzMVFWWG9HQ2siLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29wci53ZWJkaW5vLm9yZy9qd3QvY2xhaW1zL2RwIjp7Iml0ZW0iOlt7InR5cGUiOiJ3ZWJzaXRlIiwidXJsIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwidGl0bGUiOiJPUCDnorroqo3jgY_jgpMifSx7InR5cGUiOiJodG1sIiwidXJsIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwibG9jYXRpb24iOiJoMSIsInByb29mIjp7Imp3cyI6ImV5SmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJa3R6TFVwc2NtMW5NVWhJVkU4Mk5IZFVTbEIwYkVVeFExUnFURkV0UjFrM2RHa3pNVkZXV0c5SFEyc2lMQ0ppTmpRaU9tWmhiSE5sTENKamNtbDBJanBiSW1JMk5DSmRmUS4ueXNnYW1xWnRaN0dkN1VxVTRENjFqTWg1TGFVS0s5aXc4UTllSk0zN3pJM3BoY3F4Q0lHSklZeHhLa0hMaEs2UkY5Z2FEdVo1eEU5Ykt4QnRNSDA4YlEifX1dfSwiaXNzIjoibG9jYWxob3N0Iiwic3ViIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaWF0IjoxNjc1MDU3NDYxLCJleHAiOjE5OTA2NzY2NjF9.zoBT2cXr86U9PSj_LxUHEGrOZHYdEn2XtHBeLqC60ToUOutW8YiIsJCjITAceajGyXIpTa51ktQlLxvD1mnCAg";

describe("複数のSigned Document Profilesが存在する場合", async () => {
  beforeAll(async () => {
    await AdminCreate.run([`--id=${accountId}`, `--password=${dummyPassword}`]);
    await fetch(`http://localhost:8080/admin/publisher/${accountId}/issue`, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(
          `${accountId}:${dummyPassword}`
        ).toString("base64")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jwt: dummyJwt,
      }),
    });
  });

  afterAll(async () => {
    await AdminDelete.run([`--id=${accountId}`]);
  });

  test("/ps.json response is a valid Profile Set", async () => {
    const res = await fetch("http://localhost:8080/ps.json");
    const profiles = await res.json();
    const { profile } = await expandProfileSet(profiles);
    const registry = "localhost";
    const keys = RemoteKeys(
      new URL("http://localhost:8080/.well-known/jwks.json")
    );
    const verify = ProfilesVerifier({ profile }, keys, registry, null);
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
  await jsonld.expand(json);
});
