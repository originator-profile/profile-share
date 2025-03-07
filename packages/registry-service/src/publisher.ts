import { parseAccountId, parseExpirationDate } from "@originator-profile/core";
import type {
  ContentAttestationSet,
  Jwk,
  RawTarget,
  SiteProfile,
  UnsignedContentAttestation,
  WebsiteProfile,
} from "@originator-profile/model";
import {
  CaRepository,
  OpAccountRepository,
  WspRepository,
} from "@originator-profile/registry-db";
import {
  fetchAndSetDigestSri,
  fetchAndSetTargetIntegrity,
  signCa,
} from "@originator-profile/sign";
import { addYears, getUnixTime } from "date-fns";
import { Window } from "happy-dom";
import { ForbiddenError } from "http-errors-enhanced";
import { signJwtVc } from "../../securing-mechanism/src/jwt";
import Config from "./config";

type Options = {
  config: Config;
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

export const PublisherService = ({ config }: Options) => ({
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
   * 未署名 Content Attestation の取得
   * @param uca 未署名 Content Attestation オブジェクト
   * @return 未署名 Content Attestation オブジェクト
   */
  async unsignedCa(
    uca: UnsignedContentAttestation,
    {
      issuedAt: issuedAtDateOrString = new Date(),
      expiredAt: expiredAtDateOrString = addYears(new Date(), 1),
    }: {
      issuedAt?: Date | string;
      expiredAt?: Date | string;
    },
  ): Promise<UnsignedContentAttestation> {
    const issuedAt: Date = new Date(issuedAtDateOrString);

    const expiredAt: Date =
      typeof expiredAtDateOrString === "string"
        ? parseExpirationDate(expiredAtDateOrString)
        : expiredAtDateOrString;

    uca.credentialSubject.id ??= `urn:uuid:${crypto.randomUUID()}`;

    await fetchAndSetDigestSri("sha256", uca.credentialSubject.image);
    await fetchAndSetTargetIntegrity("sha256", uca, documentProvider);

    const payload = {
      iss: uca.issuer,
      sub: uca.credentialSubject.id,
      iat: getUnixTime(issuedAt),
      exp: getUnixTime(expiredAt),
      ...uca,
    };

    return payload;
  },

  /**
   * Website Profile の登録・更新
   * @param accountId 会員 ID
   * @param uwsp 未署名 Website Profile オブジェクト
   * @throws {ForbiddenError} 会員 ID と Website Profile の発行者が一致しない
   * @return Website Profile
   */
  async createOrUpdateWsp(
    accountId: string,
    {
      issuedAt: issuedAtDateOrString = new Date(),
      expiredAt: expiredAtDateOrString = addYears(new Date(), 1),
      ...uwsp
    }: {
      issuedAt?: Date | string;
      expiredAt?: Date | string;
    } & WebsiteProfile,
  ): Promise<string> {
    if (accountId !== parseAccountId(uwsp.issuer)) {
      throw new ForbiddenError(
        "OP Account ID does not match the issuer of the Website Profile.",
      );
    }

    const signingKey = await OpAccountRepository.findOrRegisterSigningKey(
      accountId,
      config.JOSE_SECRET as string,
    );

    const issuedAt: Date = new Date(issuedAtDateOrString);

    const expiredAt: Date =
      typeof expiredAtDateOrString === "string"
        ? parseExpirationDate(expiredAtDateOrString)
        : expiredAtDateOrString;

    await fetchAndSetDigestSri("sha256", uwsp.credentialSubject.image);

    const wsp = await signJwtVc(uwsp, signingKey, {
      issuedAt,
      expiredAt,
    });

    await WspRepository.upsert(wsp);

    return wsp;
  },

  /**
   * 未署名 Website Profile の取得
   * @param uwsp 未署名 Website Profile オブジェクト
   * @return 未署名 Website Profile オブジェクト
   */
  async unsignedWsp(
    uwsp: WebsiteProfile,
    {
      issuedAt: issuedAtDateOrString = new Date(),
      expiredAt: expiredAtDateOrString = addYears(new Date(), 1),
    }: {
      issuedAt?: Date | string;
      expiredAt?: Date | string;
    },
  ): Promise<WebsiteProfile> {
    const issuedAt: Date = new Date(issuedAtDateOrString);

    const expiredAt: Date =
      typeof expiredAtDateOrString === "string"
        ? parseExpirationDate(expiredAtDateOrString)
        : expiredAtDateOrString;

    await fetchAndSetDigestSri("sha256", uwsp.credentialSubject.image);

    return {
      iss: uwsp.issuer,
      sub: uwsp.credentialSubject.id,
      iat: getUnixTime(issuedAt),
      exp: getUnixTime(expiredAt),
      ...uwsp,
    };
  },

  /**
   * Site Profile の登録・更新
   * @param accountId 会員 ID
   * @param uwsp 未署名 Website Profile オブジェクト
   * @return Site Profile
   */
  async createOrUpdateSp(
    accountId: string,
    {
      originators,
      ...uwsp
    }: {
      originators: SiteProfile["originators"];
      issuedAt?: Date | string;
      expiredAt?: Date | string;
    } & WebsiteProfile,
  ): Promise<SiteProfile> {
    const wsp = await this.createOrUpdateWsp(accountId, uwsp);

    return {
      originators,
      credential: wsp,
    };
  },
});

export type PublisherService = ReturnType<typeof PublisherService>;
