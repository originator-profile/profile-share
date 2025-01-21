import { parseAccountId } from "@originator-profile/core";
import { WebsiteProfile } from "@originator-profile/model";
import { JwtVcDecoder } from "@originator-profile/securing-mechanism";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "./lib/prisma-client";

/**
 * Website Profile の登録・更新
 * @param wsp Website Profile
 * @return Website Profile
 */
export async function upsert(wsp: string): Promise<string> {
  const prisma = getClient();
  const decodedWsp = JwtVcDecoder<WebsiteProfile>()(wsp);

  if (decodedWsp instanceof Error) throw decodedWsp;

  const url = decodedWsp.doc.credentialSubject.id;
  const holderId = parseAccountId(decodedWsp.doc.issuer);

  await prisma.wsps.upsert({
    where: {
      url,
      holderId,
    },
    create: {
      url,
      holderId,
      value: wsp,
    },
    update: {
      value: wsp,
    },
  });

  return wsp;
}

/**
 * Website Profile の削除
 * @param holderId 会員 ID
 * @param url URL
 */
export async function destroy(holderId: string, url: string): Promise<void> {
  const prisma = getClient();

  await prisma.wsps.delete({
    where: {
      url,
      holderId,
    },
  });
}

/**
 * Website Profile の取得
 * @param holderId 会員 ID
 * @param url URL
 * @returns Website Profile
 * @throws {NotFoundError} Website Profile が存在しない場合
 */
export async function get(holderId: string, url: string): Promise<string> {
  const prisma = getClient();

  const res = await prisma.wsps.findUnique({
    where: {
      url,
      holderId,
    },
  });

  if (!res) {
    throw new NotFoundError("Website Profile not found.");
  }

  return res.value;
}
