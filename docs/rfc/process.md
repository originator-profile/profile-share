---
sidebar_position: 0
---

# Originator Profile Request for Comment

## 概要

Originator Profile Request for Comment (RFC) の目的は関係者からフィードバックを得て設計変更に関する意見を広く交換することです。
誰でもアクセスして内容を確認し、コメントすることができ、透明性を維持していくことで、コミュニティによる合意と信頼性に基づく標準の提供を目指します。

## プロセス

RFC を追加するには、RFC の草案を GitHub Pull Request によって提出します。

例: docs/rfc/process.md … この文書

GitHub Pull Request は [HackMD](https://hackmd.io/) と同期し、コミュニティでの議論と改稿をおこないます。

GitHub Pull Request が next ブランチにマージされると、その RFC はアクティブであるとみなされます。
RFC がアクティブであるということは、RFC に基づいた実装をコミュニティが受け入れる準備ができていることを意味します。

アクティブとなった RFC の更新については、GitHub Issues での議論と GitHub Pull Request での変更をもって実施します。

アクティブとなった RFC の更新の規模や頻度に当面の間制約はありませんが、技術仕様の外部への公開や、技術仕様を標準化団体に提案する段階で、内容の固定とリビジョンの管理をおこないます。ただし、その場合も既存の技術仕様との関連、セキュリティ制約、実装ノートといった注釈についてはこの限りではありません。

## 付注

この文書は [Rust RFC](https://github.com/rust-lang/rfcs) に触発されて書かれました。

技術仕様の標準化にあたっては、次に挙げる標準化団体のプロセスに従います。ここでは参考情報としてどのような標準化プロセスを経るのかと、取り扱われる文書の形式について記します。

### IETF RFC

IETF だと Internet Draft (I-D) -> Proposed Standard -> Internet Standard　の順番で進む。
Internet Standard になるには複数の相互運用性のある実装が必要。普及している RFC でも Proposed Standard のままのものは多い。

draft-YOURNAME-brief-subject の名前で適切な [Working Group (WG)](https://datatracker.ietf.org/wg/) に草案を提出する。草案が adopt (採用) されたら draft-ietf-WGNAME-brief-subject に名前変更。これ以降は IETF, WG にドキュメントの著作権、変更の権利が移る。

WG Last Call (WGLC) -> [Area Director (AD)](https://www.ietf.org/about/groups/iesg/members/) によるレビュー -> IETF Last Call -> RFC Production Center (RPC) による出版作業

RFC の分類として Standards Track (STD), Informational, Experimental, Best Current Practice (BCP), Historical がある。

I-D 著者向けのページ: https://authors.ietf.org/

### The W3C Recommendation Track

#### Technical Reports の分類

- Recommendations
- Notes
  - 例: https://www.w3.org/TR/vc-imp-guide/
- Registries
  - 例: https://www.w3.org/TR/webcodecs-codec-registry/
  - 2件しかない https://www.w3.org/TR/?filter-tr-name=&status%5B%5D=dry
  - タイトルは Registries だが Note type: https://w3c.github.io/did-spec-registries/

https://www.w3.org/2023/Process-20231103/#recs-and-notes

#### Recommendation Track

https://www.w3.org/2023/Process-20231103/#rec-track

1. Working Draft (WD)
   - First Public Working Draft を公開してプロセス開始
   - これ以降 https://www.w3.org/TR/ で公開される
2. Candidate Recommendation (CR)
   1. Candidate Recommendation Snapshot (CRS)
      - 前回 CRS から [substantive changes](https://www.w3.org/2023/Process-20231103/#correction-classes) があったときに更新
   2. Candidate Recommendation Draft (CRD)
      - 前回の草案から WG 外からのレビューに値する変更があったときに更新
3. Proposed Recommendation (PR)
4. W3C Recommendation (REC)

草案、仕様を捨てたりしたときの状態として Rescinded Candidate Recommendation, Superseded Recommendation, Obsolete Recommendation, Rescinded Recommendation, Discontinued Draft がある。

- WD は Working Group 内の合意が得られてなくても構わない。 WG の requirements を全て満たす必要もない。
- WD -> CR の際には WG の requirements を全て満たす必要がある。
- CR -> PR の際には[実装](https://www.w3.org/2023/Process-20231103/#implementation-experience)が必要。 CR から [substantive changes](https://www.w3.org/2023/Process-20231103/#correction-classes) を入れてはならない。 CR で feature at risk とマークした機能を除くことはできる。
- REC になるためには Advisery Comittee のレビューを受ける必要がある。

あとはどういう変更をしたか記録しておく必要性、[wide review](https://www.w3.org/2023/Process-20231103/#wide-review) を受けること、レビュー期間の最低日数などの要件がある。

各 WG はこれに加えて独自のプロセスを採用すべき (SHOULD) 。
