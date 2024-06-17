# iframe に埋め込む HTML コンテンツからの対象テキストの抽出

iframe に埋め込む HTML コンテンツから、署名の対象テキストを抽出する方法を説明します。

## 対象読者

- 広告主・広告代理店（DSP）

## 前提条件

- Node.js
- profile-registry CLI

## テキストの抽出方法

以下のサンプルを用いて説明します。

- [iframe.html](pathname:///examples/iframe.html)

次の例では、iframe に埋め込む HTML ページを配信するローカルサーバーを起動し、[profile-registry publisher:extract-website コマンド](https://github.com/originator-profile/profile/tree/main/apps/registry#profile-registry-publisherextract-website)を使用して対象のテキストを抽出します。抽出結果は、この例では ./ad.json に出力されます。

```console
# サンプルのiframe.htmlを任意のディレクトリにダウンロードした状態
$ tree examples/
examples/
└── iframe.html
# examplesディレクトリを対象としてサーバーを起動
$ npx serve examples
# 起動したサーバーから対象のテキストを抽出
$ profile-registry publisher:extract-website --input <(echo '[{ "url": "http://localhost:3000/iframe", "bodyFormat": "html", "location": "img", "output": "./ad.json" }]')
```

ad.json は以下のような JSON データを含んで出力されます。この方法では、実行するごとに異なる id が採番されます。それ以外の結果は変わりません。

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

この ad.json ファイルを元にして「[署名付き広告プロファイルの作成と設置](./ad-profile-pair-installation.md)」を行うことができます。

抽出方法の詳細については[記事本文の抽出](/integration-development/cli.md#extract-website)を参照してください。
