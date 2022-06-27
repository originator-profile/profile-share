# Proof Schema

```txt
profile#/anyOf/1/properties/item/items/anyOf/1/properties/proof
```

対象のテキストへの署名

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                          |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [profile.schema.json\*](profile.schema.json "open original schema") |

## proof Type

`object` ([Proof](profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof.md))

# proof Properties

| Property    | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                                               |
| :---------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [jws](#jws) | `string` | Required | cannot be null | [Profile](profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md "profile#/anyOf/1/properties/item/items/anyOf/1/properties/proof/properties/jws") |

## jws



`jws`

*   is required

*   Type: `string` ([Detached JSON Web Signature](profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md))

*   cannot be null

*   defined in: [Profile](profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md "profile#/anyOf/1/properties/item/items/anyOf/1/properties/proof/properties/jws")

### jws Type

`string` ([Detached JSON Web Signature](profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof-properties-detached-json-web-signature.md))
