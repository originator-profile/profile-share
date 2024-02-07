# プロファイルペア / Profile Pair (PP)

[DP](./document-profile.md) と出所組織の [OP](./originator-profile.md) を 1:1 で組み合わせたペアのデータ。また、その [SOP](./signed-originator-profile.md)/[SDP](./signed-document-profile.md) のペアを収めた専用形式の JSON ファイル。

DP は必ず出所組織の OP と組み合わせて信頼性を確認するモデルであり、DP 単独ではなく対応する OP とペアで取り扱うことが基本となるため、それら 2 つをまとめて読んだり JSON ファイルとして取り扱ったりする。

Profile Pair は [Profile Set](./profile-set.md) の一種である (Profile Pair を Profile Set に展開することも可能である) が、利用の容易さとデータサイズ削減のため専用形式としている。
