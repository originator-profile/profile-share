---
sidebar_position: 2
---

# did:2 Method Specification

:::note

この仕様はまだ執筆中です。

:::

did:2 は 1つの DID の中に DID を2つ埋め込むための DID Method です。
組み合わせる DID Method の選択や、2個目の DID の役割を指定することによりユースケースに合ったメリットを得ることができます。

## DID Format

```abnf
did-op-format := "did:2:" <did-method-1> <did-method-1-specific-id> <cache-strategy> <did-method-2> <did-method-2-specific-id>
```

次は非規範的な例です。

```
did:2:web:example.org:stale-while-revalidate:key:z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu
```

この場合 cache-strategy が `stale-while-revalidate` なため、 DID resolution は次のように動作します。

- 1つめの DID `did:web:example.org` の DID Document がキャッシュに存在しないまたは古い場合、 `did:key:z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu` の DID Document を返します。その間に `did:web:example.org` のキャッシュを revalidate します。
- `did:web:example.org` の DID Document がキャッシュが存在し、失効していない場合その DID Document を返します。

次は同じ2つの DID を使って cache-strategy を `stale-if-error` にした例です。

```
did:2:web:example.org:stale-if-error:key:z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu
```

この場合 DID resolution は次のように動作します。

- `did:web:example.org` のキャッシュが stale でかつ、 DID resolution が 500, 502, 503, 504 エラーになった場合、`did:key:z6MkmM42vxfqZQsv4ehtTjFFxQ4sQKS2w6WR7emozFAn5cxu` の DID Document を返します。

## DID Operations

### Read

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
