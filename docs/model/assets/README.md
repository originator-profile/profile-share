# README

## Top-level Schemas

*   [Document Profile](./dp.md) – `dp`

*   [Originator Profile](./op.md) – `op`

## Other Schemas

### Objects

*   [Document Profile HTML](./dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html.md "対象の要素とその子孫を含む部分の HTML とその HTML への署名") – `dp#/properties/item/items/anyOf/2`

*   [Document Profile Text](./dp-properties-document-profile-item-document-profile-item-anyof-document-profile-text.md "対象の要素の子孫のテキストとそのテキストへの署名") – `dp#/properties/item/items/anyOf/1`

*   [Document Profile Visible Text](./dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text.md "対象の要素のその子孫のレンダリングされたテキストとそのテキストへの署名") – `dp#/properties/item/items/anyOf/0`

*   [JSON Web Key](./op-properties-json-web-key-sets-properties-json-web-key-json-web-key.md) – `op#/properties/jwks/properties/keys/items`

*   [JSON Web Key Sets](./op-properties-json-web-key-sets.md) – `op#/properties/jwks`

*   [Logo](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo-logo.md) – `op#/properties/item/items/anyOf/0/properties/logos/items`

*   [Logo](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo-logo.md) – `op#/properties/item/items/anyOf/2/properties/logos/items`

*   [Originator Profile Certifier](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier.md "資格情報を発行する認証機構") – `op#/properties/item/items/anyOf/2`

*   [Originator Profile Credential](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-credential.md "認証機構の報告書などの資格情報") – `op#/properties/item/items/anyOf/1`

*   [Originator Profile Holder](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder.md "資格情報を保有する組織") – `op#/properties/item/items/anyOf/0`

*   [Proof](./dp-properties-document-profile-item-document-profile-item-anyof-document-profile-visible-text-properties-proof.md "対象のテキストへの署名") – `dp#/properties/item/items/anyOf/0/properties/proof`

*   [Proof](./dp-properties-document-profile-item-document-profile-item-anyof-document-profile-text-properties-proof.md "対象のテキストへの署名") – `dp#/properties/item/items/anyOf/1/properties/proof`

*   [Proof](./dp-properties-document-profile-item-document-profile-item-anyof-document-profile-html-properties-proof.md "対象のテキストへの署名") – `dp#/properties/item/items/anyOf/2/properties/proof`

*   [Website](./dp-properties-document-profile-item-document-profile-item-anyof-website.md "Website") – `dp#/properties/item/items/anyOf/3`

### Arrays

*   [Business Category](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-business-category.md) – `op#/properties/item/items/anyOf/0/properties/businessCategory`

*   [Business Category](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-business-category.md) – `op#/properties/item/items/anyOf/2/properties/businessCategory`

*   [Document Profile Item](./dp-properties-document-profile-item.md) – `dp#/properties/item`

*   [JSON Web Key](./op-properties-json-web-key-sets-properties-json-web-key.md) – `op#/properties/jwks/properties/keys`

*   [Logo](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-holder-properties-logo.md) – `op#/properties/item/items/anyOf/0/properties/logos`

*   [Logo](./op-properties-originator-profile-item-originator-profile-item-anyof-originator-profile-certifier-properties-logo.md) – `op#/properties/item/items/anyOf/2/properties/logos`

*   [Originator Profile Item](./op-properties-originator-profile-item.md) – `op#/properties/item`

*   [Untitled array in Originator Profile](./op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-key_ops.md) – `op#/properties/jwks/properties/keys/items/properties/key_ops`

*   [Untitled array in Originator Profile](./op-properties-json-web-key-sets-properties-json-web-key-json-web-key-properties-x5c.md) – `op#/properties/jwks/properties/keys/items/properties/x5c`
