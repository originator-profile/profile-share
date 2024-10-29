---
sidebar_position: 40
---

# 暗号アルゴリズム

:::note

暗号アルゴリズムのサポートについて何を参考にしてどのような基準で仕様として決めていくかは議論中です。

参考: [危殆化に備えた鍵・アルゴリズムの指定・推奨の検討 · Issue #1502 · originator-profile/profile](https://github.com/originator-profile/profile/issues/1502)

:::

## 署名アルゴリズム

署名を検証するときに使用する署名アルゴリズムは必ず次の要件を満たす必要があります (MUST)。

許可リスト (検証側) は次のとおりです。

- `ES256` (RECOMMENDED)
- `ES384`
- `ES512`
- `PS256`
- `PS384`
- `PS512`

これらの許可リストに含まれるいずれかの署名アルゴリズムをサポートする必要があります (MUST)。

検証者は、この許可リストに含まれない署名アルゴリズムでの検証を拒否しなければなりません (MUST)。

パフォーマンスとセキュリティのバランスを考慮し `ES256` を推奨しますが、他の署名アルゴリズムの使用を禁止するものではありません。

実装者はアルゴリズムを定期的に見直し、危殆化したアルゴリズムの使用を中止してください (RECOMMENDED)。

:::note

C2PA 2.0 署名アルゴリズムの許可リストに含まれる `EdDSA` は[^1]、本文書が書かれた時点ではサポートしない実装が一定数存在するため[^2]、`EdDSA` は許可リストに含めていません。

[^1]: https://c2pa.org/specifications/specifications/2.0/specs/C2PA_Specification.html#_signature_algorithms

[^2]: https://github.com/WICG/webcrypto-secure-curves/issues/20

:::

:::note

Originator Profile 技術研究組合の開発するアプリケーションでは、当面の間、署名アルゴリズムは ES256 のみをサポートします。

:::

## ハッシュアルゴリズム {#hash-algorithm}

OP の仕様に準拠するアプリケーションは、 CA の Target Integrity の `integrity` プロパティの値を生成・検証するとき、および各 VC の `digestSRI` プロパティの値を生成・検証するときに、使用するハッシュアルゴリズムについて次の要件を満たす必要があります (MUST)。

検証者は、 SHA-256 ハッシュ値による検証をサポートしなければなりません (MUST)。また、SHA-384、SHA-512 ハッシュ値による検証をサポートしてもよいです (MAY)。

実装者はハッシュアルゴリズムを定期的に見直し、危殆化したハッシュアルゴリズムは使用しないようにしてください。

:::note

Originator Profile 技術研究組合の開発するアプリケーションでは、当面の間、ハッシュアルゴリズムは SHA-256 のみをサポートします。

:::
