# Document Profile HTML Schema

```txt
dp-html#/properties/item/items/anyOf/2
```

対象の要素とその子孫を含む部分の HTML とその HTML への署名

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dp.schema.json\*](dp.schema.json "open original schema") |

## 2 Type

`object` ([Document Profile HTML](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html.md))

# 2 Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                                                             |
| :-------------------- | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-type.md "dp-html#/properties/item/items/anyOf/2/properties/type")                  |
| [url](#url)           | `string`      | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-url.md "dp-html-url#/properties/item/items/anyOf/2/properties/url")                |
| [location](#location) | `string`      | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-location.md "dp-html-location#/properties/item/items/anyOf/2/properties/location") |
| [proof](#proof)       | `object`      | Required | cannot be null | [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md "dp-html-proof#/properties/item/items/anyOf/2/properties/proof")          |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-type.md "dp-html#/properties/item/items/anyOf/2/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"html"
```

## url

対象の要素が存在するページの URL

`url`

*   is required

*   Type: `string` ([URL](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-url.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-url.md "dp-html-url#/properties/item/items/anyOf/2/properties/url")

### url Type

`string` ([URL](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-url.md))

## location

対象の要素の場所を特定する CSS セレクター

`location`

*   is required

*   Type: `string` ([Location](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-location.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-location.md "dp-html-location#/properties/item/items/anyOf/2/properties/location")

### location Type

`string` ([Location](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-location.md))

## proof

対象のテキストへの署名

`proof`

*   is required

*   Type: `object` ([Proof](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md "dp-html-proof#/properties/item/items/anyOf/2/properties/proof")

### proof Type

`object` ([Proof](dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md))
