import { PrismaClient } from "@prisma/client";
import { JWTPayload, decodeJwt, errors } from "jose";
import omit from "just-omit";
import flush from "just-flush";
import { addYears, fromUnixTime } from "date-fns";
import { NotFoundError, BadRequestError } from "http-errors-enhanced";
import OgWebsite from "@webdino/profile-model/src/og-website";
import { signDp, signBody } from "@webdino/profile-sign";
import { ValidatorService } from "./validator";

type Options = {
  prisma: PrismaClient;
  validator: ValidatorService;
};

type AccountId = string;
type DpId = string;

export const PublisherService = ({ prisma, validator }: Options) => ({
  /**
   * ウェブページの登録
   * @param id 会員ID
   * @param pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵
   * @param input.url URL
   * @param input.location 対象の要素の場所 (CSS セレクター)
   * @param input.bodyFormat 対象のテキストの形式
   * @param input.body 対象のテキスト
   * @param input.website ウェブページ
   * @param options 署名オプション
   * @return JWT でエンコードされた DP
   */
  async registerWebsite(
    id: AccountId,
    pkcs8: string,
    input: {
      url: string;
      location?: string;
      bodyFormat: "html" | "text" | "visibleText";
      body: string;
      website?: OgWebsite;
    },
    options = {
      issuedAt: new Date(),
      expiredAt: addYears(new Date(), 10),
    }
  ): Promise<string | Error> {
    const publisher = await prisma.accounts
      .findUnique({ where: { id } })
      .catch((e: Error) => e);
    if (publisher instanceof Error) return publisher;
    if (!publisher) return new NotFoundError();

    const proofJws = await signBody(input.body, pkcs8).catch((e: Error) => e);
    if (proofJws instanceof Error) return proofJws;

    const website = await prisma.websites.create({
      data: {
        ...omit(input.website ?? {}, "type", "url"),
        accountId: id,
        url: input.url,
        bodyFormatValue: input.bodyFormat,
        proofJws,
      },
    });

    const inputDp = {
      issuedAt: options.issuedAt.toISOString(),
      expiredAt: options.expiredAt.toISOString(),
      issuer: publisher.url,
      subject: website.url,
      item: [
        {
          type: "website",
          ...flush({
            url: website.url,
            title: website.title,
            image: website.image,
            description: website.description,
          }),
        },
        {
          type: website.bodyFormatValue,
          ...flush({
            url: website.url,
            location: website.location,
            proof: { jws: website.proofJws },
          }),
        },
      ],
    };

    const valid = validator.dpValidate(inputDp);
    if (valid instanceof Error) return valid;
    const jwt: string = await signDp(valid, pkcs8);
    return jwt;
  },
  /**
   * DP の発行
   * @param id 会員ID
   * @param jwt JWT でエンコードされた DP
   */
  async issueDp(id: AccountId, jwt: string): Promise<DpId | Error> {
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
    const data = await prisma.dps
      .create({
        data: {
          issuerId: id,
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

export type PublisherService = ReturnType<typeof PublisherService>;
