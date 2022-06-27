# OP JWT Claims Set object Schema

```txt
jwt-profile-payload#/anyOf/0
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## 0 Type

`object` ([OP JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object.md))

# 0 Properties

| Property                                                                | Type     | Required | Nullable       | Defined by                                                                                                                                                                           |
| :---------------------------------------------------------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [iss](#iss)                                                             | `string` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issuer.md "jwt-profile-payload#/anyOf/0/properties/iss")                           |
| [sub](#sub)                                                             | `string` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-subject.md "jwt-profile-payload#/anyOf/0/properties/sub")                          |
| [exp](#exp)                                                             | `number` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-expiration-time.md "jwt-profile-payload#/anyOf/0/properties/exp")                  |
| [iat](#iat)                                                             | `number` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issued-at.md "jwt-profile-payload#/anyOf/0/properties/iat")                        |
| [https://opr.webdino.org/jwt/claims/op](#httpsoprwebdinoorgjwtclaimsop) | `object` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op") |

## iss

[RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)

`iss`

*   is required

*   Type: `string` ([JWT Issuer](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issuer.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issuer.md "jwt-profile-payload#/anyOf/0/properties/iss")

### iss Type

`string` ([JWT Issuer](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issuer.md))

## sub

[RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)

`sub`

*   is required

*   Type: `string` ([JWT Subject](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-subject.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-subject.md "jwt-profile-payload#/anyOf/0/properties/sub")

### sub Type

`string` ([JWT Subject](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-subject.md))

## exp

[RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)

`exp`

*   is required

*   Type: `number` ([JWT Expiration Time](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-expiration-time.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-expiration-time.md "jwt-profile-payload#/anyOf/0/properties/exp")

### exp Type

`number` ([JWT Expiration Time](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-expiration-time.md))

## iat

[RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)

`iat`

*   is required

*   Type: `number` ([JWT Issued At](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issued-at.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issued-at.md "jwt-profile-payload#/anyOf/0/properties/iat")

### iat Type

`number` ([JWT Issued At](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-jwt-issued-at.md))

## https\://opr.webdino.org/jwt/claims/op



`https://opr.webdino.org/jwt/claims/op`

*   is required

*   Type: `object` ([Details](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op.md "jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op")

### op Type

`object` ([Details](jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op.md))
