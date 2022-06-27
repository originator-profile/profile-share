# JSON Web Key Sets Schema

```txt
profile#/anyOf/0/properties/jwks
```



| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## jwks Type

`object` ([JSON Web Key Sets](profile-anyof-originator-profile-properties-json-web-key-sets.md))

# jwks Properties

| Property              | Type    | Required | Nullable       | Defined by                                                                                                                                             |
| :-------------------- | :------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [keys](#keys)         | `array` | Required | cannot be null | [Profile](profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key.md "profile#/anyOf/0/properties/jwks/properties/keys") |
| Additional Properties | Any     | Optional | can be null    |                                                                                                                                                        |

## keys



`keys`

*   is required

*   Type: `object[]` ([JSON Web Key](profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key.md "profile#/anyOf/0/properties/jwks/properties/keys")

### keys Type

`object[]` ([JSON Web Key](profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key.md))

## Additional Properties

Additional properties are allowed and do not have to follow a specific schema
