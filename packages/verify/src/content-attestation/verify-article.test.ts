import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import { VcValidator, signJwtVc } from "@originator-profile/securing-mechanism";
import { createIntegrity } from "@originator-profile/sign";
import { ArticleCA, Jwk } from "@originator-profile/model";
import { addYears, fromUnixTime, getUnixTime } from "date-fns";
import { beforeEach, describe, expect, test } from "vitest";
import { CaInvalid, CaVerifyFailed } from "./errors";
import { VerifiedCa } from "./types";
import { CaVerifier } from "./verify-content-attestation";
import { diffApply } from "just-diff-apply";
import { verifyIntegrity } from "../integrity";

const issuedAt = fromUnixTime(getUnixTime(new Date()));
const expiredAt = addYears(issuedAt, 10);
const signOptions = { issuedAt, expiredAt };
const toVerifyResult = (
  article: ArticleCA,
  jwt: string,
  verificationKey: Jwk,
): VerifiedCa<ArticleCA> => ({
  doc: article,
  issuedAt,
  expiredAt,
  algorithm: "ES256",
  mediaType: "application/vc+jwt",
  source: jwt,
  verificationKey,
  validated: true,
});
const patch = <T extends object>(...args: Parameters<typeof diffApply<T>>) => {
  const [source, diff] = args;
  const patched = structuredClone(source);
  diffApply(patched, diff);
  return patched;
};
const caIssuer = "dns:ca-issuer.example.org";
const caId = "urn:uuid:78550fa7-f846-4e0f-ad5c-8d34461cb95b";
const caUrl = new URL("https://www.example.org/articles/example");
const article: ArticleCA = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://originator-profile.org/ns/credentials/v1",
    "https://originator-profile.org/ns/cip/v1",
    { "@language": "ja" },
  ],
  type: ["VerifiableCredential", "ContentAttestation"],
  issuer: caIssuer,
  target: [],
  allowedUrl: ["https://www.example.org/articles*"],
  credentialSubject: {
    id: caId,
    type: "Article",
    headline: "テスト記事",
    description: "記事の説明",
  },
};

describe("ArticleCAの検証", async () => {
  beforeEach(() => {
    document.body.textContent = "ok";
  });
  const validator = VcValidator<VerifiedCa<ArticleCA>>(ArticleCA);
  const issuer = await generateKey();

  test("ArticleCAの検証に成功", async () => {
    const articleWithTarget = patch(article, [
      {
        op: "replace",
        path: ["target"],
        value: [
          await createIntegrity("sha256", {
            type: "TextTargetIntegrity",
            cssSelector: "body",
          }),
        ],
      },
    ]);
    const signedArticle = await signJwtVc(
      articleWithTarget,
      issuer.privateKey,
      signOptions,
    );

    const verifier = CaVerifier(
      signedArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).not.instanceOf(CaInvalid);
    expect(result).not.instanceOf(CaVerifyFailed);
    expect(result).toStrictEqual(
      toVerifyResult(articleWithTarget, signedArticle, issuer.publicKey),
    );
  });

  test("ArticleCAの復号に失敗", async () => {
    const verifier = CaVerifier(
      "",
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).instanceOf(CaVerifyFailed);
  });

  test("ArticleCAの検証に失敗", async () => {
    const articleWithTarget = patch(article, [
      {
        op: "replace",
        path: ["target"],
        value: [
          await createIntegrity("sha256", {
            type: "TextTargetIntegrity",
            cssSelector: "body",
          }),
        ],
      },
    ]);
    const signedArticle = await signJwtVc(
      articleWithTarget,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      "evil-issuer.example.org",
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).instanceOf(CaVerifyFailed);
  });

  test("ArticleCAのallowedUrlの範囲外", async () => {
    const articleWithTarget = patch(article, [
      {
        op: "replace",
        path: ["target"],
        value: [
          await createIntegrity("sha256", {
            type: "TextTargetIntegrity",
            cssSelector: "body",
          }),
        ],
      },
    ]);
    const signedArticle = await signJwtVc(
      articleWithTarget,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      new URL("https://www.example.org/other"),
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).instanceOf(CaVerifyFailed);
  });

  test("ArticleCAの検証でtargetが不正", async () => {
    const articleWithTarget = patch(article, [
      {
        op: "replace",
        path: ["target"],
        value: [
          await createIntegrity("sha256", {
            type: "TextTargetIntegrity",
            cssSelector: "body",
          }),
        ],
      },
    ]);
    const signedArticle = await signJwtVc(
      articleWithTarget,
      issuer.privateKey,
      signOptions,
    );

    document.body.textContent = "ng";
    const verifier = CaVerifier(
      signedArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).not.instanceOf(CaInvalid);
    expect(result).instanceOf(CaVerifyFailed);
    /* 0番目の要素が失敗 */
    expect((result as Error).message).toContain(": target[0]");
  });

  test("ArticleCAの検証でスキーマにあっていない", async () => {
    const invalidArticle = patch(article, [
      {
        op: "replace",
        path: ["type"],
        value: ["InvalidCredential"],
      },
    ]);
    const signedInvalidArticle = await signJwtVc(
      invalidArticle,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedInvalidArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).instanceOf(CaInvalid);
  });

  test("ArticleCAの検証でallowedUrlとallowedOriginが同時に指定されている", async () => {
    const invalidArticle = patch(article, [
      {
        op: "add",
        path: ["allowedOrigin"],
        value: ["https://example.org"],
      },
    ]);
    const signedInvalidArticle = await signJwtVc(
      invalidArticle,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedInvalidArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).instanceOf(CaInvalid);
  });

  test("ArticleCAの検証でtargetが空配列", async () => {
    /* 初期値で article.target は空配列 */
    const invalidArticle = article;
    const signedInvalidArticle = await signJwtVc(
      invalidArticle,
      issuer.privateKey,
      signOptions,
    );
    const verifier = CaVerifier(
      signedInvalidArticle,
      LocalKeys({ keys: [issuer.publicKey] }),
      caIssuer,
      caUrl,
      verifyIntegrity,
      validator,
    );
    const result = await verifier();
    expect(result).instanceOf(CaInvalid);
  });
});
