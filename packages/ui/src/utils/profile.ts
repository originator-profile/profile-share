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
  isOpCertifier,
  isOpCredential,
  isOpHolder,
  isOpVerifier,
  isDpLocator,
  expirationDateTimeLocaleFrom,
} from "@originator-profile/core";
import {
  Advertisement,
  OgWebsite,
  Op,
  OpCertifier,
  OpVerifier,
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
    return this.payload.issuer;
  }

  /**
   * @returns subject
   */
  get subject(): string {
    return this.payload.subject;
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
    return new Date(this.payload.issuedAt).toLocaleString();
  }

  /**
   *
   * @returns 有効期限を UI の表示に適した文字列として返す
   */
  printExpiredAt(): string {
    return expirationDateTimeLocaleFrom(this.payload.expiredAt);
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
  protected readonly payload: Op;
  /** この OP の subject の role */
  public readonly roles: Role[];

  /**
   * コンストラクタ
   * @param op OP
   * @param roles OP の subject の role
   * @override
   */
  constructor(op: Op, roles: Role[] = []) {
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
    op: Op,
    advertisers: string[],
    publishers: string[],
  ) {
    return new OriginatorProfile(
      op,
      toRoles(op.subject, advertisers, publishers),
    );
  }

  /**
   * {@link serialize} の結果から {@link OriginatorProfile} インスタンスを生成する。
   * @param payload OP
   * @param metadata メタデータ
   * @returns
   */
  static deserialize(payload: Op, metadata: OpMetadata): OriginatorProfile {
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
  findHolderItem() {
    return this.payload.item.find(isOpHolder);
  }

  /**
   *
   * @returns item プロパティの中の certifier 型のアイテムの配列
   */
  listCertifierItems() {
    return this.payload.item.filter(isOpCertifier);
  }

  /**
   *
   * @returns item プロパティの中の verifier 型のアイテムの配列
   */
  listVerifierItems() {
    return this.payload.item.filter(isOpVerifier);
  }

  /**
   *
   * @returns item プロパティの中の credential 型のアイテムの配列
   */
  listCredentialItems() {
    return this.payload.item.filter(isOpCredential);
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
    return this.findHolderItem()?.logos?.find(({ isMain }) => isMain);
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
