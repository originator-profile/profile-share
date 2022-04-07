# Originator Profile Credential Schema

```txt
op-credential#/properties/item/items/anyOf/1
```

認証機構の報告書などの資格情報

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :-------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [op.schema.json\*](op.schema.json "open original schema") |

## 1 Type

`object` ([Originator Profile Credential](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential.md))

# 1 Properties

| Property      | Type          | Required | Nullable       | Defined by                                                                                                                                                                                                |
| :------------ | :------------ | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type) | Not specified | Required | cannot be null | [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential-properties-type.md "op-credential#/properties/item/items/anyOf/1/properties/type") |

## type



`type`

*   is required

*   Type: unknown

*   cannot be null

*   defined in: [Originator Profile](op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential-properties-type.md "op-credential#/properties/item/items/anyOf/1/properties/type")

### type Type

unknown

### type Constraints

**constant**: the value of this property must be equal to:

```json
"credential"
```
