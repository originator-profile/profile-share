# ドキュメントプロファイルレジストリ / Document Profile Registry (DPR)

次のような役割を持つ組織またはシステム。

- コンテンツの基本情報の登録を受け付ける
- コンテンツの基本情報に対して作成者自身の署名鍵で署名した [SDP](./signed-document-profile.md) を発行する
- コンテンツの作成者となる組織の [SOP](./signed-originator-profile.md) を登録して保持する
- 同一ページ (URL) 内のコンテンツに対する全ての SOP, SDP をまとめた [Profile Set](./profile-pair.md) を生成する
- [ドキュメントプロファイルストア / Document Profile Store (DPS)](./document-profile-store.md)

本来 DPR はコンテンツ作者(またはその委任を受けたもの)が自身で運用する CMS 内の一機能として実装・統合されることを想定しているが、実装/運用都合により外部提供の DPR と CMS を連携する形で利用することもある。
