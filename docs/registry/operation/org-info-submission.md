---
sidebar_position: 3
---

# 組織情報の提出

組織情報は JSON ファイルに記載します。[account.example.json](https://github.com/originator-profile/profile-share/blob/main/apps/registry/account.example.json) を参考に組織情報を入力してください。

組織情報を入力した JSON ファイルが用意できたら、Originator Profile レジストリ管理者に渡してください。Originator Profile レジストリ管理者が Originator Profile レジストリにアカウントを作成します。

## 形式

```json
{
  "domainName": "<OP ID>",
  "roleValue": "<種別 - group: 組織、certifier: 認証機関>",
  "name": "<法人名*>",
  "url": "<ウェブサイトのURL>",
  "corporateNumber": "<法人番号>",
  "description": "<説明 (ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述)>",
  "email": "<メールアドレス>",
  "phoneNumber": "<電話番号>",
  "postalCode": "<郵便番号*>",
  "addressCountry": "<国*>",
  "addressRegion": "<都道府県*>",
  "addressLocality": "<市区町村*>",
  "streetAddress": "<番地・ビル名*>",
  "contactTitle": "<連絡先表示名>",
  "contactUrl": "<連絡先URL>",
  "privacyPolicyTitle": "<プライバシーポリシー表示名>",
  "privacyPolicyUrl": "<プライバシーポリシーURL>",
  "publishingPrincipleTitle": "<編集ガイドライン表示名>",
  "publishingPrincipleUrl": "<編集ガイドラインURL>",
  "logos": {
    "create": [
      {
        "url": "<ロゴURL>",
        "isMain": true
      }
    ]
  }
}
```

\* 必須項目

## 「Originator Profile 技術研究組合」の例

```json
{
  "domainName": "originator-profile.org",
  "roleValue": "certifier",
  "name": "Originator Profile 技術研究組合",
  "url": "https://originator-profile.org/",
  "corporateNumber": "8010005035933",
  "postalCode": "100-8055",
  "addressCountry": "JP",
  "addressRegion": "東京都",
  "addressLocality": "千代田区",
  "streetAddress": "大手町1-7-1",
  "contactTitle": "お問い合わせ",
  "contactUrl": "https://originator-profile.org/ja-JP/inquiry/",
  "privacyPolicyTitle": "プライバシーポリシー",
  "privacyPolicyUrl": "https://originator-profile.org/ja-JP/privacy/",
  "logos": {
    "create": [
      {
        "url": "https://originator-profile.org/image/icon.svg",
        "isMain": true
      }
    ]
  }
}
```
