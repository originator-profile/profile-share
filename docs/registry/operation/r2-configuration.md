# R2 の設定

各環境に1つのバケットを作成します。このバケットは、 OP登録サイトのアカウントロゴ用のものです。
バケットは public access にし、適切な Custom Domain を設定します。

## バケットの作成

バケットを作成します。Cloudflare のドキュメントの[Get started](https://developers.cloudflare.com/r2/get-started/)や[Create buckets](https://developers.cloudflare.com/r2/buckets/create-buckets/) を参照してください。

バケット名は、`<環境名>-account-logos` にしてください。例えば、 https://oprdev.originator-profile.org/ で利用するバケット名は `oprdev-account-logos` です。

## public access 設定

[Connect a bucket to a custom domain](https://developers.cloudflare.com/r2/buckets/public-buckets/#connect-a-bucket-to-a-custom-domain) を参考にして設定してください。
