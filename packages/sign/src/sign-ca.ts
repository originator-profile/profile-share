import { signJwtVc } from "@originator-profile/securing-mechanism";
import type { ArticleCA, Jwk, Target } from "@originator-profile/model";
import type { HashAlgorithm } from "websri";
import { createDigestSri, createIntegrity } from "./integrity/";

async function fetchAndSetDigestSri<T extends ArticleCA>(
  alg: HashAlgorithm,
  obj: T,
): Promise<void> {
  if (
    obj.credentialSubject.image &&
    obj.credentialSubject.image.digestSRI !== "string"
  ) {
    Object.assign(
      obj.credentialSubject.image,
      await createDigestSri(alg, obj.credentialSubject.image),
    );
  }
}

async function fetchAndSetTargetIntegrity<T extends ArticleCA>(
  alg: HashAlgorithm,
  obj: T,
  document: Document,
): Promise<void> {
  const targets: ReadonlyArray<Target> = await Promise.all(
    obj.target.map(
      (target) => createIntegrity(alg, target, document) as Promise<Target>,
    ),
  );

  obj.target.forEach((target, i) => Object.assign(target, targets[i]));
}

/**
 * Content Attestation への署名
 * @param content Content Attestation オブジェクト
 * @param privateKey プライベート鍵
 * @return JWT でエンコードされた Content Attestation
 */
export async function signCa(
  content: ArticleCA,
  privateKey: Jwk,
  {
    alg = "ES256",
    issuedAt = new Date(),
    expiredAt,
    integrityAlg = "sha256",
    document: doc = document,
  }: {
    alg?: string;
    issuedAt?: Date;
    expiredAt: Date;
    integrityAlg?: HashAlgorithm;
    document?: Document;
  },
): Promise<string> {
  await fetchAndSetDigestSri(integrityAlg, content);
  await fetchAndSetTargetIntegrity(integrityAlg, content, doc);

  return await signJwtVc(content, privateKey, { alg, issuedAt, expiredAt });
}
