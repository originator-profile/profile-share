import { test, expect } from "vitest";
import getBase64URL from "./get-base-64-url";
import { randomBytes } from "node:crypto";

function decodeBase64URL(base64url: string) {
  return Buffer.from(base64url, "base64url");
}

test("get base64 URL of png", async () => {
  const prefix = "data:image/png;base64,";
  const buf = randomBytes(1024);
  const dataURL = prefix + buf.toString("base64");
  const base64URL = getBase64URL(dataURL);

  /* プレフィックスが取り除かれている */
  expect(base64URL.startsWith("data:")).toBeFalsy();
  /* Base 64 URLに含まれていてはいけない文字が含まれていない */
  expect(base64URL).not.toMatch(/[+/=]/);
  /* もとのデータが取り出せる */
  expect(decodeBase64URL(base64URL)).toEqual(buf);
});

test("get base64 URL of svg", async () => {
  const prefix = "data:image/svg+xml;base64,";
  const buf = randomBytes(1024);
  const dataURL = prefix + buf.toString("base64");
  const base64URL = getBase64URL(dataURL);

  /* プレフィックスが取り除かれている */
  expect(base64URL.startsWith("data:")).toBeFalsy();
  /* Base 64 URLに含まれていてはいけない文字が含まれていない */
  expect(base64URL).not.toMatch(/[+/=]/);
  /* もとのデータが取り出せる */
  expect(decodeBase64URL(base64URL)).toEqual(buf);
});
