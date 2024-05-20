# 広告プロファイルペア / Ad Profile Pair (Ad PP)

[Profile Pair](./profile-pair.md) の一種。 [OP](./originator-profile.md) と、その組織が発行した [AP](./advertisement-profile.md) を 1:1 で組み合わせたペアのデータ。

広告を表示する iframe の中に link 要素や script 要素として Ad Profile Pair を配置することを想定している。ユーザーがページを閲覧するまで表示される広告が分からない広告の動的性質を考慮して、ページ全体の [Profile Set](./profile-set.md) とは別のデータ構造として定義し、個々の広告に信頼性情報を付与できるようにしている。
