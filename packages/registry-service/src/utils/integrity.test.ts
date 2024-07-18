import { test, expect, describe } from "vitest";
import { calcIntegrity } from "./integrity";

describe("integrity計算を確認", () => {
  test("URLから取得したデータと計算済みのintegrity値が一致する(text)", async () => {
    /* echo -n "sha256-"`printf "Hello, world!\r\n" | openssl dgst -sha256 -binary | openssl base64 -A` */
    const expectedHash = "sha256-ZrAXY62AMWeDNBCDwCMX5/3aQ5HljL8C8m8qkiV8W5I=";

    const hash = await calcIntegrity(
      "https://example.com/integrity-target-text",
    );
    expect(hash).toBe(expectedHash);
  });

  test("URLから取得したデータと計算済みのintegrity値が一致する(JSON)", async () => {
    /* echo -n "sha256-"`printf "{}\n" | openssl dgst -sha256 -binary | openssl base64 -A` */
    const expectedHash = "sha256-yj0WO6sFU4GCciYUBWjzvvfqrBh869doeOC2Pp5EI1Y=";

    const hash = await calcIntegrity(
      "https://example.com/integrity-target-json",
    );
    expect(hash).toBe(expectedHash);
  });

  test("URLからデータが取得できない", async () => {
    await expect(
      calcIntegrity("https://example.com/not-found"),
    ).rejects.toThrow();
  });
});
