import { test, expect } from "vitest";
import { generateKey } from "./generate-key";
import { createThumbprint } from "./thumbprint";

test("generateKey() は鍵指紋と一致する `kid` を含む JWK 形式の公開鍵を返す", async () => {
  const { jwk, pkcs8 } = await generateKey();
  expect(jwk.kid).toBe(await createThumbprint(pkcs8));
});
