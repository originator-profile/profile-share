# Originator Profile Credential Schema

```txt
profile#/anyOf/0/properties/item/items/anyOf/1
```

認証機構の報告書などの資格情報

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## 1 Type

`object` ([Originator Profile Credential](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential.md))

# 1 Properties

| Property      | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                                     |
| :------------ | :------------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type) | Not specified | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential-properties-type.md "profile#/anyOf/0/properties/item/items/anyOf/1/properties/type") |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential-properties-type.md "profile#/anyOf/0/properties/item/items/anyOf/1/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"credential"
```
