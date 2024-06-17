---
sidebar_position: 15
---

# 記事管理に関するケース毎の対応方法

このページでは、記事を公開する際のさまざまなケース毎に、どのように SDP を管理すればよいか、どのような SDP を発行すればよいかを説明しています。

## 記事を更新した場合 {#on-update}

SDP 発行済み記事を更新した際に、更新後の記事内容と、 SDP に記載した情報との間に齟齬がある場合には、 SDP を更新、あるいは再発行する必要があります。
記事更新の例としては、記事タイトルの更新、記事執筆者の変更、[署名対象として選択した文章](howto.md#select-visibletext)の変更などがあります。

この場合、登録のケースと同じように、 [SDP 登録用エンドポイント](./howto.md#sdp-register-endpoint)を使用してください。
このエンドポイントは、登録する SDP と ID の等しい SDP がすでに DP レジストリに存在する場合には、既存の SDP を上書き更新します。

SDP 更新後は [Profile Set 取得エンドポイント](./howto.md#website-profiles-endpoint)からは新しい SDP を含む Profile Set が返ってきます。

## 記事を削除・非公開にした場合 {#on-delete}

SDP 発行済みの記事を削除したり、非公開にした場合、再度同じ url で公開する予定がない場合、 SDP を削除してください。
これには、 SDP 削除用のAPIエンドポイントを使用します。

次のコマンドを実行することで、 SDP を削除することができます。

```shell
curl -X DELETE https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/website \
    -u 8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8 \
    -H 'Content-Type: application/json' \
    -d '{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e"}}'
```

上記の例は、 curl コマンドで DP レジストリ (`dprexpt.originator-profile.org`) の DP 削除エンドポイントへ DELETE リクエストを送っています。

[Originator Profile 技術研究組合 (OP CIP)](https://originator-profile.org/) から受け取った認証情報が `8fe1b860-558c-5107-a9af-21c376a6a27c:eqjyPR--HaS0mMj0wiDP1HA7yT1WGgYpHcUjDia3py8` だとしています。

エンドポイントの URL は、アカウント ID を入れて `https://dprexpt.originator-profile.org/admin/publisher/8fe1b860-558c-5107-a9af-21c376a6a27c/website` とし、 `-u` オプションで上記アカウント ID とパスワードを `:` で連結した値を Basic 認証の認証情報として利用するようにしています。

`-d` オプションでパラメータを指定しています。これらのパラメータはリクエストのボディ部に JSON 形式で渡されます。SDP の削除の場合、必要なパラメータは削除したい SDP の id だけであり、それを `{"input":{"id":"41632705-9600-49df-b80d-a357d474f37e"}}` という形式にします。

:::note

**SDP を削除しても SDP を失効したことにはなりません。** DP レジストリ以外の場所に SDP が保存されていた場合、その SDP は、 DPレジストリから SDP を削除した後も、拡張機能による検証をパスします。

:::

SDP を完全に削除すると、 [Profile Set 取得エンドポイント](./howto.md#website-profiles-endpoint)からは、 404 Not Found のエラーが返ってくるようになります。

## SDP を間違って登録した場合

[記事を削除・非公開にした場合](#on-delete) を参照してください。

## 有料記事/無料記事/モバイル向けなど記事内容が変わる場合

現時点では全て個別独立した記事として DP 登録してください。例えば、1つの記事に対してデスクトップ版とモバイル版があり、記事内容に違いがある場合には、デスクトップ版の SDP とモバイル版の SDP の2つを発行してください。
[Profile Set 取得エンドポイント](./howto.md#website-profiles-endpoint) を呼ぶときに、それぞれのバージョンに対応する URL をパラメータとして付与して呼ぶことで、バージョン毎の SDP を得ることができます。

:::note

これは現状の仕様を利用した方法であり、将来的には、このようなケースをグループ化した DP として扱えるようにすることなども検討中です。

:::

## 記事が複数ページに分かれている場合

現時点ではページ毎に個別独立した記事として DP 登録してください。つまり、記事が5ページに分かれている場合には、5つの SDP の発行が必要になります。 SDP を発行する際には、それぞれの SDP の中の url プロパティが、該当するページの URL になっていることを確認してください。
[Profile Set 取得エンドポイント](./howto.md#website-profiles-endpoint) を呼ぶときに、それぞれのバージョンに対応する URL をパラメータとして付与して呼ぶことで、バージョン毎の SDP を得ることができます。

:::note

将来的には複数ページにわたって単一の DP として登録可能にするなども検討中です。

:::

## 同じ URL の SDP を複数登録した場合

DP レジストリは、登録する SDP と ID の等しい SDP がすでに DP レジストリに存在する場合には、 SDP の新規登録でなく既存の SDP の更新をします。
[Profile Set 取得エンドポイント](./howto.md#website-profiles-endpoint) は、クエリパラメータ `url` にマッチする SDP を Profile Set にして返します。 DP ID が異なる SDP が複数あった場合は、全てが Profile Set に含まれます。

同じ記事に対する SDP を更新していく際には、 DP ID が更新前後で変わらないように注意してください。
