---
sidebar_position: 31
---

# 用語集

Originator Profile 技術研究組合またはその配下の技術開発 WG において OP 技術開発に際して独自に定義している用語について説明します (随時追記します)。

## Advertisement Profile (AP)

広告の基本情報を記載したプロファイル。DP の一種。

一般的な Web コンテンツとは、表示するページ URL などが固定されておらず動的に指し込まれるという流通特性や、信頼性として重要視されるポイントの違いなどを考慮して専用のプロファイル形式を定義している。

## Document Profile (DP)

サイトやコンテンツの基本情報を記載したプロファイル。

DP は対象となるものの種類に応じて最適なスキーマを定義しており、一般的な Web コンテンツを対象とする (狭義の) Document Profile の他にウェブサイトを対象とする Website Profile や広告を対象とする Advertisement (Ad) Profile などがあるがそれを総称したものを (広義の) DP と呼ぶ。これらの関係性などが分かり易い用語に将来変更する可能性あり。

サイト運営者やコンテンツ作者が対象となるサイトやコンテンツの情報を記載して自己署名する。DP に署名をしたデータやファイルは SDP と呼ぶ。

## Document Profile Registry (DPR)

次のような役割を持つレジストリまたはそのサーバ。

- コンテンツの基本情報の登録を受け付ける
- コンテンツの基本情報に対して作成者自身の署名鍵で署名した SDP を発行する
- コンテンツの作成者となる組織の SOP を登録して保持する
- 同一ページ (URL) 内のコンテンツに対する全ての SOP, SDP をまとめた Profile Set を生成する

本来 DPR はコンテンツ作者(またはその委任を受けたもの)が自身で運用する CMS 内の一機能として実装・統合されることを想定しているが、実装/運用都合により外部提供の DPR と CMS を連携する形で利用することもある。


## Document Profile Store (DPS)

DPR の果たす役割の一部またはその役割だけを実装し独立運用するサーバ。

コンテンツ作者の署名鍵の保有・管理と SDP の発行処理を行わず、CMS 側で作成した SDP の登録・保管と問い合わせに対して Profile Set を返すことを主な役割として実装したもの。CMS 側の変更・実装を最小限に抑えつつ、署名鍵はコンテンツ作者側での管理を行う形で運用可能とするための典型的な役割分離の実装パターン。

## JSON Web Token (JWT)

[RFC7519](https://datatracker.ietf.org/doc/html/rfc7519) として標準化されたトークン表現。詳しくは https://jwt.io/ などを参照。

> JSON Web Token (JWT) is a compact, URL-safe means of representing
   claims to be transferred between two parties.

SOP や SDP は現在この JWT 形式でシリアライズした Verifiable Credential をベースとしている。

## Originator Profile (OP)

組織の基本情報と資格情報を記載したプロファイル。

サイト運営者やコンテンツ作者となる組織が登録したい組織情報、認証情報を OPR に提出し、確認済みのデータとして ORP による署名を受ける。OP に署名をしたデータやファイルは SOP と呼ぶ。

## Originator Profile Registry (OPR)

次のような役割を持つレジストリまたはそのサーバ。

- OP 利用組織に対して OP ID を発行する
- OP 利用組織から提出された組織の基本情報や資格情報を確認した上で登録を受け付ける
- 組織の基本情報や資格情報に対して OPR の署名鍵で署名した SOP を発行する
- 組織の基本情報や資格情報の変更・更新時には再度 SOP を発行する

## Profile Pair (PP)

DP と出所組織の OP を 1:1 で組み合わせたペアのデータ。また、その SOP/SDP のペアを収めた専用形式の JSON ファイル。

DP は必ず出所組織の OP と組み合わせて信頼性を確認するモデルであり、DP 単独ではなく対応する OP とペアで取り扱うことが基本となるため、それら 2 つをまとめて読んだり JSON ファイルとして取り扱ったりする。

Profile Pair は Profile Set の一種である (Profile Pair を Profile Set に展開することも可能である) が、利用の容易さとデータサイズ削減のため専用形式としている。 

## Profile Set (PS)

1 つ以上の OP と DP を含めた集合のデータ。また、その SOP/SDP の集合を収めた専用形式の JSON ファイル。

Web ページなどの単位でその中に含まれるコンテンツに対応する OP と DP の集合をまとめた JSON ファイルを作成、リンクしそれをブラウザなどが読み込んで利用する。

## Signed Document Profile (SDP)

サイトやコンテンツを表明し検証可能にするためのデータ表現であり、サイトやコンテンツの情報に対して運営者や作成者自身が  JSON Web Token (JWT) として署名する。

運営者や作成者の SOP と併せて、SDP の対象サイトやコンテンツと一緒に配信する。

## Signed Originator Profile (SOP)

組織の身元を表明し検証可能にするためのデータ表現であり、確認済みの組織の基本情報と資格情報に対して OPR が JSON Web Token (JWT) として署名する。

サイトやコンテンツの SDP と併せて、SDP の対象サイトやコンテンツと一緒に配信する以外に、SOP の対象組織のサイトの well-known に配置するなどして組織の信頼性情報の提示に利用する。

## Verifiable Credential (VC)

[Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model-2.0/) などとして W3C などで標準化されている credential (資格情報、OP における「組織の資格情報」とは異なる一般用語としての資格情報) のデータモデル。

> a mechanism to express these sorts of credentials on the Web in a way that is cryptographically secure, privacy respecting, and machine-verifiable.

SOP や SDP は VC に準拠する形で設計しているが、シリアライゼーションにはマイナーだがコンパクトになるものを利用していたり、長期的には COSE の採用や SD-JWT の採用なども検討している。VC に関連する仕様が複数並列している中で長期的にどのデータモデル、シリアライゼーション、Proof などを採用するかについては未確定。

## Website Profile (WP)

ウェブサイトの基本情報を記載したプロファイル。DP の一種。

記事などの Web コンテンツとは異なり特定のページではなくドメイン (オリジン) 全体で提供するサイトやサービスを対象としており、サイトの運営者情報とコンテンツの提供者情報の関係性を持たせることや利用者が知りたい信頼性情報に違いがあることを考慮して専用のプロファイル形式を定義している。

また、WP については Profile Pair 形式で well-known パスに設置することとしており、検索エンジン、広告配信システム、ソーシャルネットワークサービス、生成 AI などのクローラがサイトと運営者の検証可能な情報を容易に自動取得可能とする。
