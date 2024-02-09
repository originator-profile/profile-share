# 署名付きオリジネータープロファイル / Signed Originator Profile (SOP)

組織の身元を表明し検証可能にするためのデータ表現であり、確認済みの組織の基本情報と資格情報に対して OPR が [JSON Web Token (JWT)](./json-web-token.md) として署名する。

サイトやコンテンツの [SDP](./signed-document-profile.md) と併せて、SDP の対象サイトやコンテンツと一緒に配信する以外に、SOP の対象組織のサイトの well-known に配置するなどして組織の信頼性情報の提示に利用する。
