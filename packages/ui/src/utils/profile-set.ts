import {
  ProfilePayload,
  ProfileError,
  ProfilePayloadWithMetadata,
  OpMetadata,
  DpMetadata,
} from "../types";
import { isDp, isOp } from "@originator-profile/core";
import { ProfileGenericError } from "@originator-profile/verify";
import { Profile, DocumentProfile, OriginatorProfile } from "./profile";

/**
 * タブの中の全てのプロファイルを保持するクラス。
 * プロファイルの検索やエラーの有無に関するメソッドを提供する。
 */
export class ProfileSet {
  /** 空のプロファイルセット。
   * タブ中のプロファイルを1件も読み込んでいないときにダミーのインスタンスとして使う。
   * シングルトン。 */
  public static readonly EMPTY_PROFILE_SET = new ProfileSet();

  /** プロファイル（サイトプロファイルの DP, OP を除いた DP, OP 全て）の配列 */
  private readonly profiles: Profile[] = [];
  /** DP の配列（サイトプロファイルを除く） */
  public readonly dps: DocumentProfile[] = [];
  /** OP の配列（サイトプロファイルを除く） */
  public readonly ops: OriginatorProfile[] = [];
  /** サイトプロファイルの配列。普通のケースでは DP と OP を1つずつ含む */
  private websiteProfiles: Profile[] = [];
  /** トップレベル閲覧コンテキストのオリジン */
  public readonly origin: string | undefined;
  /** サイトプロファイルがセットされたら false, それまでは true （profiles はコンストラクタ初期化の段階でセット済みと仮定） */
  public isLoading: boolean = true;

  /**
   * コンストラクタ
   * @param profiles プロファイルの配列
   * @param origin プロファイルのオリジン
   */
  constructor(profiles: Profile[] = [], origin?: string) {
    this.profiles = profiles;
    const dps = profiles.filter(
      (profile) => profile instanceof DocumentProfile,
    ) as DocumentProfile[];
    this.dps = [
      ...dps.filter((profile) => profile.isMain),
      ...dps.filter((profile) => !profile.isMain),
    ];
    this.ops = profiles.filter(
      (profile) => profile instanceof OriginatorProfile,
    ) as OriginatorProfile[];
    this.origin = origin;
  }

  /**
   * {@link ProfileSet.serialize} の結果から {@link ProfileSet} インスタンスを生成する。
   * @param profiles
   * @param websiteProfiles
   * @returns ProfileSet のインスタンス
   */
  static deserialize(
    profiles: ProfilePayloadWithMetadata[],
    websiteProfiles?: ProfilePayloadWithMetadata[],
  ) {
    const profileSet = new ProfileSet(
      profiles.map(({ profile, metadata }) => {
        if (isDp(profile)) {
          return DocumentProfile.deserialize(profile, metadata as DpMetadata);
        } else {
          return OriginatorProfile.deserialize(profile, metadata as OpMetadata);
        }
      }),
    );
    if (websiteProfiles) {
      profileSet.setWebsiteProfiles(
        websiteProfiles.map(({ profile, metadata }) => {
          if (isDp(profile)) {
            return DocumentProfile.deserialize(profile, metadata as DpMetadata);
          } else {
            return OriginatorProfile.deserialize(
              profile,
              metadata as OpMetadata,
            );
          }
        }),
      );
    }

    return profileSet;
  }
  /**
   * website Profile をセットする。
   * @param websiteProfile {@link Profile} の配列。普通のケースでは {@link OriginatorProfile} と {@link DocumentProfile} を一つずつ含む。
   */
  setWebsiteProfiles(websiteProfile: Profile[]) {
    this.websiteProfiles = websiteProfile;
    this.isLoading = false;
  }

  /**
   *
   * @returns website Profile の OP, DP を返す。
   */
  getWebsiteProfilePair():
    | {
        op: OriginatorProfile;
        dp: DocumentProfile;
      }
    | undefined {
    const op = this.websiteProfiles.find(
      (profile): profile is OriginatorProfile =>
        profile instanceof OriginatorProfile,
    );
    const dp = this.websiteProfiles.find(
      (profile): profile is DocumentProfile =>
        profile instanceof DocumentProfile,
    );
    if (!(op && dp)) return;
    return {
      op,
      dp,
    };
  }

  /**
   * 指定された種類の DP の配列を返す。
   * @param contentType 欲しい DP の種類。
   * @returns DPの配列。
   */
  listDpsByType(contentType: "advertisement" | "main" | "all" | "other") {
    const main = this.getMainDp();
    switch (contentType) {
      case "main":
        return main ? [main] : [];
      case "advertisement":
        return this.listAps();
      case "other":
        return this.listOtherDps();
      default:
        return this.dps;
    }
  }

  /**
   *
   * @returns AP の配列を返す。
   */
  listAps(): DocumentProfile[] {
    return this.dps.filter((dp) => dp.isAp());
  }

  /**
   *
   * @returns APとメインDP以外の DP の配列を返す。
   */
  listOtherDps(): DocumentProfile[] {
    return this.dps.filter((dp) => !dp.isMain && !dp.isAp());
  }

  /**
   *
   * @returns website Profile がある場合 true, ない場合 false を返す。
   */
  hasWebsiteProfiles(): boolean {
    return this.websiteProfiles.length > 0;
  }

  /**
   * 指定された OP を返す。
   * @param opId OP の ID
   * @param issuer OP の発行者。指定されなかった場合は OP ID だけで検索する。
   * @returns OP または undefined
   */
  getOp(opId: string, issuer?: string): OriginatorProfile | undefined {
    return this.ops.find(
      (op) => op.subject === opId && (!issuer || op.issuer === issuer),
    );
  }

