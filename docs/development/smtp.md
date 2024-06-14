# SMTP

## ローカル環境でのメール送信テスト

申請通知メール送信機能をローカル環境で使用することでもメール送信のテストをすることができますが、ここではメール送信部分のみのテストの実行方法を記述します。

Step1.

```
$ pnpm dev
```

Step2.

```
$ pnpm --filter @originator-profile/registry exec dotenv -e .env.development -- sh -c 'printf "From: ${MAIL_FROM}\nTo: Bob <bob@example.com>\nSubject: Hello\n\nHello World" | curl smtp://${SMTP_HOST}:${SMTP_PORT} --mail-from oprdev@localhost --mail-rcpt bob@example.com -u any:any -T -'
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
$ node --env-file=apps/registry/.env.development smtp-test.mjs
```

Step3.

http://localhost:8025 にアクセスして確認
