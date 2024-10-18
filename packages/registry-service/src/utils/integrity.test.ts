import { test, expect, describe } from "vitest";
import { calcIntegrity, calcIntegrityText } from "./integrity";

describe("URL が参照するリソースの integrity 計算を確認", () => {
  test("URLから取得したデータと計算済みのintegrity値が一致する(text)", async () => {
    /* echo -n "sha256-"`printf "Hello, world!\r\n" | openssl dgst -sha256 -binary | openssl base64 -A` */
    const expectedHash = "sha256-ZrAXY62AMWeDNBCDwCMX5/3aQ5HljL8C8m8qkiV8W5I=";

    const hash = await calcIntegrity(
      "https://example.com/integrity-target-text",
    );
    expect(hash).toBe(expectedHash);
  });

  test("URLから取得したデータと計算済みのintegrity値が一致する(JSON)", async () => {
    /* echo -n "sha256-"`printf "{}" | openssl dgst -sha256 -binary | openssl base64 -A` */
    const expectedHash = "sha256-RBNvo1WzZ4oRRq0W9+hknpT7T8If536DEMBg9hyq/4o=";

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

describe("文字列の integrity 計算を確認", () => {
  test("テキストから計算済みのintegrity値が一致する", async () => {
    // echo -n "Hello, World" | openssl dgst -sha256 -binary | openssl base64 -A
    const expectedHash = "sha256-A2daxT/5zRU1zMffzfosRYxSGDcfQY3BNvLRmsH76KU=";

    const hash = await calcIntegrityText("Hello, World");
    expect(hash).toBe(expectedHash);
  });

  test("空のテキストから計算済みのintegrity値が一致する", async () => {
    // echo -n "" | openssl dgst -sha256 -binary | openssl base64 -A
    const expectedHash = "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=";

    const hash = await calcIntegrityText("");
    expect(hash).toBe(expectedHash);
  });
});
