# Logo Schema

```txt
profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## items Type

`object` ([Logo](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md))

# items Properties

| Property          | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                       |
| :---------------- | :-------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [url](#url)       | `string`  | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-ロゴ画像-url.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items/properties/url")     |
| [isMain](#ismain) | `boolean` | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-主なロゴ画像か否か.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items/properties/isMain") |

## url



`url`

*   is required

*   Type: `string` ([ロゴ画像 URL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-ロゴ画像-url.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-ロゴ画像-url.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items/properties/url")

### url Type

`string` ([ロゴ画像 URL](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-ロゴ画像-url.md))

## isMain

true: 主なロゴ画像、それ以外: ロゴ画像の候補

`isMain`

*   is required

*   Type: `boolean` ([主なロゴ画像か否か](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-主なロゴ画像か否か.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-主なロゴ画像か否か.md "profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items/properties/isMain")

### isMain Type

`boolean` ([主なロゴ画像か否か](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo-properties-主なロゴ画像か否か.md))
