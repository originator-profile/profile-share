# Originator Profile Schema

```txt
op
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                              |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [op.schema.json](op.schema.json "open original schema") |

## Originator Profile Type

`object` ([Originator Profile](op.md))

# Originator Profile Properties

| Property                | Type     | Required | Nullable       | Defined by                                                                           |
| :---------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------- |
| [issuer](#issuer)       | `string` | Required | cannot be null | [Originator Profile](op-properties-issuer.md "op#/properties/issuer")                |
| [subject](#subject)     | `string` | Required | cannot be null | [Originator Profile](op-properties-subject.md "op#/properties/subject")              |
| [issuedAt](#issuedat)   | `string` | Required | cannot be null | [Originator Profile](op-properties-発行日時.md "op#/properties/issuedAt")                |
| [expiredAt](#expiredat) | `string` | Required | cannot be null | [Originator Profile](op-properties-有効期限.md "op#/properties/expiredAt")               |
| [item](#item)           | `array`  | Required | cannot be null | [Originator Profile](op-properties-originator-profile-item.md "op#/properties/item") |
| [jwks](#jwks)           | `array`  | Optional | cannot be null | [Originator Profile](op-properties-json-web-key.md "op#/properties/jwks")            |

## issuer

認証機構または組織を表す一義的な識別子

`issuer`

*   is required

*   Type: `string` ([Issuer](op-properties-issuer.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-issuer.md "op#/properties/issuer")

### issuer Type

`string` ([Issuer](op-properties-issuer.md))

## subject

メディア・広告などに関わる組織の身元またはその組織の主要な出版物を表す一義的な識別子

`subject`

*   is required

*   Type: `string` ([Subject](op-properties-subject.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-subject.md "op#/properties/subject")

### subject Type

`string` ([Subject](op-properties-subject.md))

## issuedAt



`issuedAt`

*   is required

*   Type: `string` ([発行日時](op-properties-発行日時.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-発行日時.md "op#/properties/issuedAt")

### issuedAt Type

`string` ([発行日時](op-properties-発行日時.md))

### issuedAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## expiredAt



`expiredAt`

*   is required

*   Type: `string` ([有効期限](op-properties-有効期限.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-有効期限.md "op#/properties/expiredAt")

### expiredAt Type

`string` ([有効期限](op-properties-有効期限.md))

### expiredAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## item



`item`

*   is required

*   Type: an array of merged types ([Originator Profile Item](op-properties-originator-profile-item-originator-profile-item.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item.md "op#/properties/item")

### item Type

an array of merged types ([Originator Profile Item](op-properties-originator-profile-item-originator-profile-item.md))

## jwks



`jwks`

*   is optional

*   Type: `object[]` ([JSON Web Key](op-properties-json-web-key-json-web-key.md))

*   cannot be null

*   defined in: [Originator Profile](op-properties-json-web-key.md "op#/properties/jwks")

### jwks Type

`object[]` ([JSON Web Key](op-properties-json-web-key-json-web-key.md))
