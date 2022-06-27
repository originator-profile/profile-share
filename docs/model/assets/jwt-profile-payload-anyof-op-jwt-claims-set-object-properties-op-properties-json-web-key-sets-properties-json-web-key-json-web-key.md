# JSON Web Key Schema

```txt
jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## items Type

`object` ([JSON Web Key](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key.md))

# items Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                                                                          |
| :-------------------- | :------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [kty](#kty)           | `string` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-kty.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/kty")          |
| [use](#use)           | `string` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-use.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/use")          |
| [key\_ops](#key_ops)  | `array`  | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-key_ops.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/key_ops")  |
| [alg](#alg)           | `string` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-alg.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/alg")          |
| [kid](#kid)           | `string` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-kid.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/kid")          |
| [x5u](#x5u)           | `string` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5u.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5u")          |
| [x5c](#x5c)           | `array`  | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5c.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5c")          |
| [x5t](#x5t)           | `string` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5t.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5t")          |
| [x5t#S256](#x5ts256)  | `string` | Optional | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5ts256.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5t#S256") |
| Additional Properties | Any      | Optional | can be null    |                                                                                                                                                                                                                                                                                                                                     |

## kty



`kty`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-kty.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/kty")

### kty Type

`string`

## use



`use`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-use.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/use")

### use Type

`string`

## key\_ops



`key_ops`

*   is optional

*   Type: `string[]`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-key_ops.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/key_ops")

### key\_ops Type

`string[]`

## alg



`alg`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-alg.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/alg")

### alg Type

`string`

## kid



`kid`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-kid.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/kid")

### kid Type

`string`

## x5u



`x5u`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5u.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5u")

### x5u Type

`string`

## x5c



`x5c`

*   is optional

*   Type: `string[]`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5c.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5c")

### x5c Type

`string[]`

## x5t



`x5t`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5t.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5t")

### x5t Type

`string`

## x5t#S256



`x5t#S256`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5ts256.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5t#S256")

### x5t#S256 Type

`string`

## Additional Properties

Additional properties are allowed and do not have to follow a specific schema
