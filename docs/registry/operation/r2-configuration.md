# R2 の設定

各環境に1つのバケットを作成します。このバケットは、 OP登録サイトのアカウントロゴ用のものです。
バケットは public access にし、適切な Custom Domain を設定します。

## バケットの作成

バケットを作成します。Cloudflare のドキュメントの[Get started](https://developers.cloudflare.com/r2/get-started/)や[Create buckets](https://developers.cloudflare.com/r2/buckets/create-buckets/) を参照してください。

バケット名は、`<環境名>-account-logos` にしてください。例えば、 https://oprdev.originator-profile.org/ で利用するバケット名は `oprdev-account-logos` です。

## public access 設定

[Connect a bucket to a custom domain](https://developers.cloudflare.com/r2/buckets/public-buckets/#connect-a-bucket-to-a-custom-domain) を参考にして設定してください。

## API Token の作成

1. R2 のタブをクリック
2. Manage API Tokens -> Create API Token を順にクリック
3. 次のように設定してください。記載していない項目はデフォルトのままで結構です。

|     設定項目      |                                値                                |
| :---------------: | :--------------------------------------------------------------: |
|    Token name     |                       `<環境名> R2 token`                        |
|    Permissions    |                       Object Read & Write                        |
| Specify bucket(s) | "Apply to specific buckets only" -> 前節で作成したバケットを選択 |

4. Create API Token をクリック
5. 表示される認証情報をメモしてください。

## レジストリ環境変数の設定

作成したバケットの設定をレジストリに反映します。

app/registry/.env に次の環境変数を設定してください。

|            環境変数             |                                            説明                                            |
| :-----------------------------: | :----------------------------------------------------------------------------------------: |
|        S3_ACCESS_KEY_ID         |                                 API Token の Access Key ID                                 |
|      S3_SECRET_ACCESS_KEY       |                               API Token の Secret Access Key                               |
|         S3_API_ENDPOINT         | `https://<CloudflareアカウントID>.r2.cloudflarestorage.com`。末尾の`/`、バケット名は不要。 |
|   S3_ACCOUNT_LOGO_BUCKET_NAME   |                                     作成したバケット名                                     |
| S3_ACCOUNT_LOGO_PUBLIC_ENDPOINT |             `https://<設定した custom domain>` Origin形式で指定してください。              |
