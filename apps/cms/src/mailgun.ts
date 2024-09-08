// mailgun.ts

import FormData from "form-data";
import Mailgun, { type MessagesSendResult } from "mailgun.js";

interface SendEmailOptions {
  subject: string;
  html: string;
}

export const sendEmail = async (
  options: SendEmailOptions,
): Promise<MessagesSendResult> => {
  const mailgun = new Mailgun(FormData);
  const {
    MAILGUN_SENDER,
    MAILGUN_RECEIVER,
    MAILGUN_API_KEY,
    MAILGUN_DOMAIN,
    MAILGUN_URL,
  } = process.env;

  const mg = mailgun.client({
    username: "api",
    url: MAILGUN_URL,
    key: MAILGUN_API_KEY ?? "",
  });

  if (!MAILGUN_DOMAIN) {
    throw Error("MAILGUN DOMAIN NOT FOUND");
  }
  const result = await mg.messages.create(MAILGUN_DOMAIN, {
    from: MAILGUN_SENDER,
    to: MAILGUN_RECEIVER,
    subject: options.subject,
    html: options.html,
  });
  return result;
};
