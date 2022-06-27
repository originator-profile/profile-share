# Proof Schema

```txt
jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/1/properties/proof
```

対象のテキストへの署名

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                  |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [jwt-profile-payload.schema.json\*](jwt-profile-payload.schema.json "open original schema") |

## proof Type

`object` ([Proof](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text-properties-proof.md))

# proof Properties

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                                                                                                                   |
| :---------- | :------- | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [jws](#jws) | `string` | Required | cannot be null | [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/1/properties/proof/properties/jws") |

## jws



`jws`

*   is required

*   Type: `string` ([Detached JSON Web Signature](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md))

*   cannot be null

*   defined in: [Profile JWT Claims Set object](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md "jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/1/properties/proof/properties/jws")

### jws Type

`string` ([Detached JSON Web Signature](jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md))
