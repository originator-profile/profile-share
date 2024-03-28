import flush from "just-flush";
import { addYears } from "date-fns";
import { NotFoundError, BadRequestError } from "http-errors-enhanced";
import { Dp, Jwk } from "@originator-profile/model";
import {
  findFirstItemWithProof,
  isJwtDpPayload,
} from "@originator-profile/core";
import {
  DpRepository,
  WebsiteRepository,
  beginTransaction,
  getClient,
} from "@originator-profile/registry-db";
import { signDp } from "@originator-profile/sign";
import { ValidatorService } from "./validator";

type Options = {
  validator: ValidatorService;
  dpRepository: DpRepository;
  websiteRepository: WebsiteRepository;
};

type AccountId = string;

export const PublisherService = ({
  validator,
  dpRepository,
  websiteRepository,
}: Options) => ({
  /**
   * DP への署名
   * @param accountId 会員 ID
   * @param id ウェブページ ID
   * @param privateKey プライベート鍵
   * @param options 署名オプション
   * @return JWT でエンコードされた DP
   */
  async signDp(
    accountId: AccountId,
    id: string,
    privateKey: Jwk,
    options = {
      issuedAt: new Date(),
      expiredAt: addYears(new Date(), 10),
    },
  ): Promise<string | Error> {
    const prisma = getClient();
    const websitesInclude = {
      categories: {
        select: {
          category: {
            select: {
              cat: true,
              cattax: true,
              name: true,
            },
          },
        },
      },
    };
    const publisher = await prisma.accounts
      .findUnique({
        where: { id: accountId },
        include: { websites: { where: { id }, include: websitesInclude } },
      })
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
      subject: website.id,
      item: [
        {
          type: "website",
          ...flush({
            url: website.url,
            title: website.title,
            image: website.image,
            description: website.description,
            "https://schema.org/author": website.author,
            category: website.categories?.map(({ category }) => ({
              cat: category.cat,
              cattax: category.cattax,
              name: category.name,
            })),
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
    const jwt: string = await signDp(valid, privateKey);
    return jwt;
  },
  /**
   * Signed Document Profile の更新・登録
   * @param accountId 会員 ID
   * @param jwt Signed Document Profile
   * @return Signed Document Profile
   */
  async registerDp(accountId: AccountId, jwt: string): Promise<string | Error> {
    const prisma = getClient();
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
    });
    if (!account) return new BadRequestError();
    if (account instanceof Error) return account;
    const decoded = validator.decodeToken(jwt);
    if (decoded instanceof Error) return decoded;
    const payload = decoded.payload;
    if (!isJwtDpPayload(payload)) {
      return new BadRequestError("It is not Document Profile.");
    }
    if (payload.iss !== account.domainName) {
      return new BadRequestError(
        "It is not Signed Document Profile for the account.",
      );
    }
    const locator = findFirstItemWithProof(payload);
    if (!locator) {
      return new BadRequestError(
        "Document Profile doesn't contain item with proof",
      );
    }

    if (typeof locator.url !== "string") {
      return new BadRequestError(
        "Document Profile doesn't contain item with url",
      );
    }
    const websiteId = payload.sub;
    const websiteInput = {
      id: websiteId,
      location: locator.location,
      bodyFormat: locator.type,
      url: locator.url,
      proofJws: locator.proof.jws,
      accountId,
    };

    return await beginTransaction<string>(async () => {
      await websiteRepository.upsert(websiteInput);
      return await dpRepository.create({ jwt, payload });
    });
  },
});

export type PublisherService = ReturnType<typeof PublisherService>;
