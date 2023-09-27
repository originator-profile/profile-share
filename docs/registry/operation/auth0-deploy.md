# Auth0 テナントのデプロイ

auth0-deploy-cli を利用して Auth0 テナントをデプロイする手順を説明します。

## auth0-deploy-cli のインストール

[Auth0 のドキュメント](https://auth0.com/docs/deploy-monitor/deploy-cli-tool) を参照してください。

## CLI 用の Machine to Machine Application の作成

 Machine to Machine Application を作成します。作成した Application の認証情報を後の手順で利用します。

1. Auth0 Dashboard > Applications > Applications に移動

2. "+ Create Application" -> Machine to Machine Applications -> Create を順にクリック

3. Auth0 Management API を選択

4. Permissions として全ての scopes を選択

5. Authorize をクリック

## 実行

1. profile レポジトリの `./packages/auth0/deploy-cli/` ディレクトリに移動してください。

2. `config.json` に必要な設定を追加します。

	1. `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` に、前節で作成した CLI 用の Application の認証情報を設定します。

	2. デプロイする環境の設定をします。 `tenant.yaml`, `actions.yaml` の中で一部変数を使っています。変数の値を`config.json` の `AUTH0_KEYWORD_REPLACE_MAPPINGS` の中に記載することで、デプロイする環境に適した設定でデプロイします。

|変数名|説明|
|:-:|:-:|
|`REGISTRY_API_URL`| OP/DPレジストリの URL を指定してください。例: `https://oprdev.originator-profile.org/`|
|`ALLOWED_LOGOUT_URLS`| Allowed Logout URLs を指定してください|
|`ALLOWED_ORIGINS`| Allowed Origins (CORS) を指定してください|
|`CALLBACKS`| Allowed Callback URLs を指定してください|
|`WEB_ORIGINS`| Allowed Web Origins を指定してください|
|`SENDGRID_API_KEY`| Email Provider として使う Sendgrid の API キーを指定してください|
|`DEFAULT_FROM_ADDRESS`| メールの From アドレスを指定してください|
|`AUTH_MANAGEMENT_API_IDENTIFIER`| Application -> APIs -> Auth0 Management API -> Identifier の値を貼り付けてください|

3. auth0-deploy-cli を実行します（1回目）。

```console
a0deploy import -c config.json -i tenant.yaml
```

4. 1回目の実行で作成したリソースの値を`config.json` に追記します。

|変数名|説明|
|:-:|:-:|
|`GROUP_ROLE_ID`| `group` ロールの ID を指定してください。 ID は1回目の実行の出力を見るか、 Auth0 管理画面で確認してください。|
|`AUTH0_ACTION_DOMAIN`| 1回目の実行で作成した "Post Login Actions Management API Client" の認証情報を指定してください|
|`AUTH0_ACTION_CLIENT_ID`|  1回目の実行で作成した "Post Login Actions Management API Client" の認証情報を指定してください|
|`AUTH0_ACTION_CLIENT_SECRET`|  1回目の実行で作成した "Post Login Actions Management API Client" の認証情報を指定してください|

5. auth0-deploy-cli を実行します（2回目）。先ほどと指定する yaml ファイルが違うことに注意してください。

```console
a0deploy import -c config.json -i actions.yaml
```

これでデプロイは完了しました。
