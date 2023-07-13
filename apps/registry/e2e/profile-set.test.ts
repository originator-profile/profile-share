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
  "eyJhbGciOiJFUzI1NiIsImtpZCI6ImpKWXM1X0lMZ1VjODE4MEwtcEJQeEJwZ0EzUUM3ZVp1OXdLT2toOW1ZUFUiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJ0aXRsZSI6Ik9QIOeiuuiqjeOBj-OCkyIsImltYWdlIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2Fzc2V0cy9sb2dvLTJiMDRlNjM1LnN2ZyIsImNhdGVnb3J5IjpbXX0seyJ0eXBlIjoidmlzaWJsZVRleHQiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJsb2NhdGlvbiI6ImgxIiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNkltcEtXWE0xWDBsTVoxVmpPREU0TUV3dGNFSlFlRUp3WjBFelVVTTNaVnAxT1hkTFQydG9PVzFaVUZVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi4wR1RTSlNBSHVZU2FEV0RTcmczRDBXUDF5Y0xHdUp3WW9WNUpyR0NULV9QUXZtdzJlcGNtc0h0ZWpDelkzUk95LTJYY0JQNFZ5MW55ZGhqVXctMXpTdyJ9fV19LCJpc3MiOiJsb2NhbGhvc3QiLCJzdWIiOiJENEYyQzVCNi0xMjlELTQ0RkUtQTQ0MS04MzdCODA4RUY2NDMiLCJpYXQiOjE2ODkwNTkzODcsImV4cCI6MTcyMDY4MTc4N30.0O21U9LaLrGoiDlXCXCVRGUEtDhKQkp1_ieYQOpEeFELKVBQkZY7J9gitNc81_wJ3K_yDdLKhLbsE5lfcww01A";

describe("複数のSigned Document Profilesが存在する場合", async () => {
  beforeAll(async () => {
    await AdminCreate.run([`--id=${accountId}`, `--password=${dummyPassword}`]);
    const response = await fetch(`http://localhost:8080/admin/publisher/${accountId}/dp/`, {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(
          `${accountId}:${dummyPassword}`,
        ).toString("base64")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jwt: dummyJwt,
      }),
    });
    if (!response.ok) {
      const message = await response.text();  
      throw new Error(`API does not exist or server error occurred. Status: ${response.status}, Message: ${message}`);
    }
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
      new URL("http://localhost:8080/.well-known/jwks.json"),
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
