# Auth0 設定

## デフォルトロールの設定

新規作成されたユーザーに自動的に `group` ロールを付与するように auth0 を設定する必要があります。
これは Actions 機能を使って実現しています。

ここでは1つのテナントに対してデフォルトロールを付与する Action を付与する手順を説明します。次のQ&Aポストを参考にしています: [How can I use the Management API in Actions?](https://community.auth0.com/t/how-can-i-use-the-management-api-in-actions/64947)

### ロールの ID の確認

Auth0 の管理画面で作業します。

1. 左のメニューで User Management -> Roles を選択
1. group ロールをクリック
1. 画面上部に "Role ID `rol_...` とあるので `rol_...` の値をメモしておく。これがこのロールの ID です。

メモしたロールIDは作成する Action のスクリプトで使用します。

### Management API の認証情報の作成

まず Action から Auth0 の Management API を呼び出すための準備をします。

#### 手順

Auth0 の管理画面で作業します。

1. 左のメニューで Applications -> Applications を選択
1. "+ Create Application" -> Machine to Machine Applications -> Create を順にクリック
1. Auth0 Management API を選択
1. Permissions として、`update:user` と `read:stats` を選択
1. Authorize をクリック

これによって Machine to Machine Applications の作成が完了しました。

作成した Application の Settings のタブにある次の3つの項目が、Action 作成時に必要になります。

- Domain
- Client ID
- Client Secret

### Action の作成

Auth0 の管理画面で作業します。

1. 左のメニューで Actions -> Flows を選択
1. Login を選択
1. 画面右側にある Add Action -> "+" マーク -> Build Custom を順にクリック
1. Name に "add default role to user" を、 Trigger はそのまま、 Runtime もそのままで Create をクリック

コードエディタの画面に遷移するので、この画面で次の設定をしてください。

1. post login action のスクリプトをペーストしてください。スクリプトは git で管理されています： https://github.com/originator-profile/profile/blob/gh-801-logo-api/packages/auth0/actions/add-default-role-to-new-user.js

2. スクリプト内の次の行を、初めにメモした role ID で書き換えてください。

```node
const role = "rol_qIO1J5yAQS6dtvfS"; // 'group' role
```

3. エディタの欄の左端の鍵マークで次のように設定してください

|      Key      |                            Value                            |
| :-----------: | :---------------------------------------------------------: |
|    DOMAIN     |    上で作成した Management API の認証情報の Domain の値     |
|   CLIENT_ID   |   上で作成した Management API の認証情報の Client Id の値   |
| CLIENT_SECRET | 上で作成した Management API の認証情報の Client Secret の値 |

4. 鍵マークの下の箱のマークをクリックして dependencies を設定してください

| Name  | Version |
| :---: | :-----: |
| auth0 | latest  |

5. （任意）鍵マークの上の再生ボタンをクリックして作成したスクリプトをテストしてください。ロールの付与が正しくできているかまでは、このテストだと分かりにくいですが、実行してみてエラーが出ないことの確認は可能かと思います。

6. 右上の Deploy をクリックしてください。

7. 右上に "(アクション名) was successfully deployed. Add to flow" という通知が出るので、 Add to flow をクリック

8. 右にある、たった今作成した Action をドラッグして、中央の画面上の Start User Logged in と Complete Token Issued の間に挿入してください。

以上で完了となります。

### デフォルトロール機能のテスト

User Management -> User から、 "+ Create User" で新しいユーザーを作成します。この時点では、ユーザーには何もロールが付与されていません（管理画面上で確認できます）。

そのユーザーでOP登録サイトへのログインを実行します。

ログイン時に Auth0 からの HTTP レスポンスに入っているアクセストークンを jwt.io などでデコードします。

中身の `permissions` に `write:requests` が入っていることを確認してください。

さらに、ログインしたユーザーを Auth0 管理画面で見ると、デフォルトロールとして設定したロールが付与されていることを確認してください。
