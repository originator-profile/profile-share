# Profile UI

Originator Profile プロジェクトに一貫性のある見た目を提供するためのパッケージです。

## Prerequisites

TailwindCSS によってスタイルを生成するため、[TailwindCSS をインストール](https://tailwindcss.com/docs/installation)したのち、以下のような設定に更新する必要があります。

```js
const path = require("node:path");
const extend = require("just-extend");
const config = require("tailwind-config-originator-profile");

/** @type {import('tailwindcss').Config} */
module.exports = extend(config, {
  content: [
    `${path.dirname(
      require.resolve("@originator-profile/ui"),
    )}/components/*.tsx`,
    "./src/**/*.{html,tsx}",
  ],
});
```
