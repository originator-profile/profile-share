# Document Profile Schema

```txt
profile#/anyOf/1
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## 1 Type

`object` ([Document Profile](profile-anyof-document-profile.md))

# 1 Properties

| Property                | Type          | Required | Nullable       | Defined by                                                                                                       |
| :---------------------- | :------------ | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------- |
| [type](#type)           | Not specified | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-type.md "profile#/anyOf/1/properties/type")                  |
| [issuer](#issuer)       | `string`      | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-issuer.md "profile#/anyOf/1/properties/issuer")              |
| [subject](#subject)     | `string`      | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-subject.md "profile#/anyOf/1/properties/subject")            |
| [issuedAt](#issuedat)   | `string`      | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-発行日時.md "profile#/anyOf/1/properties/issuedAt")              |
| [expiredAt](#expiredat) | `string`      | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-有効期限.md "profile#/anyOf/1/properties/expiredAt")             |
| [item](#item)           | `array`       | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-document-profile-item.md "profile#/anyOf/1/properties/item") |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-type.md "profile#/anyOf/1/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"dp"
```

## issuer

組織を表す一義的な識別子

`issuer`

*   is required

*   Type: `string` ([Issuer](profile-anyof-document-profile-properties-issuer.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-issuer.md "profile#/anyOf/1/properties/issuer")

### issuer Type

`string` ([Issuer](profile-anyof-document-profile-properties-issuer.md))

## subject

出版物を表す一義的な識別子

`subject`

*   is required

*   Type: `string` ([Subject](profile-anyof-document-profile-properties-subject.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-subject.md "profile#/anyOf/1/properties/subject")

### subject Type

`string` ([Subject](profile-anyof-document-profile-properties-subject.md))

## issuedAt



`issuedAt`

*   is required

*   Type: `string` ([発行日時](profile-anyof-document-profile-properties-発行日時.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-発行日時.md "profile#/anyOf/1/properties/issuedAt")

### issuedAt Type

`string` ([発行日時](profile-anyof-document-profile-properties-発行日時.md))

### issuedAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## expiredAt



`expiredAt`

*   is required

*   Type: `string` ([有効期限](profile-anyof-document-profile-properties-有効期限.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-有効期限.md "profile#/anyOf/1/properties/expiredAt")

### expiredAt Type

`string` ([有効期限](profile-anyof-document-profile-properties-有効期限.md))

### expiredAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")

## item



`item`

*   is required

*   Type: an array of merged types ([Document Profile Item](profile-anyof-document-profile-properties-document-profile-item-document-profile-item.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-document-profile-item.md "profile#/anyOf/1/properties/item")

### item Type

an array of merged types ([Document Profile Item](profile-anyof-document-profile-properties-document-profile-item-document-profile-item.md))
