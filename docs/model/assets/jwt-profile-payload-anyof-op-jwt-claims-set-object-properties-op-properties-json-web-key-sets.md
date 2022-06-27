# JSON Web Key Sets Schema

```txt
jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## jwks Type

`object` ([JSON Web Key Sets](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets.md))

# jwks Properties

| Property              | Type    | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                |
| :-------------------- | :------ | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [keys](#keys)         | `array` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys") |
| Additional Properties | Any     | Optional | can be null    |                                                                                                                                                                                                                                                                           |

## keys



`keys`

*   is required

*   Type: `object[]` ([JSON Web Key](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys")

### keys Type

`object[]` ([JSON Web Key](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key.md))

## Additional Properties

Additional properties are allowed and do not have to follow a specific schema
