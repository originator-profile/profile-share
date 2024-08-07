# JSON Web トークン / JSON Web Token (JWT)

[RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html) として標準化されたトークン表現。詳しくは https://jwt.io/ などを参照。

> JSON Web Token (JWT) is a compact, URL-safe means of representing
> claims to be transferred between two parties.

[SOP](./signed-originator-profile.md) や [SDP](./signed-document-profile.md)、[Signed SP](./signed-site-profile.md) は現在この JWT 形式でシリアライズした [Verifiable Credential](./verifiable-credential.md) をベースとしている。
