# Logo Schema

```txt
op-holder-logo#/properties/item/items/anyOf/0/properties/logos/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [op.schema.json\*](op.schema.json "open original schema") |

## items Type

`object` ([Logo](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md))

# items Properties

| Property          | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                                                |
| :---------------- | :-------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [url](#url)       | `string`  | Required | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-ロゴ画像-url.md "op-holder-logo#/properties/item/items/anyOf/0/properties/logos/items/properties/url")     |
| [isMain](#ismain) | `boolean` | Required | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-主なロゴ画像か否か.md "op-holder-logo#/properties/item/items/anyOf/0/properties/logos/items/properties/isMain") |

## url



`url`

*   is required

*   Type: `string` ([ロゴ画像 URL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-ロゴ画像-url.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-ロゴ画像-url.md "op-holder-logo#/properties/item/items/anyOf/0/properties/logos/items/properties/url")

### url Type

`string` ([ロゴ画像 URL](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-ロゴ画像-url.md))

## isMain

true: 主なロゴ画像、それ以外: ロゴ画像の候補

`isMain`

*   is required

*   Type: `boolean` ([主なロゴ画像か否か](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-主なロゴ画像か否か.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-主なロゴ画像か否か.md "op-holder-logo#/properties/item/items/anyOf/0/properties/logos/items/properties/isMain")

### isMain Type

`boolean` ([主なロゴ画像か否か](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo-properties-主なロゴ画像か否か.md))
