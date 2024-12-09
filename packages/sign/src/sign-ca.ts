import type {
  ArticleCA,
  Jwk,
  RawTarget,
  Target,
  UnsignedContentAttestation,
} from "@originator-profile/model";
import { signJwtVc } from "@originator-profile/securing-mechanism";
import type { HashAlgorithm } from "websri";
import { createDigestSri, createIntegrity } from "./integrity/";

/** 文脈に応じて Document を提供する関数 */
export type DocumentProvider = (raw: RawTarget) => Promise<Document>;

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

async function fetchAndSetTargetIntegrity<
  T extends { target: ReadonlyArray<RawTarget> },
>(
  alg: HashAlgorithm,
  obj: T,
  documentProvider: DocumentProvider,
): Promise<void> {
  const target: ReadonlyArray<Target> = await Promise.all(
    obj.target.map(async (raw: RawTarget) => {
      const doc = await documentProvider(raw);
      const target = await createIntegrity(alg, raw, doc);

      return target as Target;
    }),
  );

  Object.assign(obj, { target });
}

/**
 * Content Attestation への署名
 * @param uca 未署名 Content Attestation オブジェクト
 * @param privateKey プライベート鍵
 * @return JWT でエンコードされた Content Attestation
 */
export async function signCa(
  uca: UnsignedContentAttestation,
  privateKey: Jwk,
  {
    alg = "ES256",
    issuedAt = new Date(),
    expiredAt,
    integrityAlg = "sha256",
    documentProvider = async () => document,
  }: {
    alg?: string;
    issuedAt?: Date;
    expiredAt: Date;
    integrityAlg?: HashAlgorithm;
    documentProvider?: DocumentProvider;
  },
): Promise<string> {
  await fetchAndSetDigestSri(integrityAlg, uca as ArticleCA);
  await fetchAndSetTargetIntegrity(integrityAlg, uca, documentProvider);

  return await signJwtVc(uca, privateKey, { alg, issuedAt, expiredAt });
}
