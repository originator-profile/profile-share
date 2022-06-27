# Untitled object in Profile JWT Claims Set object Schema

```txt
jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## op Type

`object` ([Details](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op.md))

# op Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                        |
| :------------ | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [item](#item) | `array`  | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item")              |
| [jwks](#jwks) | `object` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks") |

## item



`item`

*   is required

*   Type: an array of merged types ([Originator Profile Item](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item")

### item Type

an array of merged types ([Originator Profile Item](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item.md))

## jwks



`jwks`

*   is optional

*   Type: `object` ([JSON Web Key Sets](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks")

### jwks Type

`object` ([JSON Web Key Sets](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets.md))
