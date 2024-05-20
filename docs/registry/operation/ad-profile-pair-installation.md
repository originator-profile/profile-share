# 署名付き広告プロファイルの作成と設置

署名付き広告プロファイルの作成方法と設置方法を説明します。

## 対象読者

- 広告主・広告代理店（DSP）

## 前提条件

- OP ID
- SOP
- プライベート鍵
- profile-registry CLI

## 署名付き広告プロファイルの作成

`ad.json` ファイルを用意します。

形式:

```json
{
  "id": "<UUID>",
  "location": "img",
  "bodyFormat": "html",
  "body": "<img>",
  "title": "<広告名>",
  "image": "<画像URL>",
  "description": "<広告の説明>"
}
```

例:

```json
{
  "id": "29164cbb-3775-402e-9c0e-243a639c06e8",
  "location": "img",
  "bodyFormat": "html",
  "body": "<img src=\"https://op-logos.demosites.pages.dev/placeholder-120x80.png\" width=\"120\" height=\"80\" decoding=\"async\" alt=\"ダミー画像\">",
  "title": "埋め込みHTMLコンテンツ",
  "image": "https://op-logos.demosites.pages.dev/placeholder-120x80.png",
  "description": "広告の説明"
}
```

UUID を生成して id に指定します。

:::info

image プロパティを参照した画像表示は、本実験に対応した拡張機能の初版では幅 80px \* 高さ 45px の表示領域にアスペクト比を保持して表示されます。また、CORS を許可しておいてください。表示のされ方の詳細は[画像の表示](../../media-study-202307/image.md)を参照してください。

:::

以下のコマンドを実行することで署名付き広告プロファイルを作成します。

書式:

```
$ profile-registry advertiser:sign \
 -i <プライベート鍵> \
 --id <OP ID> \
 --allowed-origins '\*' \
 --input ad.json
```

コマンド実行後、画面上に表示される "eyJ" から始まる文字列が署名付き広告プロファイルです。

例:

```
$ profile-registry advertiser:sign \
    -i example.priv.json \
    --id ad.example.com \
    --allowed-origins '*' \
    --input ad.json
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.84MsC1qvUkYy8YPLH02iBZG54QR8KkYfmg_Y9bRRNP6y6wiIAlmpnD1JFcZpFCz4Z4BkOwx0-kk2obwnAkf_EA
```

詳しい profile-registry コマンドの使用方法は「[署名付き広告プロファイルの作成](https://github.com/originator-profile/profile-share/tree/main/apps/registry#profile-registry-advertisersign)」をご確認ください。

## Profile Pair の作成

レジストリから発行された SOP と署名付き広告プロファイルを組み合わせて Profile Pair を作成します。

形式:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "ad": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "<OP ID>",
      "profile": "<SOP>"
    },
    "dp": {
      "sub": "<UUID>",
      "profile": "<署名付き広告プロファイル>"
    }
  }
}
```

`<UUID>` は署名付き広告プロファイルの sub クレームです。前項の ad.json の id と同じ値です。

例:

```json
{
  "@context": "https://originator-profile.org/context.jsonld",
  "ad": {
    "op": {
      "iss": "oprexpt.originator-profile.org",
      "sub": "ad.example.com",
      "profile": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.yjLiHJgjY3idlFAcuDYjOE4SU-265-8Z4FO_saHEiclAw7R0_1h0fwftQYGbB-eieIh6kMy6VMSl_XFv5ybr5Q"
    },
    "dp": {
      "sub": "29164cbb-3775-402e-9c0e-243a639c06e8",
      "profile": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.84MsC1qvUkYy8YPLH02iBZG54QR8KkYfmg_Y9bRRNP6y6wiIAlmpnD1JFcZpFCz4Z4BkOwx0-kk2obwnAkf_EA"
    }
  }
}
```

## iframe による設置

[iframe に埋め込む HTML の中に Profile Pair を記述して表現します](/spec/#html)。

:::note

現在の実装では、iframe 要素からの SOP、SDP の取得は [Ad Profile Pair](/terminology/ad-profile-pair.md) にのみ対応しています。Profile Set 形式、[Website Profile Pair](/terminology/website-profile-pair.md) による取得は受け付けません。

:::

HTML ファイルの `</body>` 終了タグの直前に `<script type="application/ld+json">` 要素を追加し、Profile Pair を記述します。

例:

- [iframe.html](pathname:///examples/iframe.html)

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
            "sub": "ad.example.com",
            "profile": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.yjLiHJgjY3idlFAcuDYjOE4SU-265-8Z4FO_saHEiclAw7R0_1h0fwftQYGbB-eieIh6kMy6VMSl_XFv5ybr5Q"
          },
          "dp": {
            "sub": "29164cbb-3775-402e-9c0e-243a639c06e8",
            "profile": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.e30.84MsC1qvUkYy8YPLH02iBZG54QR8KkYfmg_Y9bRRNP6y6wiIAlmpnD1JFcZpFCz4Z4BkOwx0-kk2obwnAkf_EA"
          }
        }
      }
    </script>
  </body>
</html>
```

この HTML ファイルを広告クリエイティブとして iframe などで埋め込むことで署名付き広告プロファイルを配信します。
