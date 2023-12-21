# リリース方法

本書ではリリースする方法を説明します。

## 対象読者

- 開発チームメンバー

## 前提事項

GitHubリポジトリへのアクセス権限が必要です:

- https://github.com/originator-profile/profile-share
- https://github.com/originator-profile/profile

Profile WordPress Plugin のビルド環境が必要です:

- [Docker CLI](https://www.docker.com/get-started) と [Compose Plugin](https://docs.docker.com/compose/cli-command/) のインストール
  - Windows: [WSL 2 での Docker リモート コンテナーの概要](https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/wsl-containers)

## 手順

全体の流れ:

1. フォークの同期
2. リリースの作成
3. リリースアセットのアップロード

Step 1
: フォークを同期

https://github.com/originator-profile/profile-share にアクセスし「[上流リポジトリと同期](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)」します。

上流リポジトリは <https://github.com/originator-profile/profile> です。

Step 2
: リリースの作成

https://github.com/originator-profile/profile-share にアクセスし「[リリースを作成](https://docs.github.com/ja/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)」します。

新しいリリースのバージョン番号は[セマンティックバージョニング仕様](https://semver.org/lang/ja/)に準拠して決めます。

バージョン番号の例:

```
v0.0.1
```

Step 3
: リリースアセットのアップロード

### Profile Web Extension のアップロード

1. [originator-profile/profile/test](https://github.com/originator-profile/profile/actions/workflows/test.yml?query=branch%3Amain) にアクセス
2. 最新のワークフローを選択
3. Artifacts > [artifact] から、Zipファイルをダウンロード
4. ダウンロードしたZipファイルを展開
5. web-ext-artifacts/\*.zip をリリースアセットとしてアップロード

### WordPress Plugin のアップロード

ターミナルで以下のコマンドを実行し、ファイル wordpress-profile-plugin.zip を生成します:

```sh
git clone https://github.com/originator-profile/profile-share
cd profile-share/packages/wordpress
docker build --output=dist .
```

ファイル wordpress-profile-plugin.zip は profile-share/packages/wordpress/dist ディレクトリ内に生成されます。
生成したファイル wordpress-profile-plugin.zip をリリースアセットとしてアップロードします。
