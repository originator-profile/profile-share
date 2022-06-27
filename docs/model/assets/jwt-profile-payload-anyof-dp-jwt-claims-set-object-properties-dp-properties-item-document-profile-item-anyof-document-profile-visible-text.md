# Document Profile Visible Text Schema

```txt
jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0
```

対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## 0 Type

`object` ([Document Profile Visible Text](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text.md))

# 0 Properties

| Property              | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                                                                           |
| :-------------------- | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)         | Not specified | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-type.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/type")         |
| [url](#url)           | `string`      | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/url")           |
| [location](#location) | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/location") |
| [proof](#proof)       | `object`      | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/proof")       |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-type.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/type")

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

*   Type: `string` ([URL](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/url")

### url Type

`string` ([URL](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-url.md))

## location

対象の要素の場所を特定する CSS セレクター

`location`

*   is optional

*   Type: `string` ([Location](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/location")

### location Type

`string` ([Location](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-location.md))

## proof

対象のテキストへの署名

`proof`

*   is required

*   Type: `object` ([Proof](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/proof")

### proof Type

`object` ([Proof](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md))
