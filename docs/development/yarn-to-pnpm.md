# pnpmへの移行

yarnからpnpmへの移行手順を説明します。

まずpnpmをインストールします。

```
$ corepack enable pnpm
```

そしてpnpmによって依存関係をインストールします。
node_modules ディレクトリが存在する場合、それらを一度削除してください。

```
$ git clean -xf {,{apps,packages}/*/}node_modules
Removing node_modules/
Removing apps/registry/node_modules/
Removing apps/web-ext/node_modules/
Removing packages/core/node_modules/
Removing packages/eslint-config/node_modules/
Removing packages/model-docs/node_modules/
Removing packages/model/node_modules/
Removing packages/registry-db/node_modules/
Removing packages/registry-service/node_modules/
Removing packages/registry-ui/node_modules/
Removing packages/sign/node_modules/
Removing packages/tailwind-config/node_modules/
Removing packages/tsconfig/node_modules/
Removing packages/ui/node_modules/
Removing packages/verify/node_modules/
Removing packages/wordpress/node_modules/
```

```
$ pnpm install
```

最後に、ビルドできることを確認します。

```
$ pnpm build
```

## Volta

[Volta](https://docs.volta.sh/) がインストールされている場合は次のコマンドで pnpm をインストールできます:

> ```
> volta install pnpm
> ```
>
> _https://pnpm.io/installation#using-volta より_

:::note

Volta の pnpm サポートは[現在実験的段階](https://docs.volta.sh/advanced/pnpm)です。
問題が発生する場合は環境変数 `VOLTA_FEATURE_PNPM=1` を設定してみましょう。

:::
