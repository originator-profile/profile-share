# Originator Profile Holder Schema

```txt
op-holder#/properties/item/items/anyOf/0
```

資格情報を保有する組織

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [op.schema.json\*](op.schema.json "open original schema") |

## 0 Type

`object` ([Originator Profile Holder](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder.md))

# 0 Properties

| Property                                              | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                                   |
| :---------------------------------------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)                                         | Not specified | Required | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-type.md "op-holder#/properties/item/items/anyOf/0/properties/type")                                            |
| [url](#url)                                           | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-ウェブサイトのurl.md "op-holder#/properties/item/items/anyOf/0/properties/url")                                       |
| [name](#name)                                         | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-法人名.md "op-holder#/properties/item/items/anyOf/0/properties/name")                                             |
| [description](#description)                           | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-説明.md "op-holder#/properties/item/items/anyOf/0/properties/description")                                       |
| [businessCategory](#businesscategory)                 | `array`       | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category.md "op-holder-business-category#/properties/item/items/anyOf/0/properties/businessCategory") |
| [email](#email)                                       | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-メールアドレス.md "op-holder#/properties/item/items/anyOf/0/properties/email")                                        |
| [phoneNumber](#phonenumber)                           | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-電話番号.md "op-holder#/properties/item/items/anyOf/0/properties/phoneNumber")                                     |
| [postalCode](#postalcode)                             | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-郵便番号.md "op-holder#/properties/item/items/anyOf/0/properties/postalCode")                                      |
| [addressCountry](#addresscountry)                     | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-国.md "op-holder#/properties/item/items/anyOf/0/properties/addressCountry")                                     |
| [addressRegion](#addressregion)                       | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-都道府県.md "op-holder#/properties/item/items/anyOf/0/properties/addressRegion")                                   |
| [addressLocality](#addresslocality)                   | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-市区町村.md "op-holder#/properties/item/items/anyOf/0/properties/addressLocality")                                 |
| [streetAddress](#streetaddress)                       | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-番地ビル名.md "op-holder#/properties/item/items/anyOf/0/properties/streetAddress")                                  |
| [contactTitle](#contacttitle)                         | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先表示名.md "op-holder#/properties/item/items/anyOf/0/properties/contactTitle")                                  |
| [contactUrl](#contacturl)                             | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先url.md "op-holder#/properties/item/items/anyOf/0/properties/contactUrl")                                    |
| [privacyPolicyTitle](#privacypolicytitle)             | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシー表示名.md "op-holder#/properties/item/items/anyOf/0/properties/privacyPolicyTitle")                     |
| [privacyPolicyUrl](#privacypolicyurl)                 | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシーurl.md "op-holder#/properties/item/items/anyOf/0/properties/privacyPolicyUrl")                       |
| [publishingPrincipleTitle](#publishingprincipletitle) | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドライン表示名.md "op-holder#/properties/item/items/anyOf/0/properties/publishingPrincipleTitle")                 |
| [publishingPrincipleUrl](#publishingprincipleurl)     | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドラインurl.md "op-holder#/properties/item/items/anyOf/0/properties/publishingPrincipleUrl")                   |
| [logo](#logo)                                         | `array`       | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo.md "op-holder-logo#/properties/item/items/anyOf/0/properties/logo")                                       |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-type.md "op-holder#/properties/item/items/anyOf/0/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"holder"
```

## url



`url`

*   is optional

*   Type: `string` ([ウェブサイトのURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-ウェブサイトのurl.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-ウェブサイトのurl.md "op-holder#/properties/item/items/anyOf/0/properties/url")

### url Type

`string` ([ウェブサイトのURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-ウェブサイトのurl.md))

## name



`name`

*   is optional

*   Type: `string` ([法人名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-法人名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-法人名.md "op-holder#/properties/item/items/anyOf/0/properties/name")

### name Type

`string` ([法人名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-法人名.md))

## description

ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述

`description`

*   is optional

*   Type: `string` ([説明](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-説明.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-説明.md "op-holder#/properties/item/items/anyOf/0/properties/description")

### description Type

`string` ([説明](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-説明.md))

## businessCategory



`businessCategory`

*   is optional

*   Type: `string[]` ([事業種目](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category-事業種目.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category.md "op-holder-business-category#/properties/item/items/anyOf/0/properties/businessCategory")

### businessCategory Type

`string[]` ([事業種目](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category-事業種目.md))

## email



`email`

*   is optional

*   Type: `string` ([メールアドレス](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-メールアドレス.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-メールアドレス.md "op-holder#/properties/item/items/anyOf/0/properties/email")

### email Type

`string` ([メールアドレス](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-メールアドレス.md))

## phoneNumber



`phoneNumber`

*   is optional

*   Type: `string` ([電話番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-電話番号.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-電話番号.md "op-holder#/properties/item/items/anyOf/0/properties/phoneNumber")

### phoneNumber Type

`string` ([電話番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-電話番号.md))

## postalCode



`postalCode`

*   is optional

*   Type: `string` ([郵便番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-郵便番号.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-郵便番号.md "op-holder#/properties/item/items/anyOf/0/properties/postalCode")

### postalCode Type

`string` ([郵便番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-郵便番号.md))

## addressCountry



`addressCountry`

*   is optional

*   Type: `string` ([国](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-国.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-国.md "op-holder#/properties/item/items/anyOf/0/properties/addressCountry")

### addressCountry Type

`string` ([国](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-国.md))

## addressRegion



`addressRegion`

*   is optional

*   Type: `string` ([都道府県](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-都道府県.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-都道府県.md "op-holder#/properties/item/items/anyOf/0/properties/addressRegion")

### addressRegion Type

`string` ([都道府県](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-都道府県.md))

## addressLocality



`addressLocality`

*   is optional

*   Type: `string` ([市区町村](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-市区町村.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-市区町村.md "op-holder#/properties/item/items/anyOf/0/properties/addressLocality")

### addressLocality Type

`string` ([市区町村](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-市区町村.md))

## streetAddress



`streetAddress`

*   is optional

*   Type: `string` ([番地・ビル名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-番地ビル名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-番地ビル名.md "op-holder#/properties/item/items/anyOf/0/properties/streetAddress")

### streetAddress Type

`string` ([番地・ビル名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-番地ビル名.md))

## contactTitle



`contactTitle`

*   is optional

*   Type: `string` ([連絡先表示名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先表示名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先表示名.md "op-holder#/properties/item/items/anyOf/0/properties/contactTitle")

### contactTitle Type

`string` ([連絡先表示名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先表示名.md))

## contactUrl



`contactUrl`

*   is optional

*   Type: `string` ([連絡先URL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先url.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先url.md "op-holder#/properties/item/items/anyOf/0/properties/contactUrl")

### contactUrl Type

`string` ([連絡先URL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-連絡先url.md))

## privacyPolicyTitle



`privacyPolicyTitle`

*   is optional

*   Type: `string` ([プライバシーポリシー表示名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシー表示名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシー表示名.md "op-holder#/properties/item/items/anyOf/0/properties/privacyPolicyTitle")

### privacyPolicyTitle Type

`string` ([プライバシーポリシー表示名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシー表示名.md))

## privacyPolicyUrl



`privacyPolicyUrl`

*   is optional

*   Type: `string` ([プライバシーポリシーURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシーurl.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシーurl.md "op-holder#/properties/item/items/anyOf/0/properties/privacyPolicyUrl")

### privacyPolicyUrl Type

`string` ([プライバシーポリシーURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-プライバシーポリシーurl.md))

## publishingPrincipleTitle



`publishingPrincipleTitle`

*   is optional

*   Type: `string` ([編集ガイドライン表示名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドライン表示名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドライン表示名.md "op-holder#/properties/item/items/anyOf/0/properties/publishingPrincipleTitle")

### publishingPrincipleTitle Type

`string` ([編集ガイドライン表示名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドライン表示名.md))

## publishingPrincipleUrl



`publishingPrincipleUrl`

*   is optional

*   Type: `string` ([編集ガイドラインURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドラインurl.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドラインurl.md "op-holder#/properties/item/items/anyOf/0/properties/publishingPrincipleUrl")

### publishingPrincipleUrl Type

`string` ([編集ガイドラインURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-編集ガイドラインurl.md))

## logo



`logo`

*   is optional

*   Type: `object[]` ([Logo](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo.md "op-holder-logo#/properties/item/items/anyOf/0/properties/logo")

### logo Type

`object[]` ([Logo](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md))
