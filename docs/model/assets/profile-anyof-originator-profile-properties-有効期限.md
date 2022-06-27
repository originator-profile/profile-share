# 有効期限 Schema

```txt
profile#/anyOf/0/properties/expiredAt
```



| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## expiredAt Type

`string` ([有効期限](profile-anyof-originator-profile-properties-有効期限.md))

## expiredAt Constraints

**date time**: the string must be a date time string, according to [RFC 3339, section 5.6](https://tools.ietf.org/html/rfc3339 "check the specification")
