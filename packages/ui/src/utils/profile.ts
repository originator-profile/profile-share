import * as changeKeys from "change-case/keys";
import {
  ProfilePayload,
  Dp,
  Role,
  ProfilePayloadWithMetadata,
  OpMetadata,
  DpMetadata,
  DpPayloadWithMetadata,
  OpPayloadWithMetadata,
} from "../types";
import {
  isAdvertisement,
  isOgWebsite,
  isDpLocator,
  expirationDateTimeLocaleFrom,
  isSdJwtOp,
} from "@originator-profile/core";
import {
  Advertisement,
  OgWebsite,
  OpCertifier,
  OpCredential,
  OpHolder,
  OpVerifier,
  OriginatorProfile as OriginatorProfileModel,
} from "@originator-profile/model";
import getContentType from "./get-content-type";
import { toRoles } from "./role";

/**
 * プロファイルの基底クラス。
 */
export abstract class Profile {
  protected readonly payload: ProfilePayload;

  constructor(profile: ProfilePayload) {
    this.payload = profile;
  }

  /**
   * @returns 発行者の OP ID
   */
  get issuer(): string {
    return isSdJwtOp(this.payload)
      ? new URL(this.payload.iss).hostname
      : (this.payload as Dp).issuer;
  }

  /**
   * @returns subject
   */
  get subject(): string {
    return isSdJwtOp(this.payload)
      ? this.payload.sub
      : (this.payload as Dp).subject;
  }

  /**
   * @returns プロファイルの検証結果
   */
  get error() {
    return this.payload.error;
  }

  /**
   *
   * @returns プロファイルの検証結果がエラーであれば true
   */
  hasError(): boolean {
    return this.error instanceof Error;
  }

  /**
   * 検証結果を UI の表示に適した文字列として返す
   * @returns 検証結果の文字列
   */
  printVerificationStatus(): string {
    return this.error instanceof Error ? "失敗" : "成功";
  }

  /**
   *
   * @returns 検証エラーの内容を UI の表示に適した文字列として返す
   */
  printVerificationError(): string {
    return this.error instanceof Error
      ? `${this.error.name}: ${this.error.message}`
      : "";
  }

  /**
   *
   * @returns 発行日時を UI の表示に適した文字列として返す
   */
  printIssuedAt(): string {
    return "vct" in this.payload &&
      this.payload.vct === "https://originaotr-profile.org/organization"
      ? new Date(this.payload.iat * 1000).toLocaleString()
      : new Date((this.payload as Dp).issuedAt).toLocaleString();
  }

  /**
   *
   * @returns 有効期限を UI の表示に適した文字列として返す
   */
  printExpiredAt(): string {
    return "vct" in this.payload &&
      this.payload.vct === "https://originaotr-profile.org/organization"
      ? new Date(this.payload.exp * 1000).toLocaleString()
      : expirationDateTimeLocaleFrom((this.payload as Dp).expiredAt);
  }

  /**
   * React の key prop として使用する文字列を返す
   * @returns key prop として使用する文字列
   */
  getReactKey(): string {
    return `${encodeURIComponent(this.issuer)}/${encodeURIComponent(this.subject)}`;
  }

  /**
   * プロファイルの同一性判定
   * @param profile プロファイル（または issuer, subject が含まれるオブジェクト）
   * @returns 同一のプロファイルであれば true
   */
  is(
    profile: ProfilePayload | Profile | { issuer?: string; subject?: string },
  ): boolean {
    return this.issuer === profile.issuer && this.subject === profile.subject;
  }

  /**
   * プロファイルのシリアライズ
   */
  serialize(): ProfilePayloadWithMetadata {
    throw new Error("Not implemented");
  }
}

/**
 * Document Profile クラス
 */
export class DocumentProfile extends Profile {
  /** デコード、検証済みの DP のペイロード */
  protected readonly payload: Dp;
  /** メイン DP であれば true */
  public readonly isMain: boolean;
  /** 署名対象文字列の検証エラー */
  private bodyError: string | undefined;
  /** 署名対象文字列 */
  private body: string | undefined;
  /** この DP が得られた frameID の配列 */
  public readonly frameIds: number[] = [];
  /** この DP がトップレベルのフレームから得られたか否か */
  public readonly containTopLevelFrame: boolean = false;

  /** iframe から得られた DP のページ上での位置を特定するために仕様する属性の名前 */
  static readonly DATASET_ATTRIBUTE = "data-document-profile-subjects" as const;

