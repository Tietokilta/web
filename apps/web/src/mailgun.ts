import Mailgun from "mailgun.js";
import { type MessagesSendResult } from "mailgun.js/definitions";
import { env } from "./env";

interface SendEmailOptions {
  subject: string;
  html: string;
}

export const sendEmail = async (
  options: SendEmailOptions,
): Promise<MessagesSendResult> => {
  const mailgun = new Mailgun(FormData);

  const mg = mailgun.client({
    username: "api",
    url: env.MAILGUN_URL,
    key: env.MAILGUN_API_KEY ?? "",
  });

  if (!env.MAILGUN_DOMAIN) {
    throw Error("MAILGUN DOMAIN NOT FOUND");
  }
  const result = await mg.messages.create(env.MAILGUN_DOMAIN, {
    from: env.MAILGUN_SENDER,
    to: env.MAILGUN_RECEIVER,
    subject: options.subject,
    html: options.html,
  });
  return result;
};
