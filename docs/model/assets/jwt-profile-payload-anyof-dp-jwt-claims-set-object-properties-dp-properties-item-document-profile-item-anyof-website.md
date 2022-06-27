# Website Schema

```txt
jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3
```

Website

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## 3 Type

`object` ([Website](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website.md))

# 3 Properties

| Property                                               | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                                                                        |
| :----------------------------------------------------- | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)                                          | Not specified | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-type.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/type")                            |
| [url](#url)                                            | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-url.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/url")                              |
| [title](#title)                                        | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-title.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/title")                          |
| [image](#image)                                        | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-image-url.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/image")                      |
| [description](#description)                            | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-description.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/description")              |
| [https://schema.org/author](#httpsschemaorgauthor)     | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-author.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/https://schema.org/author")     |
| [https://schema.org/category](#httpsschemaorgcategory) | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-category.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/https://schema.org/category") |
| [https://schema.org/editor](#httpsschemaorgeditor)     | `string`      | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-editor.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/https://schema.org/editor")     |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-type.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"website"
```

## url



`url`

*   is optional

*   Type: `string` ([URL](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-url.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-url.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/url")

### url Type

`string` ([URL](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-url.md))

## title



`title`

*   is optional

*   Type: `string` ([Title](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-title.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-title.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/title")

### title Type

`string` ([Title](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-title.md))

## image



`image`

*   is optional

*   Type: `string` ([Image URL](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-image-url.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-image-url.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/image")

### image Type

`string` ([Image URL](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-image-url.md))

## description



`description`

*   is optional

*   Type: `string` ([Description](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-description.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-description.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/description")

### description Type

`string` ([Description](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-description.md))

## https\://schema.org/author



`https://schema.org/author`

*   is optional

*   Type: `string` ([Author](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-author.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-author.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/https://schema.org/author")

### author Type

`string` ([Author](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-author.md))

## https\://schema.org/category



`https://schema.org/category`

*   is optional

*   Type: `string` ([Category](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-category.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-category.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/https://schema.org/category")

### category Type

`string` ([Category](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-category.md))

## https\://schema.org/editor



`https://schema.org/editor`

*   is optional

*   Type: `string` ([Editor](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-editor.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-editor.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3/properties/https://schema.org/editor")

### editor Type

`string` ([Editor](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website-properties-editor.md))