  /**
   * コンストラクタ
   * @param dp デコード、検証済みの DP のペイロード
   * @param isMain メイン DP であれば true
   * @param frameIds この DP が得られた frameID の配列
   * @param containTopLevelFrame この DP がトップレベルのフレームから得られたか否か
   * @param body 署名対象文字列
   * @param bodyError 署名対象文字列の検証エラー
   */
  constructor(
    dp: Dp,
    isMain: boolean = false,
    frameIds: number[] = [],
    containTopLevelFrame: boolean = false,
    body?: string,
    bodyError?: string,
  ) {
    super(dp);
    this.payload = dp;
    this.isMain = isMain;
    this.frameIds = frameIds;
    this.containTopLevelFrame = containTopLevelFrame;
    this.body = body;
    this.bodyError = bodyError;
  }

  /**
   * {@link serialize} の結果から {@link DocumentProfile} インスタンスを生成する。
   * @param payload デコード、検証済みの DP のペイロード
   * @param metadata メタデータ
   * @returns
   */
  static deserialize(payload: Dp, metadata: DpMetadata): DocumentProfile {
    return new DocumentProfile(
      payload,
      metadata.isMain,
      metadata.frameIds,
      metadata.containTopLevelFrame,
      metadata.body,
      metadata.bodyError,
    );
  }

  /**
   * {@link ProfileFactory} を使用して初期化する際に使用するファクトリメソッド
   * @param payload DP
   * @param mainDpIds メイン DP の ID の配列
   * @param frameIds この DP が得られた frameID の配列
   * @param containTopLevelFrame この DP がトップレベルのフレームから得られたか否か
   * @returns このクラスのインスタンス
   */
  static initializeWithFactory(
    payload: Dp,
    mainDpIds: string[],
    frameIds: number[] = [],
    containTopLevelFrame: boolean = false,
  ) {
    return new DocumentProfile(
      payload,
      mainDpIds.includes(payload.subject),
      frameIds,
      containTopLevelFrame,
    );
  }

  /**
   *
   * @param error 署名対象文字列の検証エラー
   */
  setBodyError(error: Error | string) {
    console.log(error);
    this.bodyError = typeof error === "string" ? error : error.message;
  }

  /**
   *
   * @param body 署名対象文字列
   */
  setBody(body?: string) {
    this.body = body;
  }

  /**
   *
   * @returns コンテンツの種別
   */
  getContentType() {
    const content = this.findAdvertisementItem() ?? this.findOgWebsiteItem();
    if (!content) {
      return "種別不明のコンテンツ";
    }
    const main = this.isMain ? [this.subject] : [];
    return getContentType(this, content, main);
  }

  /**
   * @returns AP なら true
   */
  isAp() {
    return this.findAdvertisementItem() !== undefined;
  }

  /**
   *
   * @returns website 型のアイテム
   */
  findOgWebsiteItem(): OgWebsite | undefined {
    return this.payload.item.find(isOgWebsite);
  }
  /**
   *
   * @returns advertisement 型のアイテム
   */
  findAdvertisementItem(): Advertisement | undefined {
    return this.payload.item.find(isAdvertisement);
  }

  /**
   *
   * @returns DP の item プロパティ中で署名対象文字列に関する情報を含むアイテムの配列
   */
  listLocatorItems() {
    return this.payload.item.filter(isDpLocator);
  }

  /**
   *
   * @returns 署名対象文字列の位置情報（CSS セレクタ）の配列
   */
  listLocations() {
    return this.listLocatorItems().map(
      (dpLocator) => dpLocator.location ?? ":root",
    );
  }

  /**
   * ページ（トップレベルのフレーム）において、この DP の署名対象文字列が存在する位置を特定するためのセレクタの配列を返す。
   * {@link containTopLevelFrame} が false のときには、トップレベルフレームの子 iframe のセレクタの配列になる。
   * @returns CSS セレクタの配列
   */
  listLocationsInTopLevel() {
    return this.containTopLevelFrame
      ? this.listLocations()
      : [`iframe[${DocumentProfile.DATASET_ATTRIBUTE}~="${this.subject}"]`];
  }

  /**
   *
   * @returns 署名対象文字列
   */
  getBody() {
    return this.body;
  }

  /**
   *
   * @returns 署名対象文字列の検証エラー
   */
  getBodyError() {
    return this.bodyError;
  }

