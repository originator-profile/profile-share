import { test, expect, describe, beforeAll, afterAll } from "vitest";
import crypto from "node:crypto";
import { AdminCreate } from "../src/commands/admin/create";
import { AdminDelete } from "../src/commands/admin/delete";

const accountId = "d613c1d6-5312-41e9-98ad-2b99765955b6";

test("/admin/account/{id} response is an unauthorized error", async () => {
  const endpoint = `http://localhost:8080/admin/account/${accountId}`;
  const res = await fetch(endpoint);
  expect(res.ok).toBe(false);
  expect(res.status).toBe(401);
});

describe("Request with administrative privileges", async () => {
  const dummyPassword = crypto.randomBytes(16).toString("hex");

  beforeAll(async () => {
    await AdminCreate.run([`--id=${accountId}`, `--password=${dummyPassword}`]);
  });

  afterAll(async () => {
    await AdminDelete.run([`--id=${accountId}`]);
  });

  test("/admin/account/{id} response is a valid JSON", async () => {
    const endpoint = `http://localhost:8080/admin/account/${accountId}`;
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${accountId}:${dummyPassword}`
        ).toString("base64")}`,
      },
    });
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: accountId });
  });
});
