# 検証可能な資格情報 / Verifiable Credential (VC)

[Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model-2.0/) などとして W3C などで標準化されている credential (資格情報、OP における「組織の資格情報」とは異なる一般用語としての資格情報) のデータモデル。

> a mechanism to express these sorts of credentials on the Web in a way that is cryptographically secure, privacy respecting, and machine-verifiable.

[SOP](./signed-originator-profile.md) や [SDP](./signed-document-profile.md) は VC に準拠する形で設計しているが、シリアライゼーションにはマイナーだがコンパクトになるものを利用していたり、長期的には COSE の採用や SD-JWT の採用なども検討している。VC に関連する仕様が複数並列している中で長期的にどのデータモデル、シリアライゼーション、Proof などを採用するかについては未確定。