  /**
   * このインスタンスを JSON オブジェクトに変換する。sendMessage() などで送信する際に使用する。
   * @returns JSON オブジェクト
   * @override
   */
  serialize(): DpPayloadWithMetadata {
    return {
      profile: this.payload,
      metadata: {
        body: this.body,
        bodyError: this.bodyError,
        isMain: this.isMain,
        frameIds: this.frameIds,
        containTopLevelFrame: this.containTopLevelFrame,
      },
    };
  }
}

/**
 * Originator Profile クラス
 */
export class OriginatorProfile extends Profile {
  /** デコード、検証済みの DP のペイロード */
  protected readonly payload: OriginatorProfileModel;
  /** この OP の subject の role */
  public readonly roles: Role[];

  /**
   * コンストラクタ
   * @param op OP
   * @param roles OP の subject の role
   * @override
   */
  constructor(op: OriginatorProfileModel, roles: Role[] = []) {
    super(op);
    this.payload = op;
    this.roles = roles;
  }

  /**
   * {@link ProfileFactory} を使用して初期化する際に使用するファクトリメソッド
   * @param op OP
   * @param advertisers 広告主の OP ID の配列
   * @param publishers 出版社の OP ID の配列
   * @returns OriginatorProfile のインスタンス
   */
  static initializeWithFactory(
    op: OriginatorProfileModel,
    advertisers: string[],
    publishers: string[],
  ) {
    return new OriginatorProfile(op, toRoles(op.sub, advertisers, publishers));
  }

  /**
   * {@link serialize} の結果から {@link OriginatorProfile} インスタンスを生成する。
   * @param payload OP
   * @param metadata メタデータ
   * @returns
   */
  static deserialize(
    payload: OriginatorProfileModel,
    metadata: OpMetadata,
  ): OriginatorProfile {
    return new OriginatorProfile(payload, metadata.roles);
  }

  /**
   *
   * @returns OP の jwks
   */
  getJwks() {
    return this.payload.jwks;
  }

  /**
   * @returns item プロパティの中の holder 型のアイテム
   */
  findHolderItem(): OpHolder {
    return {
      type: "holder",
      // @ts-expect-error Spread types may only be created from object types.ts(2698)
      ...changeKeys.camelCase(this.payload.holder),
    };
  }

  /**
   *
   * @returns item プロパティの中の certifier 型のアイテムの配列
   */
  listCertifierItems(): OpCertifier[] {
    return [
      {
        type: "certifier",
        // @ts-expect-error Spread types may only be created from object types.ts(2698)
        ...changeKeys.camelCase(this.payload.issuer),
      },
      {
        type: "certifier",
        domainName: "jicdaq.or.jp",
        url: "https://www.jicdaq.or.jp/",
        name: "一般社団法人 デジタル広告品質認証機構",
        postalCode: "104-0061",
        addressCountry: "JP",
        addressRegion: "東京都",
        addressLocality: "中央区",
        streetAddress: "銀座3-10-7 ヒューリック銀座三丁目ビル 8階",
        contactTitle: "お問い合わせ",
        contactUrl: "https://www.jicdaq.or.jp/contact.html",
        privacyPolicyTitle: "プライバシーポリシー",
        privacyPolicyUrl: "https://www.jicdaq.or.jp/privacypolicy.html",
        logos: [],
        businessCategory: [],
      },
      {
        type: "certifier",
        domainName: "pressnet.or.jp",
        url: "https://www.pressnet.or.jp/",
        name: "一般社団法人日本新聞協会",
        postalCode: "100-8543",
        addressCountry: "JP",
        addressRegion: "東京都",
        addressLocality: "千代田区",
        streetAddress: "内幸町2-2-1",
        contactTitle: "お問い合わせ",
        contactUrl: "https://www.pressnet.or.jp/contact/",
        privacyPolicyTitle: "プライバシーポリシー",
        privacyPolicyUrl: "https://www.pressnet.or.jp/privacy_policy/",
        publishingPrincipleTitle: "新聞倫理綱領",
        publishingPrincipleUrl: "https://www.pressnet.or.jp/outline/ethics/",
        logos: [],
        businessCategory: [],
      },
    ];
  }

