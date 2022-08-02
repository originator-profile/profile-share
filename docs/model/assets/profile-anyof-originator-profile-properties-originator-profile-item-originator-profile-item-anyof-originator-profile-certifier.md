# Originator Profile Certifier Schema

```txt
profile#/anyOf/0/properties/item/items/anyOf/2
```

資格情報を発行する認証機関

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## 2 Type

`object` ([Originator Profile Certifier](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier.md))

# 2 Properties

| Property                                              | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                                               |
| :---------------------------------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)                                         | Not specified | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-type.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/type")                            |
| [url](#url)                                           | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/url")                       |
| [name](#name)                                         | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/name")                             |
| [description](#description)                           | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/description")                       |
| [businessCategory](#businesscategory)                 | `array`       | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/businessCategory")   |
| [email](#email)                                       | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/email")                        |
| [phoneNumber](#phonenumber)                           | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/phoneNumber")                     |
| [postalCode](#postalcode)                             | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/postalCode")                      |
| [addressCountry](#addresscountry)                     | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/addressCountry")                     |
| [addressRegion](#addressregion)                       | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/addressRegion")                   |
| [addressLocality](#addresslocality)                   | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/addressLocality")                 |
| [streetAddress](#streetaddress)                       | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/streetAddress")                  |
| [contactTitle](#contacttitle)                         | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先表示名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/contactTitle")                  |
| [contactUrl](#contacturl)                             | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先url.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/contactUrl")                    |
| [privacyPolicyTitle](#privacypolicytitle)             | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシー表示名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/privacyPolicyTitle")     |
| [privacyPolicyUrl](#privacypolicyurl)                 | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシーurl.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/privacyPolicyUrl")       |
| [publishingPrincipleTitle](#publishingprincipletitle) | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドライン表示名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/publishingPrincipleTitle") |
| [publishingPrincipleUrl](#publishingprincipleurl)     | `string`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドラインurl.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/publishingPrincipleUrl")   |
| [logos](#logos)                                       | `array`       | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos")                           |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-type.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"certifier"
```

## url



`url`

*   is required

*   Type: `string` ([ウェブサイトのURL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/url")

### url Type

`string` ([ウェブサイトのURL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md))

## name



`name`

*   is required

*   Type: `string` ([法人名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/name")

### name Type

`string` ([法人名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md))

## description

ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述

`description`

*   is optional

*   Type: `string` ([説明](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/description")

### description Type

`string` ([説明](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md))

## businessCategory



`businessCategory`

*   is optional

*   Type: `string[]` ([事業種目](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category-事業種目.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/businessCategory")

### businessCategory Type

`string[]` ([事業種目](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category-事業種目.md))

## email



`email`

*   is optional

*   Type: `string` ([メールアドレス](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/email")

### email Type

`string` ([メールアドレス](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md))

## phoneNumber



`phoneNumber`

*   is optional

*   Type: `string` ([電話番号](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/phoneNumber")

### phoneNumber Type

`string` ([電話番号](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md))

## postalCode



`postalCode`

*   is required

*   Type: `string` ([郵便番号](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/postalCode")

### postalCode Type

`string` ([郵便番号](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md))

## addressCountry



`addressCountry`

*   is required

*   Type: `string` ([国](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/addressCountry")

### addressCountry Type

`string` ([国](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md))

## addressRegion



`addressRegion`

*   is required

*   Type: `string` ([都道府県](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/addressRegion")

### addressRegion Type

`string` ([都道府県](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md))

## addressLocality



`addressLocality`

*   is required

*   Type: `string` ([市区町村](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/addressLocality")

### addressLocality Type

`string` ([市区町村](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md))

## streetAddress



`streetAddress`

*   is required

*   Type: `string` ([番地・ビル名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/streetAddress")

### streetAddress Type

`string` ([番地・ビル名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md))

## contactTitle



`contactTitle`

*   is optional

*   Type: `string` ([連絡先表示名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先表示名.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先表示名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/contactTitle")

### contactTitle Type

`string` ([連絡先表示名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先表示名.md))

## contactUrl



`contactUrl`

*   is optional

*   Type: `string` ([連絡先URL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先url.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先url.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/contactUrl")

### contactUrl Type

`string` ([連絡先URL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-連絡先url.md))

## privacyPolicyTitle



`privacyPolicyTitle`

*   is optional

*   Type: `string` ([プライバシーポリシー表示名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシー表示名.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシー表示名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/privacyPolicyTitle")

### privacyPolicyTitle Type

`string` ([プライバシーポリシー表示名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシー表示名.md))

## privacyPolicyUrl



`privacyPolicyUrl`

*   is optional

*   Type: `string` ([プライバシーポリシーURL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシーurl.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシーurl.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/privacyPolicyUrl")

### privacyPolicyUrl Type

`string` ([プライバシーポリシーURL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-プライバシーポリシーurl.md))

## publishingPrincipleTitle



`publishingPrincipleTitle`

*   is optional

*   Type: `string` ([編集ガイドライン表示名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドライン表示名.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドライン表示名.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/publishingPrincipleTitle")

### publishingPrincipleTitle Type

`string` ([編集ガイドライン表示名](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドライン表示名.md))

## publishingPrincipleUrl



`publishingPrincipleUrl`

*   is optional

*   Type: `string` ([編集ガイドラインURL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドラインurl.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドラインurl.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/publishingPrincipleUrl")

### publishingPrincipleUrl Type

`string` ([編集ガイドラインURL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-編集ガイドラインurl.md))

## logos



`logos`

*   is optional

*   Type: `object[]` ([Logo](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos")

### logos Type

`object[]` ([Logo](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md))
