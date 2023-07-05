---
sidebar_position: 2
---

# 実装の確認と CMS の対応

## はじめに

全体の構成はこちらの図にまとめていますが、セットアップ作業として組織情報を用意、OP レジストリに登録、公開鍵・プライベート鍵のペアを生成して公開鍵を登録をした上で、各 CMS でコンテンツ・記事に対して署名をした DP すなわち Signed Document Profile (SDP) を発行・登録・リンクすることで利用者のブラウザから Profile Set (SOP と SDP 一式) を記事と共に表示可能になります。

![概要説明図](assets/abstract.png)

まずは実装済みの環境で拡張機能を使って見ながら仕組みを把握してから、各社の CMS での対応の検討・実装を進めていってください。仕様や実装の詳細は本サイトの他のページやリポジトリにありますが、本実験に際して必要な情報はこのページにまとめています。

## OP 拡張機能を試す

自社サイトの OP 対応を検討する前に、まずは OP の拡張機能を手元の Chrome ブラウザ (または Edge, Brave や Arc などの Chrome 互換で拡張機能が利用可能なブラウザ) にインストールし、OP 対応済みのデモサイトで使ってみてください。

### OP 拡張機能の導入と動作確認

Step 1
: ダウンロード

[GitHub Releases](https://github.com/webdino/profile/releases/latest) から OP 拡張機能の最新版をダウンロードします。

Step 2
: インストール

1. ZIP ファイルを展開します。
2. chrome://extensions にアクセスします。
3. 「デベロッパーモード」を有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」を選択します。
5. ZIP ファイルを展開されたディレクトリ (manifest.json を含む) を選択します。

Step 3
: Web ページにアクセス

例えば、[本組合の公式サイト](https://originator-profile.org/ja-JP/)など、OP 対応済みの Web ページにアクセスします。

Step 4
: コンテンツ情報の閲覧と検証

拡張機能をクリックすることで、現在閲覧中の Web ページに関するコンテンツ情報の閲覧と検証することができます。

右上の拡張機能ボタンから Profile Web Extention を選択します。

![利用法の確認1](assets/how_to_use_ext01.png)

ウィンドウが開き、認証の有無や各種情報を確認できます。

![利用法の確認2](assets/how_to_use_ext02.png)

:::note
制限事項: OP 拡張機能はインストール前に読み込み済みのタブで拡張機能ウィンドウを開いても動作しません。インストール後に開いたタブか、再読込したタブでお試しください。
:::

### サンプルサイト

本組合の公式サイトの他に、確認用にいくつかのサンプルサイトを用意しています。本組合の公式サイト同様の手順でご確認いただけます。

- 読売新聞オンラインのスナップショット: https://yomiuri.demosites.pages.dev/
  - 認証情報:
    - ユーザー名: `yomiuri`
    - パスワード: `HzGIyYkTKEM9`
  - [試験ページ一覧と説明](https://yomiuri.demosites.pages.dev/readme)
- サントリーホームページのスナップショット: https://suntory.demosites.pages.dev/
  - 認証情報:
    - ユーザー名: `suntory`
    - パスワード: `edBHyP4slkTp`
  - [試験ページ一覧と説明](https://suntory.demosites.pages.dev/readme)

:::note
こちらは最初期プロトタイプ実装に際して参照用サンプルとして部分的に SDP を埋め込む試験用に作成したものであり、本実験または最終的にどのような記事を対象にどのように埋め込むかの見本ではありません。
:::

## 実験の準備

ここでは実験に必要な準備手順と全体を理解・把握頂くための確認操作について説明します。全体としては次の流れになります。

- 各社: 対象サイトコンテンツの選定、GitHub アカウントの連絡、OP 組織情報登録内容の提出
- 事務局: OP レジストリへの登録、OP ID の発行・連絡、DP レジストリアクセス情報の連絡
- 各社: 実際に DP を生成・登録してブラウザで表示を確認
  - CLI などを用いて手作業で SDP を生成して DP レジストリに登録、HTML にリンクを埋め込み
  - CMS の OP 対応をして記事作成・更新時に自動的に SDP を生成・登録させる
  - ブラウザで正しく検証が通り表示されることを確認

### 実験対象サイトとコンテンツの選定

本実験では、**自社のコンテンツを掲載されている任意のサイトの任意のコンテンツを対象として実験をして頂けます**。コンテンツの種別もニュースは勿論それに限らずコラムや社説、ブログ記事などであっても構いません。

コンテンツによっては単一記事が複数ページに分割表示される場合、ログインや課金などの状態に応じて出力が変わる場合など様々な場合がありますが、いずれを対象として頂いても構いません。

実装コストが高い部分は今回は扱わず、どのように実装するべきか、実装や記事執筆側のフローなどに悪影響がないかなどを検討して課題があれば報告頂くだけという取り組みでも問題ありません。

本実証実験での対象サイトおよびコンテンツは自社提供のもととしており、他社提供コンテンツは次回以降を想定しております。今回は各社で個別に OP の対応を検討・実装頂く最初のステップであり、複数社のシステムを横断し OP 対応コンテンツの流通を試験するのは今後段階的に進行していく予定です。

### GitHub アカウント

本実験で利用頂く参照実装コードやレジストリ・拡張機能などのコードを収めた [オリジネータープロファイル リポジトリ](https://github.com/webdino/profile/tree/main) は private リポジトリであり、Read 権限を付与する CIP 加盟企業の github アカウントが必要です。

**github アカウント作成後、担当者名とアカウント名を事務局までメールでご連絡ください。**ご連絡いただいた github アカウントに関連リポジトリのアクセス権を付与する invite をお送りさせて頂きます。

:::note
本ページを含む、各種ドキュメントの参照には github アカウントは不要です。実装コードへのアクセスは不要でドキュメントだけで十分なご担当者様についてはアカウントの作成・ご連絡は不要です。
:::

### OP 組織情報登録内容の提出

下記フォームから **OP レジストリに登録する組織情報を入力**してください

https://forms.gle/udirHux1TFs5ctyu6

こちらに入力頂いた情報を元に OP レジストリへの登録を行います。登録された情報は例えば次のような形でブラウザの拡張機能の UI に表示・確認できるようになります。

![](assets/yomiuri-op-jicdaq.png)
![](assets/yomiuri-dp-jicdaq-01.png)

:::note
現在の拡張機能の UI はあくまで検討段階のものです。今後も変更が予定されていますが、お気づきの点がありましたら遠慮なくフィードバックをお願い致します。
:::

### 公開鍵、プライベート鍵の生成と公開鍵の登録

フォーム入力後に事務局側で OP レジストリに組織の登録が完了したら、OP ID などの連絡が届きます。手元で**デジタル署名に用いる鍵ペアを生成し、事務局 OP レジストリに公開鍵の登録を依頼**してください。

ここで生成したプライベート鍵でコンテンツに対して Signed Document Profile (SDP) を生成しコンテンツと共に配信すると、ブラウザは公開鍵を用いて署名を検証した上で SOP/SDP に記載された情報を表示します。

公開鍵は下記のいずれかの方法で用意します。

<!-- 下記は docs/registry/document-profile-registry-creation.md を改変して利用 -->

### WordPress プラグインを使用する方法

WordPress の参照実装のプラグインをインストールし、有効化したあと、WordPress 管理者画面 > Settings > Profile 設定画面にアクセスすると公開鍵を確認できます。

JWK の例:

```json
{
  "crv": "P-256",
  "kty": "EC",
  "x": "6OBp79JZKOaSFbjGaUrlcv17FdyGz-bUUYdW2xPgRBE",
  "y": "TeTGAWf_OrdUmC9UUYn7x6aZx39g-Qk98XmMpwXW_ew",
  "kid": "j9L_Qji2BC4vj1AaDCdzpurXSpM7cKBbtWO-W5a0SK4",
  "alg": "ES256",
  "use": "sig"
}
```

公開鍵は、事務局 OP レジストリに登録する必要があります。
事務局に公開鍵の登録を依頼してください。

### profile-registry CLI を使用する方法

profile-registry CLI を使用して、鍵ペアを生成することが可能です。

:::note
あらかじめ profile-registry CLI をインストールする必要があります。
profile-registry CLI のインストール方法は[開発ガイド](../development.md)を参照してください。
:::

:::warning
プライベート鍵は適切に管理してください。プライベート鍵が漏洩するとあなたの組織を詐称してコンテンツに署名をされる恐れがあります。
:::

例:

```
$ profile-registry key-gen -o key.pem
$ cat key.pem.pub.json | jq
{
  "kty": "EC",
  "kid": "x6pZlFXlKvbV69GZf8xW-lqb6tg0_ERuNHHgTTvmQ70",
  "x": "cnbjjr-SEPqyh2bMzqSPE2DdrEMFzDygPmCwkSkqnmk",
  "y": "LV4Xc5HilgrTNxSGMXUBgSmVvQgUB-bxP79LaoXOfFA",
  "crv": "P-256"
}
```

実行結果として得られる、鍵ファイルは下記となります。

- key.pem (プライベート鍵)
- key.pem.pub.json (公開鍵)

公開鍵は事務局 OP レジストリに登録する必要があります。
事務局に公開鍵の登録を依頼してください。

### CMS の OP 対応と SDP の発行・登録

これについては後述します。この後の手順を進めるには実際にコンテンツに対して SDP を生成する必要がありますが、CMS の対応を行う前に、まずは後述の CLI を用いて SDP を生成し、それを使って DP レジストリへの登録処理などを試しておくと理解が深まるかも知れません。

### DP レジストリ API の確認

今回の実証実験でご利用いただく API エンドポイントは次の 2 つです。

- `/admin/publisher/{アカウントID}` エンドポイント
  - 署名付き DP を DP レジストリに登録するためのエンドポイントです。POST メソッドをサポートします。
- `/website/profiles` エンドポイント
  - Profile Set を取得するためのエンドポイントです。GET メソッドをサポートします。今回の実証実験では、 <link\> 要素の `href` 属性にこのエンドポイントへの URL を記載することになります。

各エンドポイントの使い方を説明します。

#### `/admin/publisher/{アカウントID}` エンドポイント

コンテンツに対する署名付き DP (SDP) を DP レジストリに登録するためのエンドポイントです。必要なパラメータをリクエストのボディー部に付与して POST メソッドを送ることで、登録ができます。

このエンドポイントは、呼び出しに Basic 認証による認証が必要です。必要な認証情報は CIP から受け取ってください。受け取った認証情報は、Basic 認証及び、このエンドポイントの URL の中の `{アカウントID}` で使用します。

今回の実証実験では、いくつかのパラメータには以下に示す固定値を入れてください。パラメータは JSON 形式で与えてください。

リクエスト例:

```shell
curl -X POST https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e","url":"https://media.example.com/2023/06/hello/","bodyFormat":{"connect":{"value":"text"}},"proofJws":""},"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwOi8vbWVkaWEuZXhhbXBsZS5jb20vMjAyMy8wNi9oZWxsby8ifV19fQ.BIYtuie4ZQKANLXlpWmhu_UzxLX9bKkDAGcTULWP6vjPDFNunAjD6PANVso7US54opAa7NbrSR-y_8TSOzLsbw"}'
```

上記の例は、 curl コマンドで DP レジストリ (`dprexpt.originator-profile.org`) の DP 登録エンドポイントへ POST リクエストを送っています。

CIP から受け取った認証情報が `8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8` だとしています。

エンドポイントの URL は、アカウント ID を入れて `https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/` とし、 `-u` オプションで上記アカウント ID とパスワードを `:` で連結した値を Basic 認証の認証情報として利用するようにしています。

`-d` オプションでパラメータを指定しています。これらのパラメータはリクエストのボディ部に JSON 形式で渡されます。各パラメータについては下記を参照ください。

```jsonc
{
  "input": {
    "id": "403cc6d4-53d6-4286-9f42-930e0bf7bd3f", // 記事の ID を渡してください。必ず UUID 文字列表現 (RFC 4122) でなければなりません。
    "url": "https://media.example.com/2023/06/hello/", // 記事の URL です。
    // bodyFormat 内は、このままの値を入力してください。
    "bodyFormat": {
      "connect": {
        "value": "text"
      }
    },
    "proofJws": "" // 空文字列を入力してください。
  },
  "jwt": "eyJhbGciOiJFUzI1NiIsImtp（略）" // 署名付きDPを渡してください。
}
```

`bodyFormat`, `proofJws` は上記のように固定値を入れてください。これらの値は、今回の実験では使用しないため、実際に渡す DP の情報と一致していなくて構いません。 `jwt` 及び、 `id`, `url` には登録する DP に応じて適切な値を入れてください。

上記のリクエストに対する成功レスポンスは次のようになります。

レスポンス例（見やすく整形しています）:

```json
{
  "id": "403cc6d4-53d6-4286-9f42-930e0bf7bd3f",
  "url": "https://media.example.com/2023/06/hello/",
  "accountId": "8fe1b860-558c-5107-a9af-21c376a6a27c",
  "title": null,
  "image": null,
  "description": null,
  "author": null,
  "editor": null,
  "datePublished": null,
  "dateModified": null,
  "location": null,
  "bodyFormatValue": "text",
  "proofJws": "",
  "categories": []
}
```

`id`, `url`, `accountId` 以外のフィールドは無視して構いません。今回の実験では使用しない部分です。

SDP の登録が出来たら、ページからその SDP を参照させましょう。これは、次に説明するエンドポイントの URL を、記事ページの HTML 内に <link\> 要素で指定することで実現します。

API の詳細については、[CIP 提供 DP レジストリについて](#cip-提供-dp-レジストリについて) も参照ください。

#### `/website/profiles` エンドポイント

DP レジストリに登録済みの Profile Set を取得するためのエンドポイントです。クエリパラメータ `url` を付与して、 GET リクエストを送ってください。 `url` には、記事の URL を指定してください。記事に紐づいた Profile Set が JSON-LD 形式で返ってきます。`url` は RFC 3986 の形式でエンコーディングしてください（通常のクエリパラメータのエンコーディング方式です）。

このエンドポイントは認証不要であり、記事を閲覧した全てのユーザーが Profile Set を取得・検証することができます。

リクエスト例:

```shell
curl https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F
```

上記の例は、curl コマンドで DP レジストリ (`dprexpt.originator-profile.org`) のエンドポイントに　 GET リクエストを送っています。
`url` クエリパラメータに `https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F` を付与し、 `https://media.example.com/2023/06/hello/` に紐づく Profile Set の取得を要求します。

:::caution

url パラメータには、 DP 登録時に指定した URL と**文字列として完全に一致する**ものを与えてください。例えば、登録時に URL の末尾に `/` を付与しなかった場合には、このエンドポイントにも、末尾に `/` のない URL を与えてください。その他、[URL の仕様](https://url.spec.whatwg.org/#url-serializing)上は無視すべき違いであっても、Profile Set が返ってこない原因となります。これは現時点の実装上の制約です

例:

登録時に URL `https://example.com/` を与えた場合、

- 正しいリクエスト: `https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fexample.com%2F`

- 間違ったリクエスト 1（末尾の`/`がない）: `https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fexample.com`
- 間違ったリクエスト 2（大文字小文字）: `https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2FEXAMPLE.COM%2F`

:::

レスポンスの例（見やすく整形しています）:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "profile": [
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNlcnRpZmllciIsImRvbWFpbk5hbWUiOiJvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJwb3N0YWxDb2RlIjoiMTA4LTAwNzMiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6Iua4r-WMuiIsInN0cmVldEFkZHJlc3MiOiLkuInnlLAiLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL2lucXVpcnkvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119LHsidHlwZSI6ImhvbGRlciIsImRvbWFpbk5hbWUiOiJtZWRpYS5leGFtcGxlLmNvbSIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vIiwibmFtZSI6IuS8muWToSAo6Kmm6aiT55SoKSIsInBvc3RhbENvZGUiOiIxMDAtMDAwMCIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Y2D5Luj55Sw5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IiIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiMk9LbXF1VVBpbWtzaGtKUVdXaWgtLXp1LVUxTmtEc0tJbVdfbzNrYmVPZyIsInkiOiJmOWJnZU1IX3FMUzVMdk95YzNkSG9LWUptVmZ1dEVNOVZyYjJXZUVlbXRNIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJENUQ1UDNVclYxVl82VV9xOXlLdl9qWl9xOFNoSXZyeHk3RTJReU9mV1lFIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoibWVkaWEuZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg1MzczMTcsImV4cCI6MTcyMDE1OTcxN30.HmflTdUnbgLKpXbbCtO6eV4nR6Ncttlv_4sCJUsHujeLO2QHS2_Ot6VddzECiOcLX_UotBRVqhvJ_J1OQJNVpw",
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ"
  ]
}
```

API の詳細については、 [CIP 提供 DP レジストリについて](#cip-提供-dp-レジストリについて) も参照ください。

このファイルには指定された記事の URL に対して登録した SDP およびその SDP の発行元組織の SOP (後述の操作で登録) が含まれます。ブラウザではそれらの署名を検証し、閲覧中の URL と一致することを確認の上で画面に表示します。

### SDP の作成と DP レジストリへの登録

#### SDP の作成

DP レジストリに登録するにはまず、Signed Document Profile (SDP) を作成する必要があります。
前提条件として組織情報の登録、公開鍵の登録、Signed Originator Profile 発行を行う必要があります。
今回は下記を使用して実行します。

- プライベート鍵のパス: key.pem
- 登録する組織: media.example.com

SDP の生成は Web ページの HTML からテキストを抜き出し連結し署名する実装が必要ですが、これについては処理対象を定義したファイル `website.json` を用意し、コマンドラインで読み込むだけで SDP を生成する CLI を用意しています。

SDP 生成対象を定義する `website.json` ファイルは[website.example.json](https://github.com/webdino/profile/blob/main/apps/registry/website.example.json) などをひな形として作成してください。例えば下記のような内容を使用します。

```json
{
  "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc8",
  "url": "http://localhost:8080",
  "location": "h1",
  "bodyFormat": { "connect": { "value": "visibleText" } },
  "body": "OP 確認くん",
  "title": "OP 確認くん"
}
```

公開鍵のパス、登録する組織、Web ページの情報を引数として使用して下記のように実行します。

```
$ profile-registry publisher:website \
  -i key.pem \
  --id media.example.com \
  --input website.json \
  -o create
```

実行結果として下記のようにコンソールに表示されます。

```
{
  "id": "ef9d78e0-d81a-4e39-b7a0-27e15405edc8",
  "url": "http://localhost:8080",
  "accountId": "e1c6e970-0739-5227-a429-ae0dfa897398",
  "title": "OP 確認くん",
  "image": null,
  "description": null,
  "author": null,
  "editor": null,
  "datePublished": null,
  "dateModified": null,
  "location": "h1",
  "bodyFormatValue": "visibleText",
  "proofJws": "eyJhbGciOiJFUzI1NiIsImtpZCI6Im5Senc0VzdFVXJSMmlZdGlMbkFick5QOVVEdFFneE96OGZnX3poRjBmTkEiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..Y_IlLjScpDwO3cfBPLSgh0mPVAw8xgU00DcPmL-e2ZD8Mpf6QkzH6raX_Anh0YWJRLWaS3US80MRHZmxfcmPpw"
}
```

#### SOP を DP レジストリに登録

Originator Profile レジストリ運用者から受け取った Signed Originator Profile (SOP) を Document Profile レジストリに登録します。

```
$ profile-registry account:register-op --id <ドメイン名> --op <Signed Originator Profileファイル>
```

これにより DP レジストリは `/website/profiles` エンドポイントで SOP と SDP をまとめて返せるようになります。

DP の作成が可能になったら、DP 発行処理を CMS 側に組み込み、記事の編集後に自動で DP の発行と <link\> 要素の埋め込みがされるようにします。

## CMS の実装ガイド

### 全体の流れ (HTML の一部を CSS Selector で選択、署名、SDP 生成、DP レジストリ登録、Link 付与)

CMS への実装として WordPress での手順を例に説明します。

#### 事前準備

Document Profile レジストリ へのアクセス情報は事前にお渡しします。
その情報を WordPress での実装に使用いたします。

:::danger
DP レジストリは各社共同使用となっています。
案内に記載された方法以外での使用は避けてください。
:::

#### WordPress 連携

##### プラグインのインストール

WordPress サイトに WordPress Profile Plugin をインストールします。
詳細は [WordPress 参照実装のソースコード](https://github.com/webdino/profile/tree/main/packages/wordpress#readme)をご確認ください。

Document Profile レジストリのドメイン名を、WordPress 管理者画面 > Settings > Profile > [レジストリドメイン名] に入力します。

例:

```
dprexpt.originator-profile.org
```

[レジストリの管理者を作成](/registry/document-profile-registry-creation.md#レジストリの管理者の作成)した際の認証情報、WordPress 管理者画面 > Settings > Profile > [認証情報] に入力します。

例:

```
cfbff0d1-9375-5685-968c-48ce8b15ae17:GVWoXikZIqzdxzB3CieDHL-FefBT31IfpjdbtAJtBcU
```

それぞれ適切な値を入力したら、保存を選択し、設定を反映します。
設定が反映されれば、それ以降公開される投稿で Profile Set が配信されるようになります。

<!-- docs/registry/wordpress-integration.md より -->

### 署名付与の WordPress,それ以外の Web サイトのプロトタイプに関する説明

#### WordPress

```mermaid
sequenceDiagram
actor 利用者
actor WordPress 管理者
participant WordPress
participant WordPress Plugin
participant Document Profile レジストリ
participant Originator Profile レジストリ

WordPress 管理者->>WordPress: WordPress Plugin のインストール
WordPress->>WordPress Plugin: activated_plugin hook
WordPress Plugin-->>WordPress 管理者: 公開鍵

WordPress 管理者->>Originator Profile レジストリ: Originator Profile の発行依頼
Originator Profile レジストリ-->>WordPress 管理者: Signed Originator Profile
WordPress 管理者->>Document Profile レジストリ: Signed Originator Profile の登録

WordPress 管理者->>WordPress: 記事の公開
WordPress->>WordPress Plugin: transition_post_status hook
WordPress Plugin->>WordPress Plugin: Signed Document Profile の発行
WordPress Plugin->>Document Profile レジストリ: Signed Document Profile の登録

利用者->>WordPress: 投稿の閲覧
WordPress->>WordPress Plugin: wp_head hook
WordPress Plugin-->>利用者: HTML <link> 要素

利用者->>Document Profile レジストリ: 拡張機能をクリック
Document Profile レジストリ-->>利用者: Profile Set

利用者->>利用者: コンテンツ情報の閲覧と検証
```

<!-- docs/registry/wordpress-integration.md より -->

#### 他の Web サイト

```mermaid
sequenceDiagram
actor 利用者
actor Web サイト管理者
participant Web サイト
participant Document Profile レジストリ

Web サイト管理者->>Web サイト管理者: 鍵ペアの生成

Web サイト管理者->>Originator Profile レジストリ: Originator Profile の発行依頼
Originator Profile レジストリ-->>Web サイト管理者: Signed Originator Profile
Web サイト管理者->>Document Profile レジストリ: Signed Originator Profile の登録

Web サイト管理者->>Web サイト: HTML <link> 要素の設置
Web サイト管理者->>Web サイト: 記事本文の抽出
Web サイト-->>Web サイト管理者: 記事本文
Web サイト管理者->>Document Profile レジストリ: Signed Document Profile の発行

利用者->>Web サイト: 記事の閲覧
Web サイト-->>利用者: HTML <link> 要素

利用者->>Document Profile レジストリ: 拡張機能をクリック
Document Profile レジストリ-->>利用者: Profile Set

利用者->>利用者: コンテンツ情報の閲覧と検証
```

<!-- docs/registry/website-integration.md より -->

WordPress 以外の Web サイトで実装する場合、手順が異なり下記のような内容の実施が必要となります。

1. HTML <link\> 要素の設置
2. 記事本文の抽出
3. Signed Document Profile の発行

以降では、Document Profile レジストリとウェブサイトそれぞれ下記の場合を例として説明します。

- Document Profile レジストリのドメイン名: dprexpt.originator-profile.org
- 対象のウェブサイト: https://originator-profile.org/

#### HTML <link\> 要素の設置

設置する <link\> 要素は下記のように書き表します。

```html
<link
  href="https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Foriginator-profile.org%2F"
  rel="alternate"
  type="application/ld+json"
/>
```

#### 記事本文の抽出

:::note
profile-registry CLI によって署名対象の記事の本文を抽出します。
あらかじめ profile-registry CLI をインストールする必要があります。

開発ガイド: https://profile-docs.pages.dev/development
:::

記事の URL、検証対象となるテキストの範囲、抽出結果の保存先を表明する .extract.json を作成します。

```
[
  {
    "url": "https://originator-profile.org/ja-JP/",
    "bodyFormat": "visibleText",
    "location": "[itemprop=articleBody]",
    "output": "src/ja-JP/.website.json"
  },
  {
    "url": "https://originator-profile.org/ja-JP/about/",
    "bodyFormat": "visibleText",
    "location": "[itemprop=articleBody]",
    "output": "src/ja-JP/about/.website.json"
  },
  {
    "url": "https://originator-profile.org/ja-JP/for-viewer/",
    "bodyFormat": "visibleText",
    "location": "[itemprop=articleBody]",
    "output": "src/ja-JP/for-viewer/.website.json"
  },
  {
    "url": "https://originator-profile.org/ja-JP/future/",
    "bodyFormat": "visibleText",
    "location": "[itemprop=articleBody]",
    "output": "src/ja-JP/future/.website.json"
  },
  {
    "url": "https://originator-profile.org/ja-JP/structure/",
    "bodyFormat": "visibleText",
    "location": "[itemprop=articleBody]",
    "output": "src/ja-JP/structure/.website.json"
  }
]
```

作成した.extract.json から OGP 等メタデータ、検証対象となるテキストの抽出するため、
下記コマンドを実行します。

```
$ profile-registry publisher:extract-website --input .extract.json
```

出力結果が下記です

```
{
  "url": "https://originator-profile.org/ja-JP/",
  "location": "[itemprop=articleBody]",
  "bodyFormat": {
    "connect": {
      "value": "visibleText"
    }
  },
  "body": "一般的なネットユーザーの課題\nちゃんと事実を伝えているウェブ上の記事とか広告とかって、信頼できる情報だけ見る方法はないのかしら...？\nフェイクニュースや有害サイトってどうやってもなくならないの...？\n\nアテンションエコノミー（関心を引くことの価値化）を背景に、事実を伝える記事より例えフェイクニュースであっても目立つ記事の方が利益が上がる構造ができています。これはコンテンツ発信者とその信頼性を確認する一般的な手段が無いことが大きな原因の一つです。閲覧者や広告配信システムが良質な記事やメディアを識別可能にすれば、インターネットの情報流通はより健全化できます。\n\nウェブコンテンツを閲覧される方へ\n\n広告・メディア関係者の課題\nえええー！？ こんな危険なサイトにウチの広告が！！\nあれ、この記事の内容にウチの広告は合わないのでは！？\n\n不適切なサイト (メディア) に広告が掲載されたり、逆に、表示して欲しくない広告が掲載されることがあります。検索結果に偽サイトなどが表示されたり、SNS でもフェイクニュースが目立った形で拡散されたりしています。適切なサイトや広告主を識別し、適切なサイトと広告のマッチングをしたり、その配信記録を残すことでブランド毀損を防げます。\n\n一方で...\nでも、情報の規制は良くないよね、言論の自由も認められなければいけない。\n\nそのとおりです。ただし、Originator Profile技術はメディアや広告主の峻別しゅんべつをおこなうものではありません。現存する認証機関などに活用してもらうことを考えています。\n\n課題を解決するために\nコンテンツの発信元や流通経路を透明化する手段を提供します\n\nウェブ上の記事や広告といったコンテンツの発信者や掲載サイトの運営者の情報を付与し、公正な基準で第三者認証された発信者や運営者を確認出来るようにします。現在、これを実現するための技術と仕組みの開発と運用試験を、広告やメディアの関係企業や大学の研究機関と共に行っています。\n\n「Originator Profile 技術とは」についてもご覧ください。\n\nウェブ標準化に向けて\n\n情報の発信者や流通経路、広告主を透明化することで、様々な問題を解決できます。\n\nコンテンツ発信元や第三者認証情報をウェブブラウザで簡単に確認できます\nなりすましや改変を防ぎ安心してコンテンツを閲覧できます\n不適切な広告の掲載や、不適切なサイトへの広告掲載を防げます\n目をひくだけでなく、適切な記事の配信者の収益性を高めることができます\n\n次代のウェブをより健全で公益性の高いものとするべく、これらの問題を解決するため Originator Profile 技術を標準規格として Web 技術の標準化団体（W3C）に提案し、世界標準化と普及を目指した取り組みを行っています。",
  "datePublished": null,
  "author": null,
  "description": "Originator Profileの紹介ページ",
  "image": "https://originator-profile.org/image/ogp.png",
  "title": "Originator Profile"
}
```

#### Signed Document Profile の発行

.website.json から Signed Document Profile を発行し Document Profile レジストリに登録します。
あらかじめ Document Profile レジストリのデータベースの接続情報が必要です。
この際、--identity で指定するプライベート鍵は Originator Profile レジストリに登録した公開鍵とペアでなければなりません。

```
$ profile-registry publisher:website --identity <プライベート鍵> --id <管理者の UUID> --operation create
```

#### ブラウザでの表示結果確認

CMS (WordPress または他の CMS) 側の実装が終わったら出力 HTML に SDP への <link\> 要素が含まれていることを確認します。

![ブラウザでの確認1](assets/check_browser01.png)

拡張機能を起動して読み込まれることを確認します。

![ブラウザでの確認2](assets/check_browser02.png)

## CIP 提供 DP レジストリについて

今回の実証実験では、 DP レジストリとして、 CIP が提供したものを使用してください。
DP レジストリが提供する API のうち、次の 2 つのエンドポイントが今回の実験に関係します。

- `/admin/publisher/{アカウントID}` エンドポイント
  - 署名付き DP を DP レジストリに登録するためのエンドポイントです。POST メソッドをサポートします。
- `/website/profiles` エンドポイント
  - Profile Set を取得するためのエンドポイントです。GET メソッドをサポートします。今回の実証実験では、 <link\> 要素の `href` 属性にこのエンドポイントへの URL を記載することになります。

各エンドポイントのおおまかな使い方については [DP レジストリ API の確認](#dp-レジストリ-api-の確認) を参照ください。

### `admin/publisher/{アカウントID}` エンドポイント詳細

#### パラメータ　（`/admin/publisher/{アカウントID}` エンドポイント）

パラメータの一覧は以下になります。これらを POST リクエストのボディーに JSON 形式で与えてください。全て必須パラメータになります。

| パラメータ名 | 型               | 説明                       |
| ------------ | ---------------- | -------------------------- |
| jwt          | 文字列           | DP を与えてください        |
| input        | 下記テーブル参照 | 記事の情報を与えてください |

`input` パラメータの内部には、以下のパラメータを入れてください。

| パラメータ名 | 型                | 説明                                                                                      |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------- |
| id           | 文字列            | 記事の ID を与えてください。必ず UUID 文字列表現 (RFC 4122) でなければなりません (MUST)。 |
| url          | 文字列            | 記事の URL を与えてください                                                               |
| bodyFormat   | JSON オブジェクト | `{"connect":{"value":"text"}}` を入れてください。                                         |
| proofJws     | 文字列            | 空文字列 `""` を入れてください。                                                          |

#### リクエストの例（`/admin/publisher/{アカウントID}` エンドポイント）

登録 (curl)

```
$ curl -X POST https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e","url":"https://media.example.com/2023/06/hello/","bodyFormat":{"connect":{"value":"text"}},"proofJws":""},"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ"}'
```

更新 (curl)

```
$ curl -X PUT https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8  \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e","url":"https://media.example.com/2023/06/hello/","bodyFormat":{"connect":{"value":"text"}},"proofJws":""},"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ"}'
```

#### レスポンスの例（`/admin/publisher/{アカウントID}` エンドポイント）

DP の登録に成功した場合、次のようなレスポンスが返ってきます。

レスポンス例（見やすく整形しています）:

```json
{
  "id": "403cc6d4-53d6-4286-9f42-930e0bf7bd3f",
  "url": "https://media.example.com/2023/06/hello/",
  "accountId": "8fe1b860-558c-5107-a9af-21c376a6a27c",
  "title": null,
  "image": null,
  "description": null,
  "author": null,
  "editor": null,
  "datePublished": null,
  "dateModified": null,
  "location": null,
  "bodyFormatValue": "text",
  "proofJws": "",
  "categories": []
}
```

DP の登録に失敗した場合、以下のようなレスポンスが返ってきます。

失敗レスポンス（リクエストのパラメータが間違っていた場合）:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "invalid request"
}
```

失敗レスポンス（`jwt` パラメータに渡した DP が間違っていた場合）:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid issue request: It is not Document Profile."
}
```

上のエラーメッセージの場合、具体的には `jwt` の中に [dp クレーム](/spec#dp-document-profile-クレーム) が含まれていないためエラーになっています。

失敗レスポンス（認証情報が間違っていた場合）:

```json
{
  "statusCode": 401,
  "code": "HTTP_ERROR_UNAUTHORIZED",
  "error": "Unauthorized",
  "message": "Invalid password"
}
```

失敗レスポンスが返ってきた場合、 DP の登録ができていません。成功レスポンスが返ってくるように、リクエストを修正してください。

### `/website/profiles` エンドポイント詳細

#### パラメータ（`/website/profiles` エンドポイント）

パラメータの一覧は以下になります。これらを GET リクエストのクエリパラメータに与えてください。全て必須パラメータとなります。

| パラメータ名 | 型     | 説明                                                                                                     |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------- |
| url          | 文字列 | 記事の URL を与えてください。記事登録時に指定した URL を RFC 3986 の形式でエンコーディングしてください。 |

#### リクエストの例（`/website/profiles` エンドポイント）

```
$ curl https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F
```

#### レスポンスの例（`/website/profiles` エンドポイント）

成功レスポンスの例（見やすく整形しています）:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "profile": [
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNlcnRpZmllciIsImRvbWFpbk5hbWUiOiJvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJwb3N0YWxDb2RlIjoiMTA4LTAwNzMiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6Iua4r-WMuiIsInN0cmVldEFkZHJlc3MiOiLkuInnlLAiLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL2lucXVpcnkvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119LHsidHlwZSI6ImhvbGRlciIsImRvbWFpbk5hbWUiOiJtZWRpYS5leGFtcGxlLmNvbSIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vIiwibmFtZSI6IuS8muWToSAo6Kmm6aiT55SoKSIsInBvc3RhbENvZGUiOiIxMDAtMDAwMCIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Y2D5Luj55Sw5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IiIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiMk9LbXF1VVBpbWtzaGtKUVdXaWgtLXp1LVUxTmtEc0tJbVdfbzNrYmVPZyIsInkiOiJmOWJnZU1IX3FMUzVMdk95YzNkSG9LWUptVmZ1dEVNOVZyYjJXZUVlbXRNIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJENUQ1UDNVclYxVl82VV9xOXlLdl9qWl9xOFNoSXZyeHk3RTJReU9mV1lFIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoibWVkaWEuZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg1MzczMTcsImV4cCI6MTcyMDE1OTcxN30.HmflTdUnbgLKpXbbCtO6eV4nR6Ncttlv_4sCJUsHujeLO2QHS2_Ot6VddzECiOcLX_UotBRVqhvJ_J1OQJNVpw",
    "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ"
  ]
}
```

失敗レスポンスの例（ url に対応する Profile Set がなかった場合）:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": ""
}
```

失敗レスポンスが返ってきた場合、求める Profile Set が返ってくるようにリクエストを修正してください。

### 試験用アカウント情報

CIP 提供 DP レジストリでは、試用のために下記のアカウント情報が登録されています。
このアカウント情報を使って実際に API を確認することもできます。

試験用 OP ID

```
media.example.com
```

試験用アカウント ID

```
8fe1b860-558c-5107-a9af-21c376a6a27c
```

試験用 API 認証情報 (**本実験以外では決して使用しないでください**)

```
8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8
```

試験用鍵ペア (**本実験以外では決して使用しないでください**)

プライベート鍵

```pem
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgahNz8S20FnuMaFez
OGlfQwBN5+rem8AnKvtHGDqOpHmhRANCAATY4qaq5Q+KaSyGQlBZaKH77O75TU2Q
OwoiZb+jeRt46H/W4HjB/6i0uS7zsnN3R6CmCZlX7rRDPVa29lnhHprT
-----END PRIVATE KEY-----
```

公開鍵

```json
{
  "kty": "EC",
  "kid": "D5D5P3UrV1V_6U_q9yKv_jZ_q8ShIvrxy7E2QyOfWYE",
  "x": "2OKmquUPimkshkJQWWih--zu-U1NkDsKImW_o3kbeOg",
  "y": "f9bgeMH_qLS5LvOyc3dHoKYJmVfutEM9Vrb2WeEemtM",
  "crv": "P-256"
}
```

試験用アカウントの詳細

```json
{
  "id": "8fe1b860-558c-5107-a9af-21c376a6a27c",
  "domainName": "media.example.com",
  "url": "https://media.example.com/",
  "roleValue": "group",
  "name": "会員 (試験用)",
  "description": null,
  "email": null,
  "phoneNumber": null,
  "postalCode": "100-0000",
  "addressCountry": "JP",
  "addressRegion": "東京都",
  "addressLocality": "千代田区",
  "streetAddress": "",
  "contactTitle": null,
  "contactUrl": null,
  "privacyPolicyTitle": null,
  "privacyPolicyUrl": null,
  "publishingPrincipleTitle": null,
  "publishingPrincipleUrl": null
}
```

SOP の例

```
eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNlcnRpZmllciIsImRvbWFpbk5hbWUiOiJvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJwb3N0YWxDb2RlIjoiMTA4LTAwNzMiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6Iua4r-WMuiIsInN0cmVldEFkZHJlc3MiOiLkuInnlLAiLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL2lucXVpcnkvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119LHsidHlwZSI6ImhvbGRlciIsImRvbWFpbk5hbWUiOiJtZWRpYS5leGFtcGxlLmNvbSIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vIiwibmFtZSI6IuS8muWToSAo6Kmm6aiT55SoKSIsInBvc3RhbENvZGUiOiIxMDAtMDAwMCIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Y2D5Luj55Sw5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IiIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiMk9LbXF1VVBpbWtzaGtKUVdXaWgtLXp1LVUxTmtEc0tJbVdfbzNrYmVPZyIsInkiOiJmOWJnZU1IX3FMUzVMdk95YzNkSG9LWUptVmZ1dEVNOVZyYjJXZUVlbXRNIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJENUQ1UDNVclYxVl82VV9xOXlLdl9qWl9xOFNoSXZyeHk3RTJReU9mV1lFIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoibWVkaWEuZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg1MzczMTcsImV4cCI6MTcyMDE1OTcxN30.HmflTdUnbgLKpXbbCtO6eV4nR6Ncttlv_4sCJUsHujeLO2QHS2_Ot6VddzECiOcLX_UotBRVqhvJ_J1OQJNVpw
```

SOP の確認方法

1. [Jwt.io Debugger](https://jwt.io/#debugger-io?token=eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ&publicKey=%7B%0A%20%20%22kty%22%3A%20%22EC%22%2C%0A%20%20%22kid%22%3A%20%22D5D5P3UrV1V_6U_q9yKv_jZ_q8ShIvrxy7E2QyOfWYE%22%2C%0A%20%20%22x%22%3A%20%222OKmquUPimkshkJQWWih--zu-U1NkDsKImW_o3kbeOg%22%2C%0A%20%20%22y%22%3A%20%22f9bgeMH_qLS5LvOyc3dHoKYJmVfutEM9Vrb2WeEemtM%22%2C%0A%20%20%22crv%22%3A%20%22P-256%22%0A%7D) にアクセスして、左側の Encoded ペインに SOP を貼り付けます。
2. Jwt.io Debugger の画面の右下、Verify Signature > Public Key にアカウントの公開鍵を貼り付けます。
3. 画面下部に Signature Verified と表示されれば OK です。

SDP の例

```
eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ
```

この SDP の生成方法

Step 1
: UUID を生成します。

例:

```console
$ uuidgen
41632705-9600-49df-b80d-a357d474f37e
```

Step 2
: [Jwt.io Debugger](https://jwt.io/#debugger-io?token=eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ&publicKey=%7B%0A%20%20%22kty%22%3A%20%22EC%22%2C%0A%20%20%22kid%22%3A%20%22D5D5P3UrV1V_6U_q9yKv_jZ_q8ShIvrxy7E2QyOfWYE%22%2C%0A%20%20%22x%22%3A%20%222OKmquUPimkshkJQWWih--zu-U1NkDsKImW_o3kbeOg%22%2C%0A%20%20%22y%22%3A%20%22f9bgeMH_qLS5LvOyc3dHoKYJmVfutEM9Vrb2WeEemtM%22%2C%0A%20%20%22crv%22%3A%20%22P-256%22%0A%7D) にアクセスし、Payload > `sub` プロパティの値を生成した UUID に書き換えます。

例:

```json
{
  "iss": "media.example.com",
  "sub": "41632705-9600-49df-b80d-a357d474f37e",
  "iat": 1687827458,
  "exp": 1719449858,
  "https://originator-profile.org/dp": {
    "item": [
      {
        "type": "website",
        "url": "https://media.example.com/2023/06/hello/",
        "title": "メディア (試験用)"
      }
    ]
  }
}
```

※ この例では画面上の本文への署名を省略しています。

Step 3
: SDP を生成します。

Jwt.io Debugger の画面の右下、Verify Signature > Private Key にアカウントのプライベート鍵を貼り付けます。

プライベート鍵を貼り付けると、画面の左側の Encoded ペインには JWT が表示されます。
このとき得られる JWT が SDP です。

SDP の確認方法

1.  [Jwt.io Debugger](https://jwt.io/#debugger-io?token=eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ&publicKey=%7B%0A%20%20%22kty%22%3A%20%22EC%22%2C%0A%20%20%22kid%22%3A%20%22D5D5P3UrV1V_6U_q9yKv_jZ_q8ShIvrxy7E2QyOfWYE%22%2C%0A%20%20%22x%22%3A%20%222OKmquUPimkshkJQWWih--zu-U1NkDsKImW_o3kbeOg%22%2C%0A%20%20%22y%22%3A%20%22f9bgeMH_qLS5LvOyc3dHoKYJmVfutEM9Vrb2WeEemtM%22%2C%0A%20%20%22crv%22%3A%20%22P-256%22%0A%7D) にアクセスし、画面の左側の Encoded ペインに SDP を貼り付けます。
2.  Jwt.io Debugger の画面の右下、Verify Signature > Public Key にアカウントの公開鍵を貼り付けます。
3.  画面下部に Signature Verified と表示されれば OK です。

登録するコマンドの例 (curl)

```console
$ curl -X POST https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e","url":"https://media.example.com/2023/06/hello/","bodyFormat":{"connect":{"value":"text"}},"proofJws":""},"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ"}'
```

更新するコマンドの例 (curl)

```console
$ curl -X PUT https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/ \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8  \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e","url":"https://media.example.com/2023/06/hello/","bodyFormat":{"connect":{"value":"text"}},"proofJws":""},"jwt":"eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjQxNjMyNzA1LTk2MDAtNDlkZi1iODBkLWEzNTdkNDc0ZjM3ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tLzIwMjMvMDYvaGVsbG8vIiwidGl0bGUiOiLjg6Hjg4fjgqPjgqIgKOippumok-eUqCkifV19fQ.fHwD1V6tGG2VpRx_i93Wq14yH7JRzhIRijt1DXYBRQaHEoPstQfEQLA92cR5wq1n58tuH3bHv3D9nwoEaghUVQ"}'
```

HTML の例

```html
<!DOCTYPE html>
<title>メディア (試験用)</title>
<link
  rel="alternate"
  type="application/ld+json"
  href="https://dprexpt.originator-profile.org/website/profiles?url=https%3A%2F%2Fmedia.example.com%2F2023%2F06%2Fhello%2F"
/>
```