  /**
   *
   * @returns item プロパティの中の verifier 型のアイテムの配列
   */
  listVerifierItems(): OpVerifier[] {
    return [
      {
        type: "verifier",
        domainName: "jicdaq.or.jp",
        url: "https://www.jicdaq.or.jp/",
        name: "一般社団法人 デジタル広告品質認証機構",
        postalCode: "104-0061",
        addressCountry: "JP",
        addressRegion: "東京都",
        addressLocality: "中央区",
        streetAddress: "銀座3-10-7 ヒューリック銀座三丁目ビル 8階",
        contactTitle: "お問い合わせ",
        contactUrl: "https://www.jicdaq.or.jp/contact.html",
        privacyPolicyTitle: "プライバシーポリシー",
        privacyPolicyUrl: "https://www.jicdaq.or.jp/privacypolicy.html",
        logos: [],
        businessCategory: [],
      },
      {
        type: "verifier",
        domainName: "pressnet.or.jp",
        url: "https://www.pressnet.or.jp/",
        name: "一般社団法人日本新聞協会",
        postalCode: "100-8543",
        addressCountry: "JP",
        addressRegion: "東京都",
        addressLocality: "千代田区",
        streetAddress: "内幸町2-2-1",
        contactTitle: "お問い合わせ",
        contactUrl: "https://www.pressnet.or.jp/contact/",
        privacyPolicyTitle: "プライバシーポリシー",
        privacyPolicyUrl: "https://www.pressnet.or.jp/privacy_policy/",
        publishingPrincipleTitle: "新聞倫理綱領",
        publishingPrincipleUrl: "https://www.pressnet.or.jp/outline/ethics/",
        logos: [],
        businessCategory: [],
      },
    ];
  }

  /**
   *
   * @returns item プロパティの中の credential 型のアイテムの配列
   */
  listCredentialItems(): OpCredential[] {
    return [
      {
        type: "credential",
        url: "https://oprexpt.originator-profile.org/certification-systems/2a12a385-fd1c-48e6-acd8-176c0c5e95ea",
        name: "JICDAQ ブランドセーフティ認証",
        image:
          "https://op-logos.demosites.pages.dev/www.yomiuri.co.jp/a4c0ef2e-b261-5290-95ab-81f1d2e5513f/jicdaq-brand-safety-certificated-third-party-certification.png",
        issuedAt: "2021-10-31T15:00:00.000Z",
        expiredAt: "2024-10-31T14:59:59.999Z",
        certifier: "jicdaq.or.jp",
        verifier: "jicdaq.or.jp",
      },
      {
        type: "credential",
        url: "https://oprexpt.originator-profile.org/certification-systems/c3e819b7-b7b9-434b-b250-94eea2f430c8",
        name: "JICDAQ 無効トラフィック対策認証",
        image:
          "https://op-logos.demosites.pages.dev/www.yomiuri.co.jp/a4c0ef2e-b261-5290-95ab-81f1d2e5513f/jicdaq-certified-against-ad-fraud-third-party-certification.png",
        issuedAt: "2021-10-31T15:00:00.000Z",
        expiredAt: "2024-10-31T14:59:59.999Z",
        certifier: "jicdaq.or.jp",
        verifier: "jicdaq.or.jp",
      },
      {
        type: "credential",
        url: "https://oprexpt.originator-profile.org/certification-systems/14270f8f-9f1c-4f89-9fa4-8c93767a8404",
        name: "日本新聞協会 加盟社",
        image:
          "https://op-logos.demosites.pages.dev/pressnet.or.jp/3fdf2745-fc47-54e3-b322-758777b6bafc/pressnet-member-certification.png",
        issuedAt: "2023-03-31T15:00:00.000Z",
        expiredAt: "2025-03-31T14:59:59.999Z",
        certifier: "pressnet.or.jp",
        verifier: "pressnet.or.jp",
      },
    ];
  }

  /**
   *
   * @param certifierOpId 認証機関の OP ID
   * @returns certifierOpId に対応する certifier 型のアイテム
   */
  findCertifier(certifierOpId: string) {
    const certifiers = new Map<string, OpCertifier>(
      this.listCertifierItems().map((c) => [c.domainName, c]),
    );
    return certifiers.get(certifierOpId);
  }

  /**
   *
   * @param verifierOpId 検証機関の OP ID
   * @returns verifierOpId に対応する verifier 型のアイテム
   */
  findVerifier(verifierOpId: string) {
    const verifiers = new Map<string, OpVerifier>(
      this.listVerifierItems().map((c) => [c.domainName, c]),
    );
    return verifiers.get(verifierOpId);
  }

  /**
   *
   * @returns メインロゴ
   */
  getMainLogo() {
    return this.payload.holder.logo;
  }

  /**
   * このインスタンスを JSON オブジェクトに変換する。sendMessage() などで送信する際に使用する。
   * @returns JSON オブジェクト
   * @override
   */
  serialize(): OpPayloadWithMetadata {
    return { profile: this.payload, metadata: { roles: this.roles } };
  }
}
