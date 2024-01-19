# iframe に埋め込む HTML コンテンツへの Profile Set あるいは ad Profile Pair の設置

事前にSOP、SDPを発行している必要があります。SOP、SDPの発行については以下のドキュメントを確認してください。

- 必須：
  - [Signed Originator Profile 発行](./signed-originator-profile-issuance.md)
- いずれか必須：
  - [Signed Document Profile 発行](./signed-document-profile-issuance.md)
  - [ad Profile Pair の発行](./ad-profile-pair-issuance.md)

以下のサンプルを用いて説明します。

- [iframe.html](pathname:///examples/iframe.html)

Profile Set、ad Profile Pairの設置は iframe に埋め込む HTML コンテンツに対しておこないます。設置には[利用可能な HTML 表現](/spec/#html)を使用します。ここでは、\<script\>要素を使用した設置をおこなう場合の差分を示します。

## Profile Set の場合

```diff
--- a/iframe.html	2024-01-19 17:51:13.978204068 +0900
+++ b/iframe.html	2024-01-19 17:59:44.648926086 +0900
@@ -2,6 +2,15 @@
 <html lang="ja">
   <head>
     <title>埋め込み HTML コンテンツ</title>
+    <script type="application/ld+json">
+      {
+        "@context": "https://originator-profile.org/context.jsonld",
+        "profile": [
+          "<SOP>",
+          "<SDP>"
+        ]
+      }
+    </script>
   </head>
   <body>
     <h1>埋め込み HTML コンテンツ</h1>
```

## ad Profile Pair の場合

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
