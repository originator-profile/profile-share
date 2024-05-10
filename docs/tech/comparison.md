---
sidebar_position: 10
---

# 既存技術との比較

## Trusted Web との関係

[Trusted Web](https://trustedweb.go.jp/) では Verifiable ID に紐付く Verifiable Data を相互に検証しつつ送り合う Verifiable Message としてやり取りし、事後検証 (Trace) 可能な Verifiable Transaction として記録する Verifiable Messaging を推進しています。

OP では、 OP ID に紐付く署名付きデータ SOP, SDP, SAP などをサーバから Profile Set として送りブラウザで検証しますが、コンテンツ作成・送信履歴などを記録・検証可能化する Verifiable Transaction 機能は要求していません。広告取引においても、 OP ID に紐付く RTB 取引内のデータ(の一部)に署名付与し Bid Request/Response を相互検証するか、性能要件上 RTB 処理中の検証などが難しい部分は事後検証可能な Verifiable Transaction 機能を果たすログにより検証可能化する検討をしています。

## C2PA, CAI, Project Origin との関係

[Coalition for Content Provenance and Authenticity (C2PA)](https://c2pa.org/), [Content Authenticity Initiative (CAI)](https://contentauthenticity.org/), [Project Origin](https://www.originproject.info/) はどれも画像や動画などのメディアファイルに詳細な来歴情報を署名付きで記載可能にするプロジェクトですが、来歴情報に含まれる各組織や個人の ID の信頼性を判断するための仕組みがまだないため、ドメイン保有者の信頼性判断ができないのとほぼ同じ問題がそのまま残る可能性があります。

また、OP とは実装スコープの重なりが少なく、相補的な技術として組み合わせられる可能性があります。例えば、 C2PA ID と OP ID の参照関係を作れば、C2PA ID の信頼性を OP レジストリで確認可能になったり、OP でのメディアファイル署名技術の選択肢として C2PA が採用可能になるなど、 OP, C2PA 双方のメリットを享受できます。

## JTI Standards (CWA 17493) との関係

[Journalism Trust Initiative](https://www.journalismtrustinitiative.org/) の [JTI Standards CWA 17493](https://www.jti-app.com/footer/cwa) は、メディアの透明性を高めるための組織情報として何を公開すべきかを定めた標準に従いメディアの情報を登記する仕組みを作るものです。OP のように組織情報を Web コンテンツに対して紐付けしたり改竄不能な署名を施す技術ではありません。一方で、OP で確認する組織情報より広い情報を含めるものでメディア組織の透明性を高める効果があるため、OP レジストリ登録時の確認作業を JTI で実施済みとして簡略化や委任したり、資格情報の一つとして JTI Apps 登録を扱うなどの協力関係が想定できます。

<!-- ### Open Badges との関係 -->

## VC との関係

Verifiable Credentials (VC), Verifiable Presentations (VP) 関連の一連の仕様は、 Credential を暗号論的安全でプライバシーを保ち機械的検証可能な形で表現し、送信・受信したり、選択的開示 (Selective Disclosure) を実現するための標準です。

OP では SOP, SDP のデータフォーマットとして Verifiable Credentials (VCs) を採用しています。一方で Verifiable Presentation は利用していません。 OP では、 SOP, SDP を受け渡す際には、 OP の用途に最適な Profile Set, Profile Pair など独自のフォーマットを定義しています。また、 OP の機能のうち Web コンテンツへの紐付けや ID (OP ID) の信頼性を判断する仕組みなどは、 VC/VP のスコープ外です。

## DID との関係

OP は Decentralized Identifiers (DIDs) を採用していません。

## AMP, SXG, Web Packaging との関係

[AMP](https://amp.dev/) は主にモバイル端末での Web ページの読み込みの高速化を目指したフレームワークです。高速化の手段の一つとして、 [Signed HTTP Exchange (SXG)](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html), [Web Packaging](https://github.com/WICG/webpackage/) を利用し、あるドメインから配信していた HTML等のアセットをまとめて TLS 証明書に対応するプライベート鍵で署名し、別のドメインから配信します。

OP は SDP, SOP などのデジタル署名付きのデータを Web コンテンツに紐づけることで、 Web コンテンツの出所や流通についての透明性を向上させます。それによりコンテンツを様々なサイトから再配信することが容易なインターネット環境を生み出す可能性があります。

どちらもデジタル署名を使っている点で類似性があると言えますが、 AMP の目的は Web ページの高速化であり、 OP の目的はインターネットの信頼性・透明性・真正性の向上です。また、 SXG は署名において TLS でのドメインの証明書のプライベート鍵を利用しているため、ドメイン単位でしか署名ができません。そのため証明書や TLS の[課題](./about.mdx)が残ります。 OP はドメインとコンテンツの関係性を考慮した設計になっており、ドメイン単位よりも細かい粒度で署名を付与することができます。

なお、 AMP を利用した Web ページは開発企業の Google の検索エンジンで特別な扱いを受けていましたが、 2021年以降は普通の Web ページと変わらない扱いに[なりました](https://developers.google.com/search/blog/2021/04/more-details-page-experience)。

(お問い合わせに応じて随時追記します)
