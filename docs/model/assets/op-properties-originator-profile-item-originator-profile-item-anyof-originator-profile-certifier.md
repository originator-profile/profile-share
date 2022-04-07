# Originator Profile Certifier Schema

```txt
op-certifier#/properties/item/items/anyOf/2
```

資格情報を発行する認証機構

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [op.schema.json\*](op.schema.json "open original schema") |

## 2 Type

`object` ([Originator Profile Certifier](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier.md))

# 2 Properties

| Property                              | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                            |
| :------------------------------------ | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type)                         | Not specified | Required | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-type.md "op-certifier#/properties/item/items/anyOf/2/properties/type")                               |
| [url](#url)                           | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md "op-certifier#/properties/item/items/anyOf/2/properties/url")                          |
| [name](#name)                         | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md "op-certifier#/properties/item/items/anyOf/2/properties/name")                                |
| [description](#description)           | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md "op-certifier#/properties/item/items/anyOf/2/properties/description")                          |
| [businessCategory](#businesscategory) | `array`       | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md "business-category#/properties/item/items/anyOf/2/properties/businessCategory") |
| [email](#email)                       | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md "op-certifier#/properties/item/items/anyOf/2/properties/email")                           |
| [phoneNumber](#phonenumber)           | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md "op-certifier#/properties/item/items/anyOf/2/properties/phoneNumber")                        |
| [postalCode](#postalcode)             | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md "op-certifier#/properties/item/items/anyOf/2/properties/postalCode")                         |
| [addressCountry](#addresscountry)     | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md "op-certifier#/properties/item/items/anyOf/2/properties/addressCountry")                        |
| [addressRegion](#addressregion)       | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md "op-certifier#/properties/item/items/anyOf/2/properties/addressRegion")                      |
| [addressLocality](#addresslocality)   | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md "op-certifier#/properties/item/items/anyOf/2/properties/addressLocality")                    |
| [addressStreet](#addressstreet)       | `string`      | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md "op-certifier#/properties/item/items/anyOf/2/properties/addressStreet")                     |
| [logo](#logo)                         | `array`       | Optional | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md "logo#/properties/item/items/anyOf/2/properties/logo")                                       |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-type.md "op-certifier#/properties/item/items/anyOf/2/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"certifier"
```

## url



`url`

*   is optional

*   Type: `string` ([ウェブサイトのURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md "op-certifier#/properties/item/items/anyOf/2/properties/url")

### url Type

`string` ([ウェブサイトのURL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-ウェブサイトのurl.md))

## name



`name`

*   is optional

*   Type: `string` ([法人名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md "op-certifier#/properties/item/items/anyOf/2/properties/name")

### name Type

`string` ([法人名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-法人名.md))

## description

ウェブメディアそれを運用する法人、認定機関、業界団体等であることの記述

`description`

*   is optional

*   Type: `string` ([説明](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md "op-certifier#/properties/item/items/anyOf/2/properties/description")

### description Type

`string` ([説明](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-説明.md))

## businessCategory



`businessCategory`

*   is optional

*   Type: `string[]` ([事業種目](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category-事業種目.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md "business-category#/properties/item/items/anyOf/2/properties/businessCategory")

### businessCategory Type

`string[]` ([事業種目](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category-事業種目.md))

## email



`email`

*   is optional

*   Type: `string` ([メールアドレス](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md "op-certifier#/properties/item/items/anyOf/2/properties/email")

### email Type

`string` ([メールアドレス](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-メールアドレス.md))

## phoneNumber



`phoneNumber`

*   is optional

*   Type: `string` ([電話番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md "op-certifier#/properties/item/items/anyOf/2/properties/phoneNumber")

### phoneNumber Type

`string` ([電話番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-電話番号.md))

## postalCode



`postalCode`

*   is optional

*   Type: `string` ([郵便番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md "op-certifier#/properties/item/items/anyOf/2/properties/postalCode")

### postalCode Type

`string` ([郵便番号](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-郵便番号.md))

## addressCountry



`addressCountry`

*   is optional

*   Type: `string` ([国](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md "op-certifier#/properties/item/items/anyOf/2/properties/addressCountry")

### addressCountry Type

`string` ([国](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-国.md))

## addressRegion



`addressRegion`

*   is optional

*   Type: `string` ([都道府県](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md "op-certifier#/properties/item/items/anyOf/2/properties/addressRegion")

### addressRegion Type

`string` ([都道府県](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-都道府県.md))

## addressLocality



`addressLocality`

*   is optional

*   Type: `string` ([市区町村](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md "op-certifier#/properties/item/items/anyOf/2/properties/addressLocality")

### addressLocality Type

`string` ([市区町村](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-市区町村.md))

## addressStreet



`addressStreet`

*   is optional

*   Type: `string` ([番地・ビル名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md "op-certifier#/properties/item/items/anyOf/2/properties/addressStreet")

### addressStreet Type

`string` ([番地・ビル名](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-番地ビル名.md))

## logo



`logo`

*   is optional

*   Type: `object[]` ([Logo](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md "logo#/properties/item/items/anyOf/2/properties/logo")

### logo Type

`object[]` ([Logo](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md))
