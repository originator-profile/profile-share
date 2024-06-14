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

export const sendNotifyMail = async ({
  recipients,
  subject,
  body,
}: {
  recipients: string[];
  subject: string;
  body: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: yn(SMTP_SECURE),
    auth: {
      user: SMTP_AUTH_USER,
      pass: SMTP_AUTH_PASSWORD,
    },
  });

  return await transporter.sendMail({
    from: MAIL_FROM,
    bcc: recipients,
    subject: subject,
    html: body,
  });
};
