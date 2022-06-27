# Originator Profile Schema

```txt
profile#/anyOf/0
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## 0 Type

`object` ([Originator Profile](profile-anyof-originator-profile.md))

# 0 Properties

| Property                | Type          | Required | Nullable       | Defined by                                                                                                           |
| :---------------------- | :------------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------- |
| [type](#type)           | Not specified | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-type.md "profile#/anyOf/0/properties/type")                    |
| [issuer](#issuer)       | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-issuer.md "profile#/anyOf/0/properties/issuer")                |
| [subject](#subject)     | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-subject.md "profile#/anyOf/0/properties/subject")              |
| [issuedAt](#issuedat)   | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-発行日時.md "profile#/anyOf/0/properties/issuedAt")                |
| [expiredAt](#expiredat) | `string`      | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-有効期限.md "profile#/anyOf/0/properties/expiredAt")               |
| [item](#item)           | `array`       | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item.md "profile#/anyOf/0/properties/item") |
| [jwks](#jwks)           | `object`      | Optional | cannot be null | [Profile](profile-anyof-originator-profile-properties-json-web-key-sets.md "profile#/anyOf/0/properties/jwks")       |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-type.md "profile#/anyOf/0/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"op"
```

## issuer

認証機構または組織を表す一義的な識別子

`issuer`

*   is required

*   Type: `string` ([Issuer](profile-anyof-originator-profile-properties-issuer.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-issuer.md "profile#/anyOf/0/properties/issuer")

### issuer Type

`string` ([Issuer](profile-anyof-originator-profile-properties-issuer.md))

## subject

メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表す一義的な識別子

`subject`

*   is required

*   Type: `string` ([Subject](profile-anyof-originator-profile-properties-subject.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-subject.md "profile#/anyOf/0/properties/subject")

### subject Type

`string` ([Subject](profile-anyof-originator-profile-properties-subject.md))

## issuedAt



`issuedAt`

*   is required

*   Type: `string` ([発行日時](profile-anyof-originator-profile-properties-発行日時.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-発行日時.md "profile#/anyOf/0/properties/issuedAt")

### issuedAt Type

`string` ([発行日時](profile-anyof-originator-profile-properties-発行日時.md))

### issuedAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## expiredAt



`expiredAt`

*   is required

*   Type: `string` ([有効期限](profile-anyof-originator-profile-properties-有効期限.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-有効期限.md "profile#/anyOf/0/properties/expiredAt")

### expiredAt Type

`string` ([有効期限](profile-anyof-originator-profile-properties-有効期限.md))

### expiredAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## item



`item`

*   is required

*   Type: an array of merged types ([Originator Profile Item](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item.md "profile#/anyOf/0/properties/item")

### item Type

an array of merged types ([Originator Profile Item](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item.md))

## jwks



`jwks`

*   is optional

*   Type: `object` ([JSON Web Key Sets](profile-anyof-originator-profile-properties-json-web-key-sets.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-json-web-key-sets.md "profile#/anyOf/0/properties/jwks")

### jwks Type

`object` ([JSON Web Key Sets](profile-anyof-originator-profile-properties-json-web-key-sets.md))
