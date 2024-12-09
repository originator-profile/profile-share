import {
  findFirstItemWithProof,
  isJwtDpPayload,
  parseAccountId,
  parseExpirationDate,
} from "@originator-profile/core";
import {
  ContentAttestationSet,
  Dp,
  Jwk,
  RawTarget,
  UnsignedContentAttestation,
} from "@originator-profile/model";
import {
  CaRepository,
  DpRepository,
  OpAccountRepository,
  WebsiteRepository,
  beginTransaction,
  getClient,
} from "@originator-profile/registry-db";
import { signCa, signDp } from "@originator-profile/sign";
import { addYears } from "date-fns";
import { Window } from "happy-dom";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "http-errors-enhanced";
import flush from "just-flush";
import Config from "./config";
import { ValidatorService } from "./validator";

type Options = {
  config: Config;
  validator: ValidatorService;
  dpRepository: DpRepository;
  websiteRepository: WebsiteRepository;
};

type AccountId = string;

async function documentProvider({
  type,
  content = "",
}: RawTarget): Promise<Document> {
  let url: string | undefined;
  let html: string = "";

  if (URL.canParse(content)) {
    url = content;
  } else {
    html = content;
  }

  if (type !== "ExternalResourceTargetIntegrity" && url) {
    html = await fetch(url).then((res) => res.text());
  }

  const window = new Window({
    url,
  });

  window.document.write(html);

  return window.document as unknown as Document;
}

export const PublisherService = ({
  config,
  validator,
  dpRepository,
  websiteRepository,
}: Options) => ({
  /**
   * Content Attestation への署名
   * @param uca 未署名 Content Attestation オブジェクト
   * @param privateKey プライベート鍵
   * @return Content Attestation
   */
  async sign(
    uca: UnsignedContentAttestation,
    privateKey: Jwk,
    {
      issuedAt: issuedAtDateOrString = new Date(),
      expiredAt: expiredAtDateOrString = addYears(new Date(), 1),
    }: {
      issuedAt?: Date | string;
      expiredAt?: Date | string;
    },
  ): Promise<string> {
    const issuedAt: Date = new Date(issuedAtDateOrString);

    const expiredAt: Date =
      typeof expiredAtDateOrString === "string"
        ? parseExpirationDate(expiredAtDateOrString)
        : expiredAtDateOrString;

    uca.credentialSubject.id ??= `urn:uuid:${crypto.randomUUID()}`;

    return await signCa(uca, privateKey, {
      issuedAt,
      expiredAt,
      documentProvider,
    });
  },

  /**
   * Content Attestation の登録・更新
   * @param accountId 会員 ID
   * @param uca 未署名 Content Attestation オブジェクト
   * @throws {ForbiddenError} 会員 ID と Content Attestation の発行者が一致しない
   * @return Content Attestation Set
   */
  async createOrUpdate(
    accountId: AccountId,
    {
      issuedAt,
      expiredAt,
      ...uca
    }: {
      issuedAt?: string;
      expiredAt?: string;
    } & UnsignedContentAttestation,
  ): Promise<ContentAttestationSet> {
    if (accountId !== parseAccountId(uca.issuer)) {
      throw new ForbiddenError(
        "OP Account ID does not match the issuer of the Content Attestation.",
      );
    }

    const signingKey = await OpAccountRepository.findOrRegisterSigningKey(
      accountId,
      config.JOSE_SECRET as string,
    );

    const ca = await this.sign(uca, signingKey, {
      issuedAt,
      expiredAt,
    });

    await CaRepository.upsert(ca);

    return [ca];
  },

  /**
   * DP への署名
   * @deprecated
   * @param accountId 会員 ID
   * @param id ウェブページ ID
   * @param privateKey プライベート鍵
   * @param options 署名オプション
   * @throws {NotFoundError} 組織情報が見つからない/ウェブページが見つからない
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
  ): Promise<string> {
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
    const publisher = await prisma.accounts.findUnique({
      where: { id: accountId },
      include: { websites: { where: { id }, include: websitesInclude } },
    });
    if (!publisher) throw new NotFoundError("OP Account not found.");

    const [website] = publisher.websites;
    if (!website) throw new NotFoundError("Webpage not found.");

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
    const jwt: string = await signDp(valid, privateKey);
    return jwt;
  },
  /**
   * Signed Document Profile の更新・登録
   * @deprecated
   * @param accountId 会員 ID
   * @param jwt Signed Document Profile
   * @throws {NotFoundError} 組織情報が見つからない
   * @throws {BadRequestError} バリデーション失敗/Document Profileではない/ドメイン名が一致しない/proofが含まれない/urlが含まれない
   * @return Signed Document Profile
   */
  async registerDp(accountId: AccountId, jwt: string): Promise<string> {
    const prisma = getClient();
    const account = await prisma.accounts.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundError("OP Account not found.");
    }
    const decoded = validator.decodeToken(jwt);
    const payload = decoded.payload;
    if (!isJwtDpPayload(payload)) {
      throw new BadRequestError("It is not Document Profile.");
    }
    if (payload.iss !== account.domainName) {
      throw new BadRequestError(
        "It is not Signed Document Profile for the account.",
      );
    }
    const locator = findFirstItemWithProof(payload);
    if (!locator) {
      throw new BadRequestError(
        "Document Profile doesn't contain item with proof",
      );
    }

    if (typeof locator.url !== "string") {
      throw new BadRequestError(
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
