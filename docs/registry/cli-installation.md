---
sidebar_position: 9
sidebar_label: CLI インストール方法
---

# profile-registry CLI インストール方法

Step 1
: Git と [Node.js](https://nodejs.org/) のインストール

- Node.js は 2024年5月時点では v18, v20 を[サポートしています](https://github.com/originator-profile/profile-share/blob/main/package.json#L44)。

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

:::note

その他、開発用サーバーの起動を含む開発環境の構築方法については、[開発ガイド](/development/)を参照してください。

:::

:::note

動作環境については[動作確認済み環境](/development/confirmed-env.md)を参照してください。

:::
