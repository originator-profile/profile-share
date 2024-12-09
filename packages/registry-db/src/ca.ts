import { parseAccountId, parseCaId } from "@originator-profile/core";
import { ContentAttestation } from "@originator-profile/model";
import { JwtVcDecoder } from "@originator-profile/securing-mechanism";
import { getClient } from "./lib/prisma-client";

/**
 * Content Attestation の登録・更新
 * @param ca Content Attestation
 * @return Content Attestation
 */
export async function upsert(ca: string): Promise<string> {
  const prisma = getClient();
  const decodedCa = JwtVcDecoder<ContentAttestation>()(ca);

  if (decodedCa instanceof Error) throw decodedCa;

  const caId = parseCaId(decodedCa.doc.credentialSubject.id);
  const holderId = parseAccountId(decodedCa.doc.issuer);

  await prisma.cas.upsert({
    where: {
      caId,
      holderId,
    },
    create: {
      caId,
      holderId,
      value: ca,
    },
    update: {
      value: ca,
    },
  });

  return ca;
}
