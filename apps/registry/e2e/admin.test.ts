import { test, expect, describe, beforeAll, afterAll } from "vitest";

const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
const dummyPassword = "bdf70f3d38c1311fa06a211a2205623a";

describe("Request with unpriviledged accounts", async () => {
  const nonAdminAccountId = "3826ffad-a92b-57cc-b3d6-151e415fce7f";

  beforeAll(async () => {
    const accountInfo = {
      domainName: "admin.test.example.org",
      role: { connect: { value: "certifier" } },
      name: "非管理者アカウント",
      url: "https://admin.test.example.org/",
      postalCode: "000-0000",
      addressCountry: "JP",
      addressRegion: "東京都",
      addressLocality: "港区",
      streetAddress: "三田",
    };

    const response = await fetch(
      `http://localhost:8080/admin/account/${nonAdminAccountId}/`,
      {
        method: "POST",
        headers: {
          authorization: `Basic ${Buffer.from(
            `${accountId}:${dummyPassword}`,
          ).toString("base64")}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: nonAdminAccountId,
          input: accountInfo,
        }),
      },
    );
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `Failed to create account ${nonAdminAccountId}. Status: ${response.status}, Message: ${message}`,
      );
    }
  });

  afterAll(async () => {
    const response = await fetch(
      `http://localhost:8080/admin/account/${nonAdminAccountId}/`,
      {
        method: "DELETE",
        headers: {
          authorization: `Basic ${Buffer.from(
            `${accountId}:${dummyPassword}`,
          ).toString("base64")}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: nonAdminAccountId,
        }),
      },
    );
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `Failed to delete account ${nonAdminAccountId}. Status: ${response.status}, Message: ${message}`,
      );
    }
  });

  test("/admin/account/{id} response is an unauthorized error", async () => {
    const endpoint = `http://localhost:8080/admin/account/${nonAdminAccountId}`;
    const res = await fetch(endpoint);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
  });
});

describe("Request with administrative privileges", async () => {
  test("/admin/account/{id} response is a valid JSON", async () => {
    const endpoint = `http://localhost:8080/admin/account/${accountId}`;
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${accountId}:${dummyPassword}`,
        ).toString("base64")}`,
      },
    });
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: accountId });
  });
});
