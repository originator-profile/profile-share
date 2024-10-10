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
- [OP レジストリ登録時](https://github.com/originator-profile/ad-study/issues/2)に受け取った [OP ID](/spec/index.md#op-id)
  - Fluct社の場合、`corp.fluct.jp`
  - SMN社の場合、`www.so-netmedia.jp`

### [署名付き広告プロファイル](/terminology/signed-advertisement-profile.md)の作成

#### 使用する広告表示箇所 ID について

広告プロファイルの location をページ中の該当広告の表示位置特定に利用します (実験初期、ダミー広告プロファイル利用時に限る)。メディア側では OP 対応広告枠の周囲をここで (CSS セレクタとして) 指定する [`id`](https://developer.mozilla.org/ja/docs/Web/API/Element/id) と同一の ID 属性を付与した `<div>` タグで囲むことで、各広告プロファイルに対応する広告の表示位置をブラウザに知らせます。

これは設置対象サイト毎に発行します (複数箇所に広告を入れる場合は複数発行します)

- ot.yomiuri.co.jp
  - ad-9047fd04-362b-45a6-a35c-6ea240bb65fa
- pot.asahi.com
  - ad-d20605f8-813e-425e-b268-79a55fa82855
- www.chugoku-np.co.jp
  - ad-8a79c9b1-39bb-4589-9984-09d86ed4ee48

#### 入力ファイル（JSON 形式）の用意

広告プロファイルに使用する SDP を本実験の想定にあわせた内容で作成します。

フォーマットは次の通りです。

```json
{
  "//": "SDP の sub クレーム (UUID v4 文字列形式)",
  "id": "1ad45eb7-8f56-46b3-b91e-7e178041821c",

  "//": "'#' + 広告表示箇所 ID",
  "location": "#ad-791377e6-e7fa-4d00-9e66-ba9c72390475",

  "bodyFormat": "visibleText",
  "body": "",

  "//": "以降のプロパティは任意",
  "title": "広告1",
  "description": "広告1の説明",
  "image": "https://op-logos.demosites.pages.dev/placeholder-120x80.png"
}
```

location プロパティは拡張機能での表示箇所の特定に使用されます。CSS セレクターで表示箇所に挿入するタグの [`id`](https://developer.mozilla.org/ja/docs/Web/API/Element/id) を記述します。

title, description, image プロパティはそれぞれ拡張機能での広告名、説明、画像の表示に使用されます。省略した場合、その項目は非表示となります。

初回実験参加サイトについては各サイト毎の入力ファイルを用意しましたのでこちらをご利用ください:

- [ad-ot.yomiuri.co.jp.json](pathname:///ad-study-202311/ad-ot.yomiuri.co.jp.json)
- [ad-pot.asahi.com.json](pathname:///ad-study-202311/ad-pot.asahi.com.json)
- [ad-www.chugoku-np.co.jp.json](pathname:///ad-study-202311/ad-www.chugoku-np.co.jp.json)

テンプレファイルのサンプル (任意サイト掲載用):

1. [ad-1.json](pathname:///ad-study-202311/ad-1.json)
2. [ad-2.json](pathname:///ad-study-202311/ad-2.json)
3. [ad-3.json](pathname:///ad-study-202311/ad-3.json)
4. [ad-4.json](pathname:///ad-study-202311/ad-4.json)
5. [ad-5.json](pathname:///ad-study-202311/ad-5.json)

:::note

プロファイル仕様としては url プロパティも指定可能ですが、これを指定すると特定の url 以外での表示をエラーとして扱うようになります。今回の実験では同一の広告枠を複数の url で表示/使い回しするため指定しません。

:::

:::note

description プロパティを受け付けますが、本実験に対応した拡張機能の初版では表示されません。今後拡張機能で表示に対応した際に表示すべき内容がある場合、description プロパティを指定しておくことをおすすめします。

:::

:::info

表示のされ方については[画像の表示](/web-ext/image.mdx)を参照してください。

:::

#### SDP の発行

:::info

事前に最新の profile-registry CLI をインストールしてください。

Step 1
: Git と [Node.js](https://nodejs.org/) のインストール

Step 2
: 下記のコマンドをターミナルで実行

```console
git clone -c core.symlinks=true https://github.com/originator-profile/profile-share
cd profile-share
corepack enable pnpm
pnpm install
pnpm build
# profile-registry CLIのインストール
npm i -g ./apps/registry
```

:::

`profile-registry advertiser:sign` コマンドによって発行します。

```
$ profile-registry advertiser:sign \
    -i <SMN社のプライベート鍵へのファイルパス> \
    --id www.so-netmedia.jp \
    --allowed-origins <許可する掲載先> \
    --input <入力ファイル（JSON 形式）>
```

実行例:

```
$ profile-registry advertiser:sign \
    -i example.priv.json \
    --id www.so-netmedia.jp \
    --allowed-origins https://ot.yomiuri.co.jp \
    --input ad-ot.yomiuri.co.jp.json
$ profile-registry advertiser:sign \
    -i example.priv.json \
    --id www.so-netmedia.jp \
    --allowed-origins https://pot.asahi.com \
    --input ad-pot.asahi.com.json
$ profile-registry advertiser:sign \
    -i example.priv.json \
    --id www.so-netmedia.jp \
    --allowed-origins https://www.chugoku-np.co.jp \
    --input ad-www.chugoku-np.co.jp.json
```

`--allowed-origins` オプションは広告の掲載先を許可するために使用されます。例えば `https://media.example.com` のように、URL オリジン `https://<ホスト>` 形式で指定します。複数指定する場合は `,` で区切ります。`*` は任意の掲載先での利用の許可を意味します。

詳しい profile-registry コマンドの使用方法は「[署名付き広告プロファイルの作成](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-advertisersign)」をご確認ください。

### 署名付き広告プロファイルの提出

発行したSDPはいずれも開発チームにご提出ください。

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
      "profile": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNyZWRlbnRpYWwiLCJuYW1lIjoiSklDREFRIOODluODqeODs-ODieOCu-ODvOODleODhuOCo-iqjeiovCIsImltYWdlIjoiaHR0cHM6Ly9vcC1sb2dvcy5kZW1vc2l0ZXMucGFnZXMuZGV2L3d3dy5zby1uZXRtZWRpYS5qcC9lMGI5Nzc5OC1kM2M2LTU5MWUtYTlhOS00YTM3ZmI3YTRhYWIvamljZGFxLWJyYW5kLXNhZmV0eS1jZXJ0aWZpZWQtc2VsZi1kZWNsYXJhdGlvbi5wbmciLCJpc3N1ZWRBdCI6IjIwMjEtMTAtMzFUMTU6MDA6MDAuMDAwWiIsImV4cGlyZWRBdCI6IjIwMjQtMTAtMzFUMTQ6NTk6NTkuOTk5WiIsImNlcnRpZmllciI6ImppY2RhcS5vci5qcCIsInZlcmlmaWVyIjoiamljZGFxLm9yLmpwIn0seyJ0eXBlIjoiY3JlZGVudGlhbCIsIm5hbWUiOiJKSUNEQVEg54Sh5Yq544OI44Op44OV44Kj44OD44Kv5a--562W6KqN6Ki8IiwiaW1hZ2UiOiJodHRwczovL29wLWxvZ29zLmRlbW9zaXRlcy5wYWdlcy5kZXYvd3d3LnNvLW5ldG1lZGlhLmpwL2UwYjk3Nzk4LWQzYzYtNTkxZS1hOWE5LTRhMzdmYjdhNGFhYi9qaWNkYXEtY2VydGlmaWVkLWFnYWluc3QtYWQtZnJhdWQtc2VsZi1kZWNsYXJhdGlvbi5wbmciLCJpc3N1ZWRBdCI6IjIwMjEtMTAtMzFUMTU6MDA6MDAuMDAwWiIsImV4cGlyZWRBdCI6IjIwMjQtMTAtMzFUMTQ6NTk6NTkuOTk5WiIsImNlcnRpZmllciI6ImppY2RhcS5vci5qcCIsInZlcmlmaWVyIjoiamljZGFxLm9yLmpwIn0seyJ0eXBlIjoiY2VydGlmaWVyIiwiZG9tYWluTmFtZSI6Im9wcmV4cHQub3JpZ2luYXRvci1wcm9maWxlLm9yZyIsInVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy8iLCJuYW1lIjoiT3JpZ2luYXRvciBQcm9maWxlIOaKgOihk-eglOeptue1hOWQiCIsInBvc3RhbENvZGUiOiIxMDgtMDA3MyIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5riv5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IuS4ieeUsCIsImNvbnRhY3RUaXRsZSI6IuOBiuWVj-OBhOWQiOOCj-OBmyIsImNvbnRhY3RVcmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvamEtSlAvaW5xdWlyeS8iLCJwcml2YWN5UG9saWN5VGl0bGUiOiLjg5fjg6njgqTjg5Djgrfjg7zjg53jg6rjgrfjg7wiLCJwcml2YWN5UG9saWN5VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL3ByaXZhY3kvIiwibG9nb3MiOltdLCJidXNpbmVzc0NhdGVnb3J5IjpbXX0seyJ0eXBlIjoiY2VydGlmaWVyIiwiZG9tYWluTmFtZSI6ImppY2RhcS5vci5qcCIsInVybCI6Imh0dHBzOi8vd3d3LmppY2RhcS5vci5qcC8iLCJuYW1lIjoi5LiA6Iis56S-5Zuj5rOV5Lq6IOODh-OCuOOCv-ODq-W6g-WRiuWTgeizquiqjeiovOapn-aniyIsInBvc3RhbENvZGUiOiIxMDQtMDA2MSIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Lit5aSu5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IumKgOW6pzMtMTAtNyDjg5Ljg6Xjg7zjg6rjg4Pjgq_pioDluqfkuInkuIHnm67jg5Pjg6sgOOmajiIsImNvbnRhY3RUaXRsZSI6IuOBiuWVj-OBhOWQiOOCj-OBmyIsImNvbnRhY3RVcmwiOiJodHRwczovL3d3dy5qaWNkYXEub3IuanAvY29udGFjdC5odG1sIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vd3d3LmppY2RhcS5vci5qcC9wcml2YWN5cG9saWN5Lmh0bWwiLCJsb2dvcyI6W10sImJ1c2luZXNzQ2F0ZWdvcnkiOltdfSx7InR5cGUiOiJ2ZXJpZmllciIsImRvbWFpbk5hbWUiOiJqaWNkYXEub3IuanAiLCJ1cmwiOiJodHRwczovL3d3dy5qaWNkYXEub3IuanAvIiwibmFtZSI6IuS4gOiIrOekvuWbo-azleS6uiDjg4fjgrjjgr_jg6vluoPlkYrlk4Hos6roqo3oqLzmqZ_mp4siLCJwb3N0YWxDb2RlIjoiMTA0LTAwNjEiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6IuS4reWkruWMuiIsInN0cmVldEFkZHJlc3MiOiLpioDluqczLTEwLTcg44OS44Ol44O844Oq44OD44Kv6YqA5bqn5LiJ5LiB55uu44OT44OrIDjpmo4iLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly93d3cuamljZGFxLm9yLmpwL2NvbnRhY3QuaHRtbCIsInByaXZhY3lQb2xpY3lUaXRsZSI6IuODl-ODqeOCpOODkOOCt-ODvOODneODquOCt-ODvCIsInByaXZhY3lQb2xpY3lVcmwiOiJodHRwczovL3d3dy5qaWNkYXEub3IuanAvcHJpdmFjeXBvbGljeS5odG1sIiwibG9nb3MiOltdLCJidXNpbmVzc0NhdGVnb3J5IjpbXX0seyJ0eXBlIjoiaG9sZGVyIiwiZG9tYWluTmFtZSI6Ind3dy5zby1uZXRtZWRpYS5qcCIsInVybCI6Imh0dHBzOi8vd3d3LnNvLW5ldG1lZGlhLmpwLyIsIm5hbWUiOiJTTU7moKrlvI_kvJrnpL4iLCJwaG9uZU51bWJlciI6IiIsInBvc3RhbENvZGUiOiIxNDEtMDAzMiIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5ZOB5bed5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IuWkp-W0jjItMTEtMSDlpKfltI7jgqbjgqPjgrrjgr_jg6_jg7wgMTJGIiwiY29udGFjdFRpdGxlIjoi5ZWG5ZOB44O744K144O844OT44K56Zai6YCj44Gu44GK5ZWP44GE5ZCI44KP44GbIiwiY29udGFjdFVybCI6Imh0dHBzOi8vd3d3LnNvLW5ldG1lZGlhLmpwL2NvbnRhY3QvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vd3d3LnNvLW5ldG1lZGlhLmpwL3ByaXZhY3lwb2xpY3kvIiwibG9nb3MiOlt7InVybCI6Imh0dHBzOi8vb3AtbG9nb3MuZGVtb3NpdGVzLnBhZ2VzLmRldi93d3cuc28tbmV0bWVkaWEuanAvZTBiOTc3OTgtZDNjNi01OTFlLWE5YTktNGEzN2ZiN2E0YWFiL3Ntbl9sb2dvMV9jb2xvcl9zcXVhcmUuanBnIiwiaXNNYWluIjp0cnVlfV0sImJ1c2luZXNzQ2F0ZWdvcnkiOlsi5oOF5aCx6YCa5L-h5qWtIl19XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiVUhKd3gwNWI4TVlQYkJwZGZPTHd2ay05M3AzeVdrS3IyNUh6OW5UbDd6OCIsInkiOiJORWJxSUJ1OWdDLXNteURfX0prc1gzUVZhS2lyTld3TDJBdHhsTTlSTkxRIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJpcHdUVklDdTBKQUpoa1NOLWVQVGViTDR6WmRaSlVERDhPQThkVU9rb05JIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoid3d3LnNvLW5ldG1lZGlhLmpwIiwiaWF0IjoxNzAwMTA2MTkyLCJleHAiOjE3MzE3Mjg1OTJ9.aQNlnHV5BEYwWnOeD1zKlwifipICuMJjmU3CH_EQlzXB1lLoz1N6OuDc1o4Dev9TTei-LpsbHbdeG1PEPynG1g"
    },
    "dp": {
      "sub": "<SDP の sub クレーム>",
      "profile": "<SDP>"
    }
  }
}
```

#### 広告プロファイルの設置

開発チームが管理するウェブサーバー(本サイトの /public/ ディレクトリ配下) から配信され、メディアサイトの広告枠周囲に追加して頂く `<link>` タグから参照頂くことで、ブラウザが読み込みます。

## 広告連携実験 2nd ステップ対応

本セクションでは、DSPにSMN社を想定して、iframe 内コンテンツに広告プロファイルを埋め込む手順について説明します。

### 埋め込み用広告プロファイルの作成の準備

広告連携実験 1st ステップ対応での[広告プロファイルの作成の準備](#広告プロファイルの作成の準備)で示したものに加えて、iframeによる埋め込みに使用される HTML ファイルが必要です。本ドキュメントでは、[サンプル](pathname:///examples/iframe.html)を用いて説明します。

### 埋め込み用広告プロファイルの作成

広告連携実験 1st ステップ対応とは異なり、広告コンテンツをテキストとして抽出し、署名をおこないます。そのためには、[iframe に埋め込む HTML コンテンツからの対象テキストの抽出](/registry/operation/iframe-html-extraction.md)を実施します。

:::note

本実験では location プロパティに `img` を、bodyFormat プロパティに `html` を指定します。
location プロパティは署名対象のテキストの抽出するための CSS セレクター、bodyFormat は CSS セレクターにマッチする要素から署名対象テキストを生成するアルゴリズムの指定です。

:::

:::caution

インプレッション毎に広告クリエイティブの iframe HTML 全体が生成され、ユーザが表示する画像や動画などの要素の中身まで変化する場合、動的に署名とプロファイル生成も都度行う必要があります。
a, script タグなどは動的生成されても、ユーザに表示する要素 (`img` タグや `svg` タグなど) は静的で変わらない場合、任意の配信サンプル HTML から抽出し、事前に作成した署名付き広告プロファイルを利用頂けます。

:::

得られる ad.json は以下のような JSON データです。

```json
{
  "id": "29164cbb-3775-402e-9c0e-243a639c06e8",
  "url": "http://localhost:3000/iframe",
  "location": "img",
  "bodyFormat": "html",
  "body": "<img src=\"https://op-logos.demosites.pages.dev/placeholder-120x80.png\" width=\"120\" height=\"80\" decoding=\"async\" alt=\"ダミー画像\">",
  "datePublished": null,
  "author": null,
  "description": null,
  "image": "https://op-logos.demosites.pages.dev/placeholder-120x80.png",
  "title": "埋め込みHTMLコンテンツ"
}
```

本実験では url プロパティは使用しないので削除し、[署名付き広告プロファイルの作成と設置](/registry/operation/ad-profile-pair-installation/)を実施します。

```diff
--- a/ad.json
+++ b/ad.json
@@ -1,6 +1,5 @@
 {
   "id": "29164cbb-3775-402e-9c0e-243a639c06e8",
-  "url": "http://localhost:3000/iframe",
   "location": "img",
   "bodyFormat": "html",
   "body": "<img src=\"https://op-logos.demosites.pages.dev/placeholder-120x80.png\" width=\"120\" height=\"80\" decoding=\"async\" alt=\"ダミー画像\">",
```

合わせて、各広告クリエイティブの内容に応じて title, description, image プロパティを書き換えてください。
SMS 社の Logicad 広告を例に挙げると title は `Logicad by SMN` のような広告名、description は `Logicadは、独自の人工知能を搭載し、ソニーグループの優れた技術を元に開発された国産の広告配信最適化プラットフォームです。` のような広告の説明、image は `https://cd.ladsp.com/creative/03/055/126/1902603484.jpg` のようなサムネイル画像の URL で、OP 拡張機能での広告情報表示に利用されます。

署名付き広告プロファイルの作成:

```
$ profile-registry advertiser:sign \
    -i example.priv.json \
    --id example.com \
    --allowed-origins '*' \
    --input ad.json
eyJ…
```

### 署名付き広告プロファイルの設置

iframe に埋め込む HTML コンテンツの内容は以下のようになります。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>埋め込みHTMLコンテンツ</title>
  </head>
  <body>
    <h1>埋め込みHTMLコンテンツ</h1>
    <img
      src="https://op-logos.demosites.pages.dev/placeholder-120x80.png"
      width="120"
      height="80"
      decoding="async"
      alt="ダミー画像"
    />
    <script type="application/ld+json">
      {
        "@context": "https://originator-profile.org/context.jsonld",
        "ad": {
          "op": {
            "iss": "oprexpt.originator-profile.org",
            "sub": "www.so-netmedia.jp",
            "profile": "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNyZWRlbnRpYWwiLCJuYW1lIjoiSklDREFRIOODluODqeODs-ODieOCu-ODvOODleODhuOCo-iqjeiovCIsImltYWdlIjoiaHR0cHM6Ly9vcC1sb2dvcy5kZW1vc2l0ZXMucGFnZXMuZGV2L3d3dy5zby1uZXRtZWRpYS5qcC9lMGI5Nzc5OC1kM2M2LTU5MWUtYTlhOS00YTM3ZmI3YTRhYWIvamljZGFxLWJyYW5kLXNhZmV0eS1jZXJ0aWZpZWQtc2VsZi1kZWNsYXJhdGlvbi5wbmciLCJpc3N1ZWRBdCI6IjIwMjEtMTAtMzFUMTU6MDA6MDAuMDAwWiIsImV4cGlyZWRBdCI6IjIwMjQtMTAtMzFUMTQ6NTk6NTkuOTk5WiIsImNlcnRpZmllciI6ImppY2RhcS5vci5qcCIsInZlcmlmaWVyIjoiamljZGFxLm9yLmpwIn0seyJ0eXBlIjoiY3JlZGVudGlhbCIsIm5hbWUiOiJKSUNEQVEg54Sh5Yq544OI44Op44OV44Kj44OD44Kv5a--562W6KqN6Ki8IiwiaW1hZ2UiOiJodHRwczovL29wLWxvZ29zLmRlbW9zaXRlcy5wYWdlcy5kZXYvd3d3LnNvLW5ldG1lZGlhLmpwL2UwYjk3Nzk4LWQzYzYtNTkxZS1hOWE5LTRhMzdmYjdhNGFhYi9qaWNkYXEtY2VydGlmaWVkLWFnYWluc3QtYWQtZnJhdWQtc2VsZi1kZWNsYXJhdGlvbi5wbmciLCJpc3N1ZWRBdCI6IjIwMjEtMTAtMzFUMTU6MDA6MDAuMDAwWiIsImV4cGlyZWRBdCI6IjIwMjQtMTAtMzFUMTQ6NTk6NTkuOTk5WiIsImNlcnRpZmllciI6ImppY2RhcS5vci5qcCIsInZlcmlmaWVyIjoiamljZGFxLm9yLmpwIn0seyJ0eXBlIjoiY2VydGlmaWVyIiwiZG9tYWluTmFtZSI6Im9wcmV4cHQub3JpZ2luYXRvci1wcm9maWxlLm9yZyIsInVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy8iLCJuYW1lIjoiT3JpZ2luYXRvciBQcm9maWxlIOaKgOihk-eglOeptue1hOWQiCIsInBvc3RhbENvZGUiOiIxMDgtMDA3MyIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5riv5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IuS4ieeUsCIsImNvbnRhY3RUaXRsZSI6IuOBiuWVj-OBhOWQiOOCj-OBmyIsImNvbnRhY3RVcmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvamEtSlAvaW5xdWlyeS8iLCJwcml2YWN5UG9saWN5VGl0bGUiOiLjg5fjg6njgqTjg5Djgrfjg7zjg53jg6rjgrfjg7wiLCJwcml2YWN5UG9saWN5VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL3ByaXZhY3kvIiwibG9nb3MiOltdLCJidXNpbmVzc0NhdGVnb3J5IjpbXX0seyJ0eXBlIjoiY2VydGlmaWVyIiwiZG9tYWluTmFtZSI6ImppY2RhcS5vci5qcCIsInVybCI6Imh0dHBzOi8vd3d3LmppY2RhcS5vci5qcC8iLCJuYW1lIjoi5LiA6Iis56S-5Zuj5rOV5Lq6IOODh-OCuOOCv-ODq-W6g-WRiuWTgeizquiqjeiovOapn-aniyIsInBvc3RhbENvZGUiOiIxMDQtMDA2MSIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Lit5aSu5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IumKgOW6pzMtMTAtNyDjg5Ljg6Xjg7zjg6rjg4Pjgq_pioDluqfkuInkuIHnm67jg5Pjg6sgOOmajiIsImNvbnRhY3RUaXRsZSI6IuOBiuWVj-OBhOWQiOOCj-OBmyIsImNvbnRhY3RVcmwiOiJodHRwczovL3d3dy5qaWNkYXEub3IuanAvY29udGFjdC5odG1sIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vd3d3LmppY2RhcS5vci5qcC9wcml2YWN5cG9saWN5Lmh0bWwiLCJsb2dvcyI6W10sImJ1c2luZXNzQ2F0ZWdvcnkiOltdfSx7InR5cGUiOiJ2ZXJpZmllciIsImRvbWFpbk5hbWUiOiJqaWNkYXEub3IuanAiLCJ1cmwiOiJodHRwczovL3d3dy5qaWNkYXEub3IuanAvIiwibmFtZSI6IuS4gOiIrOekvuWbo-azleS6uiDjg4fjgrjjgr_jg6vluoPlkYrlk4Hos6roqo3oqLzmqZ_mp4siLCJwb3N0YWxDb2RlIjoiMTA0LTAwNjEiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6IuS4reWkruWMuiIsInN0cmVldEFkZHJlc3MiOiLpioDluqczLTEwLTcg44OS44Ol44O844Oq44OD44Kv6YqA5bqn5LiJ5LiB55uu44OT44OrIDjpmo4iLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly93d3cuamljZGFxLm9yLmpwL2NvbnRhY3QuaHRtbCIsInByaXZhY3lQb2xpY3lUaXRsZSI6IuODl-ODqeOCpOODkOOCt-ODvOODneODquOCt-ODvCIsInByaXZhY3lQb2xpY3lVcmwiOiJodHRwczovL3d3dy5qaWNkYXEub3IuanAvcHJpdmFjeXBvbGljeS5odG1sIiwibG9nb3MiOltdLCJidXNpbmVzc0NhdGVnb3J5IjpbXX0seyJ0eXBlIjoiaG9sZGVyIiwiZG9tYWluTmFtZSI6Ind3dy5zby1uZXRtZWRpYS5qcCIsInVybCI6Imh0dHBzOi8vd3d3LnNvLW5ldG1lZGlhLmpwLyIsIm5hbWUiOiJTTU7moKrlvI_kvJrnpL4iLCJwaG9uZU51bWJlciI6IiIsInBvc3RhbENvZGUiOiIxNDEtMDAzMiIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5ZOB5bed5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IuWkp-W0jjItMTEtMSDlpKfltI7jgqbjgqPjgrrjgr_jg6_jg7wgMTJGIiwiY29udGFjdFRpdGxlIjoi5ZWG5ZOB44O744K144O844OT44K56Zai6YCj44Gu44GK5ZWP44GE5ZCI44KP44GbIiwiY29udGFjdFVybCI6Imh0dHBzOi8vd3d3LnNvLW5ldG1lZGlhLmpwL2NvbnRhY3QvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vd3d3LnNvLW5ldG1lZGlhLmpwL3ByaXZhY3lwb2xpY3kvIiwibG9nb3MiOlt7InVybCI6Imh0dHBzOi8vb3AtbG9nb3MuZGVtb3NpdGVzLnBhZ2VzLmRldi93d3cuc28tbmV0bWVkaWEuanAvZTBiOTc3OTgtZDNjNi01OTFlLWE5YTktNGEzN2ZiN2E0YWFiL3Ntbl9sb2dvMV9jb2xvcl9zcXVhcmUuanBnIiwiaXNNYWluIjp0cnVlfV0sImJ1c2luZXNzQ2F0ZWdvcnkiOlsi5oOF5aCx6YCa5L-h5qWtIl19XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiVUhKd3gwNWI4TVlQYkJwZGZPTHd2ay05M3AzeVdrS3IyNUh6OW5UbDd6OCIsInkiOiJORWJxSUJ1OWdDLXNteURfX0prc1gzUVZhS2lyTld3TDJBdHhsTTlSTkxRIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJpcHdUVklDdTBKQUpoa1NOLWVQVGViTDR6WmRaSlVERDhPQThkVU9rb05JIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoid3d3LnNvLW5ldG1lZGlhLmpwIiwiaWF0IjoxNzAwMTA2MTkyLCJleHAiOjE3MzE3Mjg1OTJ9.aQNlnHV5BEYwWnOeD1zKlwifipICuMJjmU3CH_EQlzXB1lLoz1N6OuDc1o4Dev9TTei-LpsbHbdeG1PEPynG1g"
          },
          "dp": {
            "sub": "29164cbb-3775-402e-9c0e-243a639c06e8",
            "profile": "<署名付き広告プロファイル>"
          }
        }
      }
    </script>
  </body>
</html>
```

`29164cbb-3775-402e-9c0e-243a639c06e8` は署名付き広告プロファイルの sub クレームです。ad.json の id と同じ値です。
