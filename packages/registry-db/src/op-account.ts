import {
  generateKey,
  importEncryptionKey,
} from "@originator-profile/cryptography";
import { Jwk } from "@originator-profile/model";
import type { Prisma } from "@prisma/client";
import { NotFoundError } from "http-errors-enhanced";
import { flattenedDecrypt, FlattenedEncrypt, FlattenedJWE } from "jose";
import { getClient } from "./lib/prisma-client";

/**
 * データベースから指定された会員情報を取得
 * @param accountId 会員 ID
 * @return 会員情報
 * @throws {NotFoundError} 指定された会員が存在しない場合
 */
export async function findOpAccount(accountId: string) {
  const prisma = getClient();
  const opAccount = await prisma.accounts.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!opAccount) {
    throw new NotFoundError("OP Account not found.");
  }

  return opAccount;
}

/**
 * 指定された会員の署名鍵を取得します。
 * データベースから暗号化された署名鍵を検索しJOSE シークレットを用いて復号します。
 * @param accountId 会員 ID
 * @param joseSecret シークレットキー (32 バイトの Base64 URL or Base64)
 * @return 署名鍵 (JWK 形式)、署名鍵が見つからない場合 null
 * @example
 * ```js
 * const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
 * const joseSecret = "G92ZbF2O-L-bu4L3hLflixyyW42GAnlzFJQlqQTl97E";
 * await findSigningKey(accountId, joseSecret);
 * ```
 */
export async function findSigningKey(
  accountId: string,
  joseSecret: string,
): Promise<Jwk | null> {
  const opAccount = await findOpAccount(accountId);

  if (!opAccount.signingKey) return null;

  const encryptionKey = await importEncryptionKey(joseSecret);
  const signingKey = opAccount.signingKey as unknown as FlattenedJWE;
  const res = await flattenedDecrypt(signingKey, encryptionKey);
  const privateKey = JSON.parse(new TextDecoder().decode(res.plaintext));

  return privateKey;
}

/**
 * 指定された会員に署名鍵を登録します。
 * JOSE シークレットを使用して署名鍵を暗号化し、データベースに保存します。
 * @param accountId 会員 ID
 * @param joseSecret シークレットキー (32 バイトの Base64 URL or Base64)
 * @return 署名鍵 (JWK 形式)
 * @example
 * ```js
 * const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
 * const joseSecret = "G92ZbF2O-L-bu4L3hLflixyyW42GAnlzFJQlqQTl97E";
 * await registerSigningKey(accountId, joseSecret);
 * ```
 */
export async function registerSigningKey(
  accountId: string,
  joseSecret: string,
): Promise<Jwk> {
  const signingKey = await findSigningKey(accountId, joseSecret);

  if (signingKey) return signingKey;

  const prisma = getClient();
  const { privateKey, publicKey } = await generateKey();
  const encryptionKey = await importEncryptionKey(joseSecret);

  const jwe = await new FlattenedEncrypt(
    new TextEncoder().encode(JSON.stringify(privateKey)),
  )
    .setProtectedHeader({
      alg: "dir",
      enc: "A256GCM",
    })
    .encrypt(encryptionKey);

  await prisma.accounts.update({
    where: {
      id: accountId,
    },
    data: {
      signingKey: jwe as unknown as Prisma.InputJsonValue,
    },
  });

  await prisma.keys.create({
    data: {
      accountId,
      jwk: publicKey as Prisma.InputJsonValue,
    },
  });

  return privateKey;
}

/**
 * 指定された会員の署名鍵を取得または登録します。
 *
 * 1. データベースから会員の署名鍵を検索
 * 2. 署名鍵が見つからない場合、新しい署名鍵を生成し、データベースに登録
 * 3. 署名鍵 (JWK 形式) を返す
 *
 * @param accountId 会員 ID
 * @param joseSecret シークレットキー (32 バイトの Base64 URL or Base64)
 * @return 署名鍵 (JWK 形式)
 * @example
 * ```js
 * const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
 * const joseSecret = "G92ZbF2O-L-bu4L3hLflixyyW42GAnlzFJQlqQTl97E";
 * await findOrRegisterSigningKey(accountId, joseSecret);
 * ```
 */
export async function findOrRegisterSigningKey(
  accountId: string,
  joseSecret: string,
): Promise<Jwk> {
  let signingKey = await findSigningKey(accountId, joseSecret);

  signingKey ??= await registerSigningKey(accountId, joseSecret);

  return signingKey;
}
