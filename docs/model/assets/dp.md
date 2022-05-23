# Document Profile Schema

```txt
dp
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                              |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dp.schema.json](dp.schema.json "open original schema") |

## Document Profile Type

`object` ([Document Profile](dp.md))

# Document Profile Properties

| Property                | Type     | Required | Nullable       | Defined by                                                                       |
| :---------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------- |
| [issuer](#issuer)       | `string` | Required | cannot be null | [Document Profile](dp-properties-issuer.md "dp#/properties/issuer")              |
| [subject](#subject)     | `string` | Required | cannot be null | [Document Profile](dp-properties-subject.md "dp#/properties/subject")            |
| [issuedAt](#issuedat)   | `string` | Required | cannot be null | [Document Profile](dp-properties-発行日時.md "dp#/properties/issuedAt")              |
| [expiredAt](#expiredat) | `string` | Required | cannot be null | [Document Profile](dp-properties-有効期限.md "dp#/properties/expiredAt")             |
| [item](#item)           | `array`  | Required | cannot be null | [Document Profile](dp-properties-document-profile-item.md "dp#/properties/item") |

## issuer

組織を表す一義的な識別子

`issuer`

*   is required

*   Type: `string` ([Issuer](dp-properties-issuer.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-issuer.md "dp#/properties/issuer")

### issuer Type

`string` ([Issuer](dp-properties-issuer.md))

## subject

出版物を表す一義的な識別子

`subject`

*   is required

*   Type: `string` ([Subject](dp-properties-subject.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-subject.md "dp#/properties/subject")

### subject Type

`string` ([Subject](dp-properties-subject.md))

## issuedAt



`issuedAt`

*   is required

*   Type: `string` ([発行日時](dp-properties-発行日時.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-発行日時.md "dp#/properties/issuedAt")

### issuedAt Type

`string` ([発行日時](dp-properties-発行日時.md))

### issuedAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## expiredAt



`expiredAt`

*   is required

*   Type: `string` ([有効期限](dp-properties-有効期限.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-有効期限.md "dp#/properties/expiredAt")

### expiredAt Type

`string` ([有効期限](dp-properties-有効期限.md))

### expiredAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## item



`item`

*   is required

*   Type: an array of merged types ([Document Profile Item](dp-properties-document-profile-item-document-profile-item.md))

*   cannot be null

*   defined in: [Document Profile](dp-properties-document-profile-item.md "dp#/properties/item")

### item Type

an array of merged types ([Document Profile Item](dp-properties-document-profile-item-document-profile-item.md))
