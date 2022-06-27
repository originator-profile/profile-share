# README

## Top-level Schemas

*   [Profile](./profile.md) – `profile`

## Other Schemas

### Objects

*   [Document Profile](./profile-anyof-document-profile.md) – `profile#/anyOf/1`

*   [Document Profile HTML](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-html.md "対象の要素とその子孫を含む部分の HTML とその HTML への署名") – `profile#/anyOf/1/properties/item/items/anyOf/2`

*   [Document Profile Text](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text.md "対象の要素の子孫のテキストとそのテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/1`

*   [Document Profile Visible Text](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text.md "対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/0`

*   [JSON Web Key](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key.md) – `profile#/anyOf/0/properties/jwks/properties/keys/items`

*   [JSON Web Key Sets](./profile-anyof-originator-profile-properties-json-web-key-sets.md) – `profile#/anyOf/0/properties/jwks`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/0/properties/logos/items`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos/items`

*   [Originator Profile](./profile-anyof-originator-profile.md) – `profile#/anyOf/0`

*   [Originator Profile Certifier](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier.md "資格情報を発行する認証機構") – `profile#/anyOf/0/properties/item/items/anyOf/2`

*   [Originator Profile Credential](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential.md "認証機構の報告書などの資格情報") – `profile#/anyOf/0/properties/item/items/anyOf/1`

*   [Originator Profile Holder](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder.md "資格情報を保有する組織") – `profile#/anyOf/0/properties/item/items/anyOf/0`

*   [Proof](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "対象のテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/0/properties/proof`

*   [Proof](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof.md "対象のテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/1/properties/proof`

*   [Proof](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md "対象のテキストへの署名") – `profile#/anyOf/1/properties/item/items/anyOf/2/properties/proof`

*   [Website](./profile-anyof-document-profile-properties-document-profile-item-document-profile-item-anyof-website.md "Website") – `profile#/anyOf/1/properties/item/items/anyOf/3`

### Arrays

*   [Business Category](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category.md) – `profile#/anyOf/0/properties/item/items/anyOf/0/properties/businessCategory`

*   [Business Category](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md) – `profile#/anyOf/0/properties/item/items/anyOf/2/properties/businessCategory`

*   [Document Profile Item](./profile-anyof-document-profile-properties-document-profile-item.md) – `profile#/anyOf/1/properties/item`

*   [JSON Web Key](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key.md) – `profile#/anyOf/0/properties/jwks/properties/keys`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/0/properties/logos`

*   [Logo](./profile-anyof-originator-profile-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md) – `profile#/anyOf/0/properties/item/items/anyOf/2/properties/logos`

*   [Originator Profile Item](./profile-anyof-originator-profile-properties-originator-profile-item.md) – `profile#/anyOf/0/properties/item`

*   [Untitled array in Profile](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-key_ops.md) – `profile#/anyOf/0/properties/jwks/properties/keys/items/properties/key_ops`

*   [Untitled array in Profile](./profile-anyof-originator-profile-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5c.md) – `profile#/anyOf/0/properties/jwks/properties/keys/items/properties/x5c`
