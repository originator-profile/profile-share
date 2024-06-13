# 署名付きサイトプロファイルの作成と設置

[署名付きサイトプロファイル](/terminology/signed-site-profile.md)の作成方法と設置方法を説明します。

## 対象読者

- 企業・組織のウェブサイトの管理者

## 前提条件

- OP ID
- SOP
- プライベート鍵
- profile-registry CLI

## 署名付きサイトプロファイルの作成 {#create-ssp}

`site-profile.json` ファイルを用意します。 id はサイトプロファイルの DP ID です。UUIDv4 形式の文字列を指定してください。

```json
{
  "id": "<UUIDv4>",
  "title": "<サイト名>",
  "image": "<サムネイル画像URL>",
  "description": "<サイトの説明>"
}
```

例:

```json
{
  "id": "bd8414b0-e585-4b48-8008-2751bb12bc84",
  "title": "サイト名",
  "image": "https://media.example.com/image.png",
  "description": "サイトの説明"
}
```

:::info

表示のされ方については[画像の表示](../../web-ext/image.mdx)を参照してください。

:::

以下のコマンドを実行することで署名付きサイトプロファイルを作成します。

書式:

```
$ profile-registry publisher:sign \
    --site-profile \
    -i <プライベート鍵> \
    --id <OP ID> \
    --allowed-origins '*' \
    --input site-profile.json
```

例:

```
$ profile-registry publisher:sign \
    --site-profile \
    -i example.priv.json \
    --id media.example.com \
    --allowed-origins '*' \
    --input site-profile.json
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.0CmA8cCMZAVeCAslkmMLkNehAwM7tr-Y9y6LHAmAJTUZR8gNTS1d7vpphz2jFfvwyAYUcA4nOsv7Q0uOzb0Teg
```

詳しい profile-registry コマンドの使用方法は「[署名付きドキュメントプロファイルの作成](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-publishersign)」をご確認ください。

## Profile Pair の作成と Well-Known URL による設置

レジストリから発行された SOP と署名付きサイトプロファイルを組み合わせて Profile Pair を作成します。
dp プロパティの中の `sub` には、[署名付きサイトプロファイルの作成](#create-ssp)で生成した UUID を指定してください。

書式:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "website": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "<OP ID>",
      "profile": "<SOP>"
    },
    "dp": {
      "sub": "<UUID>",
      "profile": "<署名付きサイトプロファイル>"
    }
  }
}
```

例:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "website": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "media.example.com",
      "profile": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.vbDKsWlLpPELwSE5r_50njGLo-QDbBugSvl_Lh4sirizsLd9X8Hf8WXcHsP_VSAo50DD5ueRbRyjwQk_0hPk_w"
    },
    "dp": {
      "sub": "bd8414b0-e585-4b48-8008-2751bb12bc84",
      "profile": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.0CmA8cCMZAVeCAslkmMLkNehAwM7tr-Y9y6LHAmAJTUZR8gNTS1d7vpphz2jFfvwyAYUcA4nOsv7Q0uOzb0Teg"
    }
  }
}
```

この Profile Pair を保有するサイトの Well-Known URL `/.well-known/pp.json` に HTTP GET リクエストでアクセスできるようにして署名付きサイトプロファイルを配信します。
