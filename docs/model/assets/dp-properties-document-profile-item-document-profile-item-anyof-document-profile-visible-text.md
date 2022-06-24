# Document Profile Visible Text Schema

```txt
dp#/properties/item/items/anyOf/0
```

対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dp.schema.json\*](dp.schema.json "open original schema") |

## 0 Type

`object` ([Document Profile Visible Text](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text.md))

# 0 Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                                                       |
| :-------------------- | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-type.md "dp#/properties/item/items/anyOf/0/properties/type")         |
| [url](#url)           | `string`      | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md "dp#/properties/item/items/anyOf/0/properties/url")           |
| [location](#location) | `string`      | Optional | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md "dp#/properties/item/items/anyOf/0/properties/location") |
| [proof](#proof)       | `object`      | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "dp#/properties/item/items/anyOf/0/properties/proof")       |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-type.md "dp#/properties/item/items/anyOf/0/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"visibleText"
```

## url

対象の要素が存在するページの URL

`url`

*   is required

*   Type: `string` ([URL](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md "dp#/properties/item/items/anyOf/0/properties/url")

### url Type

`string` ([URL](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md))

## location

対象の要素の場所を特定する CSS セレクター

`location`

*   is optional

*   Type: `string` ([Location](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md "dp#/properties/item/items/anyOf/0/properties/location")

### location Type

`string` ([Location](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md))

## proof

対象のテキストへの署名

`proof`

*   is required

*   Type: `object` ([Proof](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "dp#/properties/item/items/anyOf/0/properties/proof")

### proof Type

`object` ([Proof](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md))
