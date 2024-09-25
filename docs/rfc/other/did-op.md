---
sidebar_position: 3
---

# did:op Method Specification

:::note

この仕様はまだ執筆中です。

:::

did:op は DID subject の情報の見つけやすさとパフォーマンスを設計ゴールとして作られました。
ネットワークアクセスにより DID Document を解決する方法と、 DID の中に含まれている公開鍵を得る2つの方法を提供しています。
DID Document には DID subject の Originator Profile の URL があり、 DID から組織の情報を見つけることができます。

## DID Format

```abnf
did-op-format := "did:op:" <domain> [":" <mb-value>]
domain :=
mb-value       := z[a-km-zA-HJ-NP-Z1-9]+
```

次は非規範的な例です。

```
did:op:example.org:z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu
```

## DID Operations

### Read

1. DID に含まれる公開鍵が DID Document に含まれているかの確認が必要。

## DID Document 例

_このセクションは非規範的です。_

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/multikey/v1"
  ],
  "id": "did:op:example.org",
  "alsoKnownAs": "dns:example.org",
  "verificationMethod": [
    {
      "id": "#{JWK Thumbprint?}",
      "type": "Multikey",
      "publicKeyMultibase": "z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu"
    }
  ],
  "assertionMethod": ["#{JWK Thumbprint?}"],
  "service": [
    {
      "id": "#originator-profile",
      "type": "OriginatorProfile",
      "serviceEndpoint": [
        "https://oprexpt.originator-profile.org/api/ops/example.org"
      ]
    }
  ]
}
```

## Appendix

### レジストリへの登録

仕様の公開と同時に次のサービスタイプを [Decentralized Identifier Extensions 2章 The Registration Process](https://w3c.github.io/did-extensions/#the-registration-process) に従って登録します。

- 登録先: [DID Document Property Extensions セクション 3.2 Service Types](https://w3c.github.io/did-extensions/properties/#service-types)
- タイプ名: `OriginatorProfile`

### Normative References

- [2.2.2 Multikey - Controller Documents 1.0 W3C Editor's Draft](https://w3c.github.io/controller-document/#Multikey)
- [The did:key Method v0.7](https://w3c-ccg.github.io/did-method-key/)
