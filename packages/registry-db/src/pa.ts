import { parseAccountId } from "@originator-profile/core";
import { Certificate } from "@originator-profile/model";
import { JwtVcDecoder } from "@originator-profile/securing-mechanism";
import { NotFoundError } from "http-errors-enhanced";
import { getClient } from "./lib/prisma-client";

/**
 * Profile Annotation の登録・更新
 * @param pa Profile Annotation
 * @return Profile Annotation
 * @throws {NotFoundError} 発行者または保有者が存在しない場合
 */
export async function upsert(pa: string): Promise<string> {
  const prisma = getClient();
  const decodedPa = JwtVcDecoder<Certificate>()(pa);

  if (decodedPa instanceof Error) throw decodedPa;

  const issuerId = parseAccountId(decodedPa.doc.issuer);
  const holderId = parseAccountId(decodedPa.doc.credentialSubject.id);

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

  await prisma.pas.upsert({
    where: {
      issuerId_holderId: {
        issuerId,
        holderId,
      },
    },
    update: {
      value: pa,
    },
    create: {
      issuerId,
      holderId,
      value: pa,
    },
  });

  return pa;
}

/**
 * Profile Annotation の削除
 * @param issuerId 発行者 ID
 * @param holderId 会員 ID
 */
export async function destroy(
  issuerId: string,
  holderId: string,
): Promise<void> {
  const prisma = getClient();

  await prisma.pas.delete({
    where: {
      issuerId_holderId: {
        issuerId,
        holderId,
      },
    },
  });
}

/**
 * Profile Annotation の取得
 * @param issuerId 発行者 ID
 * @param holderId 会員 ID
 * @returns Profile Annotation
 * @throws {NotFoundError} Profile Annotation が存在しない場合
 */
export async function get(issuerId: string, holderId: string): Promise<string> {
  const prisma = getClient();

  const pa = await prisma.pas.findUnique({
    where: {
      issuerId_holderId: {
        issuerId,
        holderId,
      },
    },
  });

  if (!pa) {
    throw new NotFoundError("Profile Annotation not found.");
  }

  return pa.value;
}

/**
 * Profile Annotation の一覧取得
 * @param holderId 会員 ID
 * @returns Profile Annotation の配列
 */
export async function list(holderId: string): Promise<string[]> {
  const prisma = getClient();

  const results = await prisma.pas.findMany({
    where: {
      holderId,
    },
    select: {
      value: true,
    },
  });

  return results.map((pa) => pa.value);
}
