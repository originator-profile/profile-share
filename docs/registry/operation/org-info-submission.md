---
sidebar_position: 3
---

# 組織情報の提出

組織情報は JSON ファイルに記載します。[account.example.json](https://github.com/originator-profile/profile-share/blob/main/apps/registry/account.example.json) を参考に組織情報を入力してください。

組織情報を入力した JSON ファイルが用意できたら、Originator Profile レジストリ管理者に渡してください。Originator Profile レジストリ管理者が Originator Profile レジストリにアカウントを作成します。

## トヨタ登録時の例

トヨタ自動車株式会社の組織情報を記載する場合、以下のようになります。

`account.example.json`

```json
{
  "domainName": "toyota.demosites.pages.dev",
  "roleValue": "group",
  "name": "トヨタ自動車株式会社",
  "url": "https://global.toyota/",
  "description": "トヨタ自動車株式会社詳細",
  "email": null,
  "phoneNumber": "0565-28-2121",
  "postalCode": "471-8571",
  "addressCountry": "JP",
  "addressRegion": "愛知県",
  "addressLocality": "豊田市",
  "streetAddress": "トヨタ町1番地",
  "contactTitle": "FAQ・お問い合わせ",
  "contactUrl": "https://global.toyota/jp/faq",
  "privacyPolicyTitle": "プライバシー",
  "privacyPolicyUrl": "https://global.toyota/jp/sustainability/privacy",
  "publishingPrincipleTitle": null,
  "publishingPrincipleUrl": null,
  "logos": {
    "create": [
      {
        "url": "https://toyota.demosites.pages.dev/logos/horizontal-toyota.svg",
        "isMain": true
      }
    ]
  }
}
```

「トヨタ」は、トヨタ自動車株式会社の登録商標です。

## JICDAQ 登録時の例

一般社団法人デジタル広告品質認証機構の組織情報を記載する場合、以下のようになります。

```json
{
  "domainName": "jicdaq.or.jp",
  "url": "https://www.jicdaq.or.jp/",
  "roleValue": "certifier",
  "name": "一般社団法人 デジタル広告品質認証機構",
  "description": null,
  "email": null,
  "phoneNumber": null,
  "postalCode": "104-0061",
  "addressCountry": "JP",
  "addressRegion": "東京都",
  "addressLocality": "中央区",
  "streetAddress": "銀座3-10-7 ヒューリック銀座三丁目ビル 8階",
  "contactTitle": "お問い合わせ",
  "contactUrl": "https://www.jicdaq.or.jp/contact.html",
  "privacyPolicyTitle": "プライバシーポリシー",
  "privacyPolicyUrl": "https://www.jicdaq.or.jp/privacypolicy.html",
  "publishingPrincipleTitle": null,
  "publishingPrincipleUrl": null
}
```

「JICDAQ」は、一般社団法人デジタル広告品質認証機構の登録商標です。
