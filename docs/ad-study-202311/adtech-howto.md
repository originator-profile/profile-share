---
sidebar_position: 3
---

# 広告連携実験、DSP/SSP 側対応

本実験における DSP/SSP 側の対応については集中検討グループ内の会議と Github の [ad-study リポジトリ](https://github.com/originator-profile/ad-study/) (集中検討チーム限定アクセス) にて実施タスクを整理しつつ進行します。

### 想定 TODO リスト

集中検討グループ外の皆様への参考として、実験開始時点での 1st 実験に於ける想定 TODO リストをこちらに転記しますが、詳細及び最新の内容は [Github ad-study#1](https://github.com/originator-profile/ad-study/issues/1) を参照してください。

- SSP/DSP 両者
  - OP レジストリ登録 (OP ID 取得) 広告連携実験関係者の OP レジストリ登録
  - RTB への OP ID 埋め込み
  - 本実験用の広告枠のフォーマットや埋め込み方法をメディアと調整
  - 本実験のインプレッションは広告費請求対象から除外する準備
  - OP ID 利用取引のログの記録・検証
- メディア (SSP)
  - 今回の実験を行う広告枠を含む OP 対応サイトの準備
  - サイトプロファイルの作成と設置
- SSP
  - メディアのサイト運営者の OP ID 取得
  - 広告タグの前後に広告プロファイルへのリンク埋め込み
- 広告主/広告代理店 (DSP)
  - 広告主と広告内容の決定・準備
  - 広告主の OP レジストリ登録 (OP ID 取得) 広告連携実験関係者の OP レジストリ登録
  - ダミー広告プロファイルへの署名処理
- CIP/WebDINO
  - 実験参加メディア調整、インプレッション発生計画
  - 実験参加広告主調整、広告クリエイティブ調整 広告主と広告内容の決定・準備
  - SSP/DSP/広告主の OP ID 登録受付、OP ID と SOP の発行 広告連携実験関係者の OP レジストリ登録
  - ダミー広告プロファイル AP の準備
  - サイトプロファイル仕様の確定と読み込みの対応
  - サイトプロファイル作成手順の説明を参加メディア向けに用意して伝える
  - ブラウザ表示 UI 更新版の仕上げと実装

## 広告連携実験 1st ステップ対応

本セクションでは、広告主にSMN社を想定して、広告プロファイルを作成する手順について説明します。

### 広告プロファイルの作成の準備

広告プロファイルの作成には以下が必要です。いずれもお手元にあることを確認してから、後続の作業を実施してください。

- OP レジストリ登録時に用意した組織のプライベート鍵
- OP レジストリ登録時に受け取った [OP ID](/spec.md#%E8%AA%8D%E8%A8%BC%E6%A9%9F%E9%96%A2%E7%B5%84%E7%B9%94%E3%81%AE%E8%AD%98%E5%88%A5%E5%AD%90)
  - SMN社の場合、`www.so-netmedia.jp`

### 使用する広告表示箇所 ID の確認

本実験で対象とする広告の位置を特定するために用いられる ID は、[広告プロファイルに使用する SDP](#広告プロファイルに使用する-sdp-の作成) の件数に応じて、以下の順番で使用してください。6件目以降が必要な場合は、ご連絡ください。

1. `ad-791377e6-e7fa-4d00-9e66-ba9c72390475`
2. `ad-8ca0fe8e-3bde-4fb3-ac08-6a8e36eb83e9`
3. `ad-9c7070f5-c2a5-4afa-8522-e51dee55373a`
4. `ad-e27dc783-5971-48ed-a04d-4a4b34c9deb6`
5. `ad-d66e5319-c756-4e0a-8160-13633c67d6af`

### 広告プロファイルに使用する [SDP](/terminology.md#signed-document-profile-sdp) の発行

:::caution

advertiser:sign コマンドおよび拡張機能の実装は随時変更されます。本セクションに影響のある変更がくわえられた場合、随時内容を更新します。

:::

#### 入力ファイル（JSON 形式）の用意

広告プロファイルに使用する SDP を本実験の想定にあわせた内容で作成するため、以下を参考に用意してください。

```jsonc
{
    // 内容を更新して再発行する場合、id プロパティを指定することをおすすめします
    "id": <UUID 形式の値>,
    // 広告表示箇所 ID を使用した CSS ID セレクターを指定してください
    "location": "#ad-791377e6-e7fa-4d00-9e66-ba9c72390475",
    "bodyFormat": "visibleText", // "visibleText" を指定してください
    "body": "", // 空文字列を指定してください
    // 広告の掲載を許可するオリジンを指定してください
    "allowedOrigins": ["https://media.example.com"],
    // 不要である場合は未指定にしてください
    "title": "広告タイトル",
    // 不要である場合は未指定にしてください
    "description": "広告の説明",
    // 不要である場合は未指定にしてください
    "image": "<広告の画像 URL>"
}
```

:::danger

url プロパティは広告掲載先が複数あるため指定しません。

:::

:::caution

description プロパティを受け付けますが、本実験に対応した拡張機能の初版では表示されません。今後拡張機能で表示に対応した際に表示すべき内容がある場合、description プロパティを指定しておくことをおすすめします。

:::

:::info

image プロパティを参照した画像表示は、本実験に対応した拡張機能の初版では幅 120px \* 高さ 80px の表示領域にアスペクト比を保持して表示されます。

:::

#### SDP の発行

以下のコマンドを参考に発行してください。

`profile-registry advertiser:sign -i <SMN社のプライベート鍵へのファイルパス> --id www.so-netmedia.jp --input <入力ファイル（JSON 形式）>`

その他、CLI の使用方法については [CLI のドキュメント](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-advertisersign)を参照してください。

### 広告プロファイルに使用する [SDP](/terminology.md#signed-document-profile-sdp) の提出

[発行して得られた SDP](#広告プロファイルに使用する-sdp-の発行) をご提出ください。

以後、開発チームによって以下の作業が実施されます。

#### 広告プロファイルの作成

広告プロファイルは Originator Profile が定義した語彙を使用した以下に示す JSON-LD 形式のデータです。

```jsonld
{
  "@context": "https://originator-profile.org/context.jsonld",
  "ad": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "www.so-netmedia.jp",
      "profile": "<OP レジストリ登録時に受け取った SOP>"
    },
    "dp": {
      "sub": "<SDP の sub クレームの値>",
      "profile": "<提出された SDP>"
    }
  }
}
```

#### 広告プロファイルの設置

開発チームが管理するウェブサーバーから配信されます。
