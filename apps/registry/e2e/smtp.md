**TODO: [審査結果メール通知機能](https://github.com/originator-profile/profile/issues/770)にて実装予定。このテスト方法は実装後変更される可能性あります。実装次第もし不要になったら削除してください。**

# メール送信テスト

Step1.

```diff
diff --git a/apps/registry/package.json b/apps/registry/package.json
index 9f904ae4..99547169 100644
--- a/apps/registry/package.json
+++ b/apps/registry/package.json
@@ -18,9 +18,8 @@
     "build:ui": "run-s ui:clean ui:build",
     "build:cli": "oclif manifest",
     "build:api": "bin/run openapi-gen",
-    "dev": "dotenv -e .env.development run-p dev:{db,build}",
-    "dev:db": "docker compose --env-file .env.development up db",
-    "//TODO:gh-770:dev:docker": "docker compose --env-file .env.development up db mailpit",
+    "dev": "dotenv -e .env.development run-p dev:{docker,build}",
+    "dev:docker": "docker compose --env-file .env.development up db mailpit",
     "dev:build": "tsup src --watch --ignore-watch src/router.ts --onSuccess 'run-p dev:{docs,server}'",
     "dev:docs": "run-s build:{cli,api} docs",
     "dev:server": "run-s dev:{prisma,start}",
```

Step2.

```
$ yarn dev
```

Step3.

```
$ yarn dotenv -- -e apps/registry/.env.development -- sh -c 'printf "From: ${MAIL_FROM}\nTo: Bob <bob@example.com>\nSubject: Hello\n\nHello World" | curl smtp://${SMTP_HOST}:${SMTP_PORT} --mail-from oprdev@localhost --mail-rcpt bob@example.com -u any:any -T -'
```

or

```js
// smtp-test.mjs
import nodemailer from "nodemailer";
import yn from "yn";

const {
  MAIL_FROM,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE = "true",
  SMTP_AUTH_USER,
  SMTP_AUTH_PASSWORD,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: yn(SMTP_SECURE),
  auth: {
    user: SMTP_AUTH_USER,
    pass: SMTP_AUTH_PASSWORD,
  },
});

const info = await transporter.sendMail({
  from: MAIL_FROM,
  to: "Bob <bob@example.com>",
  subject: "Hello world!",
  html: "<marquee>Hello world.</marquee>",
});

console.log(info.messageId);
```

```
$ yarn dotenv -- -e apps/registry/.env.development -- node smtp-test.mjs
```

Step4.

http://localhost:8025 にアクセスして確認
