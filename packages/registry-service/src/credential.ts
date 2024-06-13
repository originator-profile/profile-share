import { credentials } from "@prisma/client";
import {
  Credentials,
  type CredentialRepository,
} from "@originator-profile/registry-db";
import { CertificateService } from "./certificate";
import { BadRequestError } from "http-errors-enhanced";

type Options = {
  credentialRepository: CredentialRepository;
  certificate: CertificateService;
};

export const CredentialService = ({
  credentialRepository,
  certificate,
}: Options) => ({
  /**
   * 資格情報の表示
   * @param accountId 会員 ID
   * @return 資格情報
   */
  async read(accountId: string, validAt?: Date): Promise<Array<Credentials>> {
    return await credentialRepository.read(accountId, validAt);
  },
  /**
   * 資格情報の作成
   * @param accountId 会員 ID
   * @param certifierId 認証機関 ID
   * @param verifierId 検証機関 ID
   * @param name 資格名
   * @param issuedAt 資格発行日
   * @param expiredAt 期限切れ日時
   * @param url 説明情報の URL
   * @param imageUrl 資格画像の URL
   * @throws {BadRequestError} certifierが認証機関ではない
   * @return 資格情報
   */
  async create(
    accountId: string,
    certifierId: string,
    verifierId: string,
    name: string,
    issuedAt: Date,
    expiredAt: Date,
    url?: string,
    imageUrl?: string,
  ): Promise<credentials> {
    const isCertifier = await certificate.isCertifier(certifierId);
    if (!isCertifier) throw new BadRequestError("Not a certifier.");

    return await credentialRepository.create(
      accountId,
      certifierId,
      verifierId,
      name,
      issuedAt,
      expiredAt,
      url,
      imageUrl,
    );
  },
  /**
   * 資格情報の更新
   * @param credentialId 資格情報 ID
   * @param data 更新内容
   * @throws {BadRequestError} certifierが認証機関ではない
   * @return 更新後の資格情報
   */
  async update(
    credentialId: number,
    accountId: string,
    data: {
      certifierId?: string;
      verifierId?: string;
      name?: string;
      issuedAt?: Date;
      expiredAt?: Date;
      url?: string;
      imageUrl?: string;
    },
  ): Promise<credentials> {
    if (data.certifierId) {
      const isCertifier = await certificate.isCertifier(data.certifierId);
      if (!isCertifier) throw new BadRequestError("Not a certifier.");
    }
    return await credentialRepository.update(credentialId, accountId, data);
  },
  /** {@link CredentialRepository.delete} */
  async delete(credentialId: number, accountId: string): Promise<credentials> {
    return await credentialRepository.delete(credentialId, accountId);
  },
});

export type CredentialService = ReturnType<typeof CredentialService>;
