---
sidebar_position: 2
---

# 拡張機能のビルド

## 対象読者

- 開発者

## 前提条件

いずれかのGitHubリポジトリへのアクセス権限が必要です。

- https://github.com/originator-profile/profile
- https://github.com/originator-profile/profile-share

## ビルド

ビルドする2つの方法を紹介します。

### 方法1: pnpm build

1. [開発環境の構築](../development/index.mdx)
1. `pnpm build` コマンドの実行
1. `apps/web-ext/web-ext-artifacts/*.zip` の取得

### 方法2: GitHub Actions

https://github.com/originator-profile/profile へのアクセス権限が必要です。

1. 「[コミットをリモートリポジトリにプッシュする](https://docs.github.com/ja/get-started/using-git/pushing-commits-to-a-remote-repository)」を参考に、`git push` コマンドを実行
1. 「[GitHub Actions](https://github.com/originator-profile/profile/actions)」にアクセス
1. 対象のワークフローを選択
1. Artifacts > [web-ext] からダウンロード
