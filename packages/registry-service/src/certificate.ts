import { PrismaClient } from "@prisma/client";
import { JWTPayload, decodeJwt, errors } from "jose";
import flush from "just-flush";
import { addYears, fromUnixTime } from "date-fns";
import { NotFoundError, BadRequestError } from "http-errors-enhanced";
import { signOp } from "@webdino/profile-sign";
import { AccountService } from "./account";
import { ValidatorService } from "./validator";

type Options = {
  prisma: PrismaClient;
  validator: ValidatorService;
  account: AccountService;
};

type CertifierId = string;
type AccountId = string;
type OpId = string;

export const CertificateService = ({
  prisma,
  account,
  validator,
}: Options) => ({
  /**
   * 認証機構か否かを判定する
   * @param id 認証機構 ID
   * @return 認証機構であれば true, そうでなければ false
   */
  async isCertifier(id: CertifierId): Promise<boolean | Error> {
    const data = await prisma.accounts
      .findUnique({ where: { id }, select: { roleValue: true } })
      .catch((e: Error) => e);
    if (!data) return new NotFoundError();
    if (data instanceof Error) return data;
    return data.roleValue === "certifier";
  },
  /**
   * OP への署名
   * @param id 認証機構 ID
   * @param accountId 会員 ID
   * @param pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵
   * @param options 署名オプション
   * @return JWT でエンコードされた OP
   */
  async signOp(
    id: CertifierId,
    accountId: AccountId,
    pkcs8: string,
    options = {
      issuedAt: new Date(),
      expiredAt: addYears(new Date(), 10),
      credential: {},
    }
  ): Promise<string | Error> {
    const data = await Promise.all([
      prisma.accounts.findUnique({ where: { id } }),
      prisma.accounts.findUnique({ where: { id: accountId } }),
      prisma.logos.findMany({ where: { accountId } }),
    ]).catch((e: Error) => e);
    if (data instanceof Error) return data;

    const [certifier, holder, logos] = data;
    if (!certifier) return new NotFoundError();
    if (!holder) return new NotFoundError();

    holder.logos = logos;

    const input = {
      issuedAt: options.issuedAt.toISOString(),
      expiredAt: options.expiredAt.toISOString(),
      issuer: certifier.url,
      subject: holder.url,
      item: [
        { type: "credential", ...options.credential },
        { type: "certifier", ...flush(certifier) },
        { type: "holder", ...flush(holder) },
      ],
    };

    const holderKeys = await account.getKeys(accountId);
    if (holderKeys instanceof Error) return holderKeys;
    if (holderKeys.keys.length > 0) Object.assign(input, { jwks: holderKeys });
    const valid = validator.opValidate(input);
    if (valid instanceof Error) return valid;
    const jwt: string = await signOp(valid, pkcs8);
    return jwt;
  },
  /**
   * OP の発行
   * @param id 認証機構 ID
   * @param jwt JWT でエンコードされた OP
   */
  async issue(id: CertifierId, jwt: string): Promise<OpId | Error> {
    let payload: JWTPayload;
    try {
      payload = decodeJwt(jwt);
    } catch (e) {
      if (e instanceof errors.JWTInvalid) {
        return new BadRequestError(e.message, e);
      }
      throw e;
    }
    for (const key of ["iss", "sub", "exp", "iat"] as const) {
      if (payload[key] === undefined) {
        return new BadRequestError(`missing ${key}`);
      }
    }
    const issuedAt: Date = fromUnixTime(payload.iat as number);
    const expiredAt: Date = fromUnixTime(payload.exp as number);
    const data = await prisma.ops
      .create({
        data: {
          certifierId: id,
          jwt,
          issuedAt,
          expiredAt,
        },
      })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;
    return data.id;
  },
});

export type CertificateService = ReturnType<typeof CertificateService>;
