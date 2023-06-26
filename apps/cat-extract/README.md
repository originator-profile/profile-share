# Cat Extract

profile-registry の publisher:category コマンドの入力用 JSON ファイルを作成するコマンドです。

- [Usage](#usage)
- [Commands](#commands)

## Usage

```
# CLI のビルド
$ yarn build
# CLI のグローバルインストール
$ npm i -g .
# CLI の実行
$ cat-extract COMMAND
running command...
```

## Commands

<!-- prettier-ignore-start -->
<!-- commands -->
* [`cat-extract help [COMMANDS]`](#cat-extract-help-commands)
* [`cat-extract publisher:extract-category [OUTPUT]`](#cat-extract-publisherextract-category-output)

## `cat-extract help [COMMANDS]`

Display help for cat-extract.

```
USAGE
  $ cat-extract help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for cat-extract.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `cat-extract publisher:extract-category [OUTPUT]`

カテゴリー情報の抽出 ("profile-registry publisher:category -o createMany"用)

```
USAGE
  $ cat-extract publisher:extract-category [OUTPUT] --input <value>

ARGUMENTS
  OUTPUT  [default: category.json] 出力先ファイル ("-": 標準出力)

FLAGS
  --input=<value>  (required) Excel file

DESCRIPTION
  カテゴリー情報の抽出 ("profile-registry publisher:category -o createMany"用)

FLAG DESCRIPTIONS
  --input=<value>  Excel file

    IAB Tech Lab Content Category Taxonomy 1.0の定義ファイル
    詳しくは当該ファイル https://iabtechlab.com/wp-content/uploads/2023/03/Content-Taxonomy-1.0-1.xlsx
    を参照してください
```
<!-- commandsstop -->
<!-- prettier-ignore-end -->
