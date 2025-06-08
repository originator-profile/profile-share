import { generateKey, LocalKeys } from "@originator-profile/cryptography";
import { ArticleCA } from "@originator-profile/model";
import { signJwtVc, VcValidator } from "@originator-profile/securing-mechanism";
import { createIntegrity } from "@originator-profile/sign";
import { addYears, fromUnixTime, getUnixTime } from "date-fns";
import { beforeEach, describe, expect, test } from "vitest";
import { article, caUrl, opId, patch, VerifyResultFactory } from "../helper";
import { verifyIntegrity } from "../integrity";
import { CaInvalid, CaVerifyFailed } from "./errors";
import { VerifiedCa } from "./types";
import { CaVerifier } from "./verify-content-attestation";

const issuedAt = fromUnixTime(getUnixTime(new Date()));
const expiredAt = addYears(issuedAt, 10);
const signOptions = { issuedAt, expiredAt };
const verifyResult = VerifyResultFactory(issuedAt, expiredAt);
const caIssuer = opId.originator;

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
      verifyResult.create(
        articleWithTarget,
        signedArticle,
        issuer.publicKey,
        true,
      ),
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
