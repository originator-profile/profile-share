# OP 登録サイトのデプロイ

oprexpt.originator-profile.org で公開する OP 登録サイトのデプロイ手順を説明します。

1. [Create Tenants](https://auth0.com/docs/get-started/auth0-overview/create-tenants) を参考に、本番環境用の Auth0 のテナントを作成します。次の値を使用してください。

|     項目名      |     値     |
| :-------------: | :--------: |
|   Tenant Name   |  oprexpt   |
|     Region      |   Japan    |
| Environment Tag | Production |

上記の値を入力し、 create を押下します。

2. 作成したテナントで[Auth0 テナント構成の適用](./auth0-deploy.md)の手順を実施します。[config.json](https://auth0.com/docs/deploy-monitor/deploy-cli-tool/configure-the-deploy-cli#configuration-file)の [AUTH0_KEYWORD_REPLACE_MAPPINGS](https://auth0.com/docs/deploy-monitor/deploy-cli-tool/keyword-replacement) には次のように設定してください。

|              変数名               |                                        説明                                        |
| :-------------------------------: | :--------------------------------------------------------------------------------: |
|        `REGISTRY_API_URL`         |                     `https://oprexpt.originator-profile.org/`                      |
|          `SPA_HOME_URL`           |                   `https://oprexpt.originator-profile.org/app/`                    |
|        `SENDGRID_API_KEY`         |          Email Provider として使う Sendgrid の API キーを指定してください          |
|      `DEFAULT_FROM_ADDRESS`       |                      メールの From アドレスを指定してください                      |
| `AUTH0_MANAGEMENT_API_IDENTIFIER` | Application -> APIs -> Auth0 Management API -> Identifier の値を貼り付けてください |

3. Cloudflare の管理画面で oprexpt 用のバケットを作成します。[R2 の設定](./r2-configuration.md) に従ってください。

4. Heroku App の [Config Vars を設定](https://devcenter.heroku.com/articles/config-vars#managing-config-vars)します。 oprexpt App の [Settings タブ](https://dashboard.heroku.com/apps/oprexpt/settings)の Config Vars の項目で設定します。設定後自動で App が再起動します。

|              変数名               |                                             値                                             |
| :-------------------------------: | :----------------------------------------------------------------------------------------: |
|          `AUTH0_DOMAIN`           |     Auth0のテナントのドメイン名 (Auth0 dashboard -> Application -> Settings -> Domain)     |
|         `AUTH0_CLIENT_ID`         |         Auth0 Client ID (Auth0 dashboard -> Application -> Settings -> Client ID)          |
|        `S3_ACCESS_KEY_ID`         |                                 R2 API Token の Access Key                                 |
|      `S3_SECRET_ACCESS_KEY`       |                             R2 API Token の Secret Access Key                              |
|   `S3_ACCOUNT_LOGO_BUCKET_NAME`   |                              作成した R2 パブリックバケット名                              |
|         `S3_API_ENDPOINT`         | `https://<CloudflareアカウントID>.r2.cloudflarestorage.com`。末尾の`/`、バケット名は不要。 |
| `S3_ACCOUNT_LOGO_PUBLIC_ENDPOINT` | R2バケットに接続しているカスタムドメイン (形式: `https://<パブリックバケットのドメイン>`)  |

デプロイは以上で終了です。
