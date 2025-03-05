import { parseAccountId } from "@originator-profile/core";
import { WebMediaProfile } from "@originator-profile/model";
import { JwtVcDecoder } from "@originator-profile/securing-mechanism";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "./lib/prisma-client";

/**
 * Web Media Profile の登録・更新
 * @param wmp Web Media Profile
 * @return Web Media Profile
 * @throws {NotFoundError} 発行者または保有者が存在しない場合
 */
export async function upsert(wmp: string): Promise<string> {
  const prisma = getClient();
  const decodedWmp = JwtVcDecoder<WebMediaProfile>()(wmp);

  if (decodedWmp instanceof Error) throw decodedWmp;

  const url = decodedWmp.doc.credentialSubject.url;
  const issuerId = parseAccountId(decodedWmp.doc.issuer);
  const holderId = parseAccountId(decodedWmp.doc.credentialSubject.id);

  // 発行者と保有者がデータベースに存在するか確認
  const [issuer, holder] = await Promise.all([
    prisma.accounts.findUnique({ where: { id: issuerId } }),
    prisma.accounts.findUnique({ where: { id: holderId } }),
  ]);

  if (!issuer) {
    throw new NotFoundError(`Issuer with ID ${issuerId} not found.`);
  }

  if (!holder) {
    throw new NotFoundError(`Holder with ID ${holderId} not found.`);
  }

  await prisma.wmps.upsert({
    where: {
      issuerId_holderId: {
        issuerId,
        holderId,
      },
    },
    update: {
      url,
      value: wmp,
    },
    create: {
      issuerId,
      holderId,
      url,
      value: wmp,
    },
  });

  return wmp;
}

/**
 * Web Media Profile の削除
 * @param issuerId 発行者 ID
 * @param holderId 会員 ID
 */
export async function destroy(
  issuerId: string,
  holderId: string,
): Promise<void> {
  const prisma = getClient();

  await prisma.wmps.delete({
    where: {
      issuerId_holderId: {
        issuerId,
        holderId,
      },
    },
  });
}

/**
 * Web Media Profile の取得
 * @param issuerId 発行者 ID
 * @param holderId 会員 ID
 * @returns Web Media Profile
 * @throws {NotFoundError} Web Media Profile が存在しない場合
 */
export async function get(issuerId: string, holderId: string): Promise<string> {
  const prisma = getClient();

  const wmp = await prisma.wmps.findUnique({
    where: {
      issuerId_holderId: {
        issuerId,
        holderId,
      },
    },
  });

  if (!wmp) {
    throw new NotFoundError("Web Media Profile not found.");
  }

  return wmp.value;
}

/**
 * Web Media Profile の一覧取得
 * @param holderId 会員 ID
 * @returns Web Media Profile の配列
 */
export async function list(holderId: string): Promise<string[]> {
  const prisma = getClient();

  const results = await prisma.wmps.findMany({
    where: {
      holderId,
    },
    select: {
      value: true,
    },
  });

  return results.map((wmp) => wmp.value);
}
