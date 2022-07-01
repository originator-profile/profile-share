import { PrismaClient } from "@prisma/client";
import flush from "just-flush";
import { addYears, fromUnixTime } from "date-fns";
import { NotFoundError, BadRequestError } from "http-errors-enhanced";
import { Op } from "@webdino/profile-model";
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
      prisma.accounts.findUnique({
        where: { id },
        include: { logos: true },
      }),
      prisma.accounts.findUnique({
        where: { id: accountId },
        include: { logos: true },
      }),
    ]).catch((e: Error) => e);
    if (data instanceof Error) return data;

    const [certifier, holder] = data;
    if (!certifier) return new NotFoundError();
    if (!holder) return new NotFoundError();

    const input: Op = {
      type: "op",
      issuedAt: options.issuedAt.toISOString(),
      expiredAt: options.expiredAt.toISOString(),
      issuer: certifier.url,
      subject: holder.url,
      item: [
        { type: "credential", ...options.credential },
        // @ts-expect-error any properties
        { type: "certifier", ...flush(certifier) },
        // @ts-expect-error any properties
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
    const decoded = validator.decodeToken(jwt);
    if (decoded instanceof Error) return decoded;
    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
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
