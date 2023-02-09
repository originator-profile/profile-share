import { PrismaClient } from "@prisma/client";
import flush from "just-flush";
import { addYears, fromUnixTime } from "date-fns";
import { NotFoundError, BadRequestError } from "http-errors-enhanced";
import { Dp } from "@webdino/profile-model";
import { signDp } from "@webdino/profile-sign";
import { ValidatorService } from "./validator";

type Options = {
  prisma: PrismaClient;
  validator: ValidatorService;
};

type AccountId = string;
type DpId = string;

export const PublisherService = ({ prisma, validator }: Options) => ({
  /**
   * DP への署名
   * @param id 会員ID
   * @param url ウェブページ URL
   * @param pkcs8 PEM base64 でエンコードされた PKCS #8 秘密鍵
   * @param options 署名オプション
   * @return JWT でエンコードされた DP
   */
  async signDp(
    id: AccountId,
    url: string,
    pkcs8: string,
    options = {
      issuedAt: new Date(),
      expiredAt: addYears(new Date(), 10),
    }
  ): Promise<string | Error> {
    const publisher = await prisma.accounts
      .findUnique({ where: { id }, include: { websites: { where: { url } } } })
      .catch((e: Error) => e);
    if (publisher instanceof Error) return publisher;
    if (!publisher) return new NotFoundError();

    const [website] = publisher.websites;
    if (!website) return new NotFoundError();

    const input: Dp = {
      type: "dp",
      issuedAt: options.issuedAt.toISOString(),
      expiredAt: options.expiredAt.toISOString(),
      issuer: publisher.domainName,
      subject: website.url,
      item: [
        {
          type: "website",
          ...flush({
            url: website.url,
            title: website.title,
            image: website.image,
            description: website.description,
            "https://schema.org/author": website.author,
            "https://schema.org/category": website.category,
            "https://schema.org/editor": website.editor,
            "https://schema.org/datePublished": website.datePublished,
            "https://schema.org/dateModified": website.dateModified,
          }),
        },
        {
          // @ts-expect-error bodyFormatValue is string type
          type: website.bodyFormatValue,
          ...flush({
            url: website.url,
            location: website.location,
            proof: { jws: website.proofJws },
          }),
        },
      ],
    };

    const valid = validator.dpValidate(input);
    if (valid instanceof Error) return valid;
    const jwt: string = await signDp(valid, pkcs8);
    return jwt;
  },
  /**
   * DP の発行
   * @param id 会員ID
   * @param jwt JWT でエンコードされた DP
   * @return dps.id
   */
  async issueDp(id: AccountId, jwt: string): Promise<DpId | Error> {
    const decoded = validator.decodeToken(jwt);
    if (decoded instanceof Error) return decoded;
    const issuedAt: Date = fromUnixTime(decoded.payload.iat);
    const expiredAt: Date = fromUnixTime(decoded.payload.exp);
    const websiteId = decoded.payload.sub;
    const data = await prisma.dps
      .create({
        data: {
          issuerId: id,
          jwt,
          issuedAt,
          expiredAt,
          websiteId,
        },
      })
      .catch((e: Error) => e);
    if (!data) return new BadRequestError();
    if (data instanceof Error) return data;
    return data.id;
  },
});

export type PublisherService = ReturnType<typeof PublisherService>;
