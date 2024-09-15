import type { Response } from "express";
import type { PayloadRequest } from "payload/types";
import { render } from "@react-email/components";
import { type Node } from "@tietokilta/cms-types/lexical";
import { type WeeklyNewsletter } from "@tietokilta/cms-types/payload";
import { signedIn } from "../access/signed-in";
import { sendEmail } from "../mailgun";
import { NewsletterEmail } from "../emails/newsletter-email";
import { type Locale } from "../emails/utils/utils";
import { parseToc, parseToTelegramString } from "./utils/tg-parser";

export const newsletterSenderController = async (
  req: PayloadRequest,
  res: Response,
): Promise<
  | Response<{
      message: string;
    }>
  | undefined
> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
    return;
  }
  try {
    const { subject, html } = req.body as {
      subject: string | undefined;
      html: string | undefined;
    };

    if (!subject || !html) {
      return res
        .status(400)
        .json({ error: "Missing required fields: subject, html" });
    }

    await sendEmail({ subject, html });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmailController = async (
  req: PayloadRequest,
  res: Response,
): Promise<Response<HTMLElement> | undefined> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
    return;
  }

  try {
    const { newsletterId } = req.params;

    // Fetch the English version of the newsletter
    const englishNewsletter = (await req.payload.findByID({
      collection: "weekly-newsletters",
      id: newsletterId,
      depth: 2,
      locale: "en",
    })) as unknown as WeeklyNewsletter;

    // Fetch the Finnish version of the newsletter
    const finnishNewsletter = (await req.payload.findByID({
      collection: "weekly-newsletters",
      id: newsletterId,
      depth: 2,
      locale: "fi",
    })) as unknown as WeeklyNewsletter;

    const { PUBLIC_LEGACY_URL, PUBLIC_FRONTEND_URL } = process.env;

    // Render the HTML content
    const html = await render(
      NewsletterEmail({
        finnishNewsletter,
        englishNewsletter,
        PUBLIC_LEGACY_URL: PUBLIC_LEGACY_URL ?? "",
        PUBLIC_FRONTEND_URL: PUBLIC_FRONTEND_URL ?? "",
      }),
    );
    // Return the result to the client
    return res
      .writeHead(200, {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename=${finnishNewsletter.title}/${englishNewsletter.title}.html`,
      })
      .end(html);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred." });
  }
};

export const getTelegramMessageController = async (
  req: PayloadRequest,
  res: Response,
): Promise<Response | undefined> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
    return;
  }
  try {
    const { newsletterId } = req.params;
    const { locale } = req.query;

    const newsletter = (await req.payload.findByID({
      collection: "weekly-newsletters",
      id: newsletterId,
      depth: 2,
      locale: locale as string,
    })) as unknown as WeeklyNewsletter;
    let message = "";
    message += `**${newsletter.title}**\n\n`;
    message += parseToTelegramString(
      newsletter.greetings.root.children as Node[],
    );
    message += parseToc(newsletter, locale as Locale);

    return res.status(200).json({
      message,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred." });
  }
};
