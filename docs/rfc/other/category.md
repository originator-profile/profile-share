# Certificate Category Note

_この文書は非規範的です。_

## 概要

本文書は、Originator Profile 技術研究組合の開発するアプリケーションにおいて Certificate RFC に定める Certificate の category クレームに使用する分類の値、それに基づく表示順序をどのように定義するのかを検討するための参考情報です。

:::note

Originator Profile 技術研究組合が開発するアプリケーションの運用関係者での検討が進み、カテゴリーと表示順序の決定により本文書は更新される予定です。

:::

## 表示順序決定プロセス

1. 認証機関に応じて Certificate を分類します。
2. 各分類の中で表示順序を決めます。決め方は OP との関連性や認証制度の透明性・信頼性に基づいて決めます。決定プロセスは透明性を保ちます。

## Certificate の分類と各分類の認証の具体例

上のカテゴリーから順に表示順序を先にする。

### 日本の行政組織が発行したもの

[建制順](https://ja.wikipedia.org/wiki/%E5%BB%BA%E5%88%B6%E9%A0%86)に従う。内閣府、デジタル庁は[行政機構図（２０２３.７現在）](https://www.cas.go.jp/jp/gaiyou/jimu/jinjikyoku/satei_01_05.html)より先頭にする。

1. 内閣府
2. デジタル庁
3. 総務省
4. 法務省
5. 外務省
6. 財務省
7. 文部科学省
8. 厚生労働省
9. 農林水産省
10. 経済産業省
11. 国土交通省
12. 環境省
13. 防衛省
14. 公安調査庁
15. 国税庁
16. 特許庁
17. 気象庁
18. 海上保安庁

- 銀行業の免許
- 生命保険会社登録
- [AEO(Authorized Economic Operator)制度](https://www.customs.go.jp/zeikan/seido/kaizen.htm)
- 電気通信事業者: https://www.soumu.go.jp/johotsusintokei/field/tsuushin04_01.html
- 無線局免許状: https://www.tele.soumu.go.jp/j/musen/index.htm
- など

### 規格に基づく認証

1. ISO または ISO と互換性のある JIS 規格
2. JIS
3. IEC, ITU

#### 例

- ISO 認証

  - ISO27001（情報セキュリティマネジメントシステム）
  - ISO9001（品質マネジメントシステム）
  - ISO14001（環境マネジメントシステム）
  - ISO45001（労働安全衛生マネジメントシステム）
  - ISO50001（エネルギーマネジメントシステム）
  - など

- プライバシーマーク (JIS Q 15001)
  - [一般財団法人日本情報経済社会推進協会(JIPDEC)](https://www.jipdec.or.jp/) が審査機関を認定。審査機関が審査。
  - 日本産業規格 (JIS) の「JIS Q 15001 個人情報保護マネジメントシステム 要求事項」に準拠した「プライバシーマークにおける個人情報保護マネジメントシステム構築・運用指針」に基づいて評価
  - 日本産業標準調査会（経済産業省管轄）
- など

### 国際団体による認証

1. 国連の機関による認証
2. その他の国際団体による認証

#### 例

- HACCP（Hazard Analysis Critical Control Point：危害要因分析重要管理点）認証
  - [コーデックス委員会](https://www.fao.org/fao-who-codexalimentarius/about-codex/codex60/en/)策定、自治体、業界団体、民間が認証
- 公正労働協会(FLA)認定
  - 国連機関の ILO が標準化 https://www.ilo.org/international-labour-standards
- など

### 業界団体による認証

1. [JICDAQ](https://www.jicdaq.or.jp/)
2. [Trustworthy Accountability Group (TAG)](https://www.tagtoday.net/certifications)
3. [European Interactive Digital Advertising Alliance (EDAA)](https://edaa.eu/certification-providers/): EDAA Trust Seal
4. など

### 公益財団法人

- [グリーン経営認証制度：公益財団法人交通エコロジー・モビリティ財団](https://www.green-m.jp/)
- など

### 業界団体への参加

日本企業が加盟する団体のほうが信頼できると感じやすいと思う。日本の業界団体 -> 国際的な業界団体の順にする。

- [日本新聞協会](https://www.pressnet.or.jp/)
- [日本雑誌協会](https://www.j-magazine.or.jp/)
- [日本書籍出版協会](https://www.jbpa.or.jp/index.html)
- [デジタル出版社連盟](https://dpfj.or.jp/)
- [日本ABC協会](https://jabc.or.jp/)
- [日本インタラクティブ広告協会（JIAA）](https://www.jiaa.org/)
- など

### 民間企業の認証

- TRUSTe（民間企業の TrustArc が策定）
- [PCI DSS (Payment Card Industry Data Security Standard)](https://www.pcisecuritystandards.org/lang/ja-ja/)
- など

## 既存の実装で扱いのある資格情報 {#now}

本文書に定める分類と表示順序に従った順序は以下の徹りです。

1. JICDAQ ブランドセーフティ第三者検証
2. JICDAQ 無効トラフィック第三者検証
3. JICDAQ ブランドセーフティ海外認証
4. JICDAQ 無効トラフィック海外認証
5. JICDAQ ブランドセーフティ自己宣言
6. JICDAQ 無効トラフィック自己宣言
7. JICDAQ 登録アドバタイザー
8. 日本新聞社協会