  /**
   * 指定された DP を返す。
   * @param subject DP の ID
   * @param issuer DP の発行者の OP ID
   * @returns DP または undefined
   */
  getDp(subject: string, issuer: string): DocumentProfile | undefined {
    return this.dps.find(
      (dp) => dp.subject === subject && dp.issuer === issuer,
    );
  }

  /**
   *
   * @returns メイン DP を返す。なければ undefined
   */
  getMainDp(): DocumentProfile | undefined {
    return this.dps.find((dp) => dp.isMain);
  }

  /**
   * Website Profile のうち指定された OP を返す。なければ undefined
   * @param opId OP の ID
   * @param issuer OP の発行者。指定されなかった場合は OP ID だけで検索する。
   * @returns OP または undefined
   */
  getWebsiteOp(opId: string, issuer?: string): OriginatorProfile | undefined {
    return this.websiteProfiles.find(
      (profile) =>
        profile instanceof OriginatorProfile &&
        profile.subject === opId &&
        (!issuer || profile.issuer === issuer),
    ) as OriginatorProfile;
  }

  /**
   * Website Profile のうち指定された DP を返す。なければ undefined
   * (TODO: Website用はSPに変更したいが、他の部分はDPのままなのでここもDPとしておく)
   * @param subject DP の ID
   * @param issuer DP の発行者の OP ID
   * @returns DP または undefined
   */
  getWebsiteDp(subject: string, issuer: string): DocumentProfile | undefined {
    return this.websiteProfiles.find(
      (profile) =>
        profile instanceof DocumentProfile &&
        profile.subject === subject &&
        profile.issuer === issuer,
    ) as DocumentProfile;
  }

  /**
   * 全てのプロファイルを JSON オブジェクトに変換する。 sendMessage() などで送信する際に使用する。
   * @returns JSON オブジェクトに変換された全てのプロファイルと website Profile
   */
  serialize() {
    return {
      profiles: this.profiles.map((profile) => profile.serialize()),
      websiteProfiles: this.websiteProfiles.map((profile) =>
        profile.serialize(),
      ),
    };
  }

  /**
   * プロファイル（サイトプロファイルを含む）が0個か否か
   * @returns 空の場合 true, そうでない場合 false を返す。
   */
  isEmpty(): boolean {
    return this.profiles.length === 0 && this.websiteProfiles.length === 0;
  }

  /**
   * プロファイル（サイトプロファイルを含む）のエラーを取得する。
   * @returns エラーの配列
   */
  listProfileErrors(): ProfileError[] {
    return [...this.profiles, ...this.websiteProfiles]
      .map((profile) => profile.error)
      .filter(
        (error): error is ProfileError => error instanceof ProfileGenericError,
      );
  }

  /**
   * プロファイル（サイトプロファイルを含む）にエラーがあるか否か
   * @param includeWebsiteProfiles サイトプロファイルのエラーも含めるか否か
   * @returns エラーがある場合 true, そうでない場合 false を返す。
   */
  hasError(includeWebsiteProfiles = false): boolean {
    return (
      this.profiles.some((profile) => profile.hasError()) ||
      (includeWebsiteProfiles &&
        this.websiteProfiles.some((profile) => profile.hasError()))
    );
  }
}

/**
 * {@link Profile} クラスのインスタンスを生成するファクトリクラス。
 */
export class ProfileFactory {
  /** トップレベル閲覧コンテキストのフレーム ID のデフォルト値。
   * トップレベル閲覧コンテキストのフレームIDが分からなかったときに代わりに使う。
   */
  public static readonly topLevelFrameIdDefaultValue = NaN;

  /** 広告主の OP ID の配列 */
  private advertiserOpIds: string[] = [];
  /** 出版社の OP ID の配列 */
  private publisherOpIds: string[] = [];
  /** メイン DP の ID の配列 */
  private mainDpIds: string[] = [];
  /** トップレベル閲覧コンテキストのフレーム ID */
  private topLevelFrameId: number = ProfileFactory.topLevelFrameIdDefaultValue;

  /**
   * コンストラクタ
   * @param advertiserOpIds 広告主の OP ID の配列
   * @param publisherOpIds 出版社の OP ID の配列
   * @param mainDpIds メイン DP の ID の配列
   * @param topLevelFrameId トップレベル閲覧コンテキストのフレーム ID
   */
  constructor(
    advertiserOpIds: string[],
    publisherOpIds: string[],
    mainDpIds: string[],
    topLevelFrameId?: number,
  ) {
    this.advertiserOpIds = advertiserOpIds;
    this.publisherOpIds = publisherOpIds;
    this.mainDpIds = mainDpIds;
    this.topLevelFrameId =
      topLevelFrameId ?? ProfileFactory.topLevelFrameIdDefaultValue;
  }

  /**
   * {@link Profile} クラスのインスタンスを生成する。
   * @param profile プロファイルのペイロード
   * @param info プロファイルのコンテキスト情報
   * @returns インスタンス
   */
  create(
    profile: ProfilePayload,
    info?: { frameIds: number[]; origins: string[] },
  ) {
    if (isOp(profile)) {
      return OriginatorProfile.initializeWithFactory(
        profile,
        this.advertiserOpIds,
        this.publisherOpIds,
      );
    } else if (isDp(profile)) {
      return DocumentProfile.initializeWithFactory(
        profile,
        this.mainDpIds,
        info?.frameIds,
        info?.frameIds?.includes(this.topLevelFrameId),
      );
    } else {
      throw new Error("Invalid profile type");
    }
  }
}
