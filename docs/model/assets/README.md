# README

## Top-level Schemas

*   [Profile](./profile.md) – `profile`

*   [Profile JWT Claims Set object](./jwt-profile-payload.md) – `jwt-profile-payload`

## Other Schemas

### Objects

*   [DP JWT Claims Set object](./jwt-profile-payload-anyof-dp-jwt-claims-set-object.md) – `jwt-profile-payload#/anyOf/1`

*   [Document Profile](./profile-anyof-document-profile.md) – `profile#/anyOf/1`

*   [Document Profile HTML](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-html.md "対象の要素とその子孫を含む部分の HTML とその HTML への署名") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/2`

*   [Document Profile HTML](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-html.md "対象の要素とその子孫を含む部分の HTML とその HTML への署名") – `profile#/anyOf/1/properties/item/items/anyOf/2`

*   [Document Profile Text](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text.md "対象の要素の子孫のテキストとそのテキストへの署名") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/1`

*   [Document Profile Text](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text.md "対象の要素の子孫のテキストとそのテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/1`

*   [Document Profile Visible Text](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text.md "対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0`

*   [Document Profile Visible Text](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text.md "対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/0`

*   [JSON Web Key](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items`

*   [JSON Web Key](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key.md) – `profile#/anyOf/0/properties/jwks/properties/keys/items`

*   [JSON Web Key Sets](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks`

*   [JSON Web Key Sets](./profile-anyof-originator-profile-properties-json-web-key-sets.md) – `profile#/anyOf/0/properties/jwks`

*   [Logo](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/0/properties/logos/items`

*   [Logo](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/2/properties/logos/items`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/0/properties/logos/items`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items`

*   [OP JWT Claims Set object](./jwt-profile-payload-anyof-op-jwt-claims-set-object.md) – `jwt-profile-payload#/anyOf/0`

*   [Originator Profile](./profile-anyof-originator-profile.md) – `profile#/anyOf/0`

*   [Originator Profile Certifier](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-certifier.md "資格情報を発行する認証機構") – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/2`

*   [Originator Profile Certifier](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier.md "資格情報を発行する認証機構") – `profile#/anyOf/0/properties/item/items/anyOf/2`

*   [Originator Profile Credential](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-credential.md "認証機構の報告書などの資格情報") – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/1`

*   [Originator Profile Credential](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential.md "認証機構の報告書などの資格情報") – `profile#/anyOf/0/properties/item/items/anyOf/1`

*   [Originator Profile Holder](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-holder.md "資格情報を保有する組織") – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/0`

*   [Originator Profile Holder](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder.md "資格情報を保有する組織") – `profile#/anyOf/0/properties/item/items/anyOf/0`

*   [Proof](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "対象のテキストへの署名") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/0/properties/proof`

*   [Proof](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-text-properties-proof.md "対象のテキストへの署名") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/1/properties/proof`

*   [Proof](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-document-profile-html-properties-proof.md "対象のテキストへの署名") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/2/properties/proof`

*   [Proof](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "対象のテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/0/properties/proof`

*   [Proof](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof.md "対象のテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/1/properties/proof`

*   [Proof](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md "対象のテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/2/properties/proof`

*   [Untitled object in Profile JWT Claims Set object](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op`

*   [Untitled object in Profile JWT Claims Set object](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp.md) – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp`

*   [Website](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item-document-profile-item-anyof-website.md "Website") – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item/items/anyOf/3`

*   [Website](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-website.md "Website") – `profile#/anyOf/1/properties/item/items/anyOf/3`

### Arrays

*   [Business Category](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/0/properties/businessCategory`

*   [Business Category](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/2/properties/businessCategory`

*   [Business Category](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category.md) – `profile#/anyOf/0/properties/item/items/anyOf/0/properties/businessCategory`

*   [Business Category](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md) – `profile#/anyOf/0/properties/item/items/anyOf/2/properties/businessCategory`

*   [Document Profile Item](./profile-anyof-document-profile-properties-document-profile-item.md) – `profile#/anyOf/1/properties/item`

*   [JSON Web Key](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys`

*   [JSON Web Key](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key.md) – `profile#/anyOf/0/properties/jwks/properties/keys`

*   [Logo](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-holder-properties-logo.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/0/properties/logos`

*   [Logo](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item/items/anyOf/2/properties/logos`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/0/properties/logos`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos`

*   [Originator Profile Item](./profile-anyof-originator-profile-properties-originator-profile-item.md) – `profile#/anyOf/0/properties/item`

*   [Untitled array in Profile](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-key_ops.md) – `profile#/anyOf/0/properties/jwks/properties/keys/items/properties/key_ops`

*   [Untitled array in Profile](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5c.md) – `profile#/anyOf/0/properties/jwks/properties/keys/items/properties/x5c`

*   [Untitled array in Profile JWT Claims Set object](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-item.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/item`

*   [Untitled array in Profile JWT Claims Set object](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-key_ops.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/key_ops`

*   [Untitled array in Profile JWT Claims Set object](./jwt-profile-payload-anyof-op-jwt-claims-set-object-properties-op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5c.md) – `jwt-profile-payload#/anyOf/0/properties/https://opr.webdino.org/jwt/claims/op/properties/jwks/properties/keys/items/properties/x5c`

*   [Untitled array in Profile JWT Claims Set object](./jwt-profile-payload-anyof-dp-jwt-claims-set-object-properties-dp-properties-item.md) – `jwt-profile-payload#/anyOf/1/properties/https://opr.webdino.org/jwt/claims/dp/properties/item`
