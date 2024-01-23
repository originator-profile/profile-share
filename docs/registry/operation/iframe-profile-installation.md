# iframe に埋め込む HTML コンテンツへの ad Profile Pair の設置

事前にSOP、SDPを発行している必要があります。SOP、SDPの発行については以下のドキュメントを確認してください。

- [Signed Originator Profile 発行](./signed-originator-profile-issuance.md)
- [ad Profile Pair の発行](./ad-profile-pair-issuance.md)

:::note

現在の実装では、iframe 要素からの SOP、SDP の取得は ad Profile Pair 形式にのみ対応しています。Profile Set 形式、website Profile Pair 形式の取得は受け付けません。

:::

以下のサンプルを用いて説明します。

- [iframe.html](pathname:///examples/iframe.html)

ad Profile Pairの設置は iframe に埋め込む HTML コンテンツに対しておこないます。設置には[利用可能な HTML 表現](/spec/#html)を使用します。ここでは、\<script\>要素を使用した設置をおこなう場合の差分を示します。

```diff
--- a/iframe.html	2024-01-19 17:51:13.978204068 +0900
+++ b/iframe.html	2024-01-19 17:52:54.296118149 +0900
@@ -2,6 +2,22 @@
 <html lang="ja">
   <head>
     <title>埋め込み HTML コンテンツ</title>
+    <script type="application/ld+json">
+      {
+        "@context": "https://originator-profile.org/context.jsonld",
+        "ad": {
+          "op": {
+            "iss": "oprexpt.originator-profile.org",
+            "sub": "example.com",
+            "profile": "<SOP>"
+          },
+          "dp": {
+            "sub": "<SDP の sub クレームの値>",
+            "profile": "<SDP>"
+          }
+        }
+      }
+    </script>
   </head>
   <body>
     <h1>埋め込み HTML コンテンツ</h1>
```
