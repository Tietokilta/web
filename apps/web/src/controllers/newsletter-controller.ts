import { render } from "@react-email/components";
import { type PayloadHandler } from "payload";
import { type Node } from "@lexical-types";
import { type WeeklyNewsletter } from "@payload-types";
import { signedIn } from "../access/signed-in";
import { sendEmail } from "../mailgun";
import { NewsletterEmail } from "../emails/newsletter-email";
import { type Locale } from "../emails/utils/utils";
import { getLocale } from "../util";
import { parseToc, parseToTelegramString } from "./utils/tg-parser";

export const newsletterSenderController: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return new Response(null, { status: 401 });
  }
  try {
    const newsletterId = req.routeParams?.newsletterId;

    if (!newsletterId || typeof newsletterId !== "string") {
      return new Response("Newsletter ID is required", { status: 400 });
    }

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

    await sendEmail({
      subject: `${finnishNewsletter.title}/${englishNewsletter.title}`,
      html,
    });

    return Response.json({ message: "Email sent successfully" });
  } catch (_) {
    return Response.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
};

export const getEmailController: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newsletterId = req.routeParams?.newsletterId;

    if (!newsletterId || typeof newsletterId !== "string") {
      return Response.json(
        { error: "Newsletter ID is required" },
        { status: 400 },
      );
    }

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
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename=${finnishNewsletter.title}/${englishNewsletter.title}.html`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(
      { error: "An unknown error occurred." },
      { status: 500 },
    );
  }
};

export const getTelegramMessageController: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const newsletterId = req.routeParams?.newsletterId;

    if (!newsletterId || typeof newsletterId !== "string") {
      return Response.json(
        { error: "Newsletter ID is required" },
        { status: 400 },
      );
    }

    const locale = getLocale(req);

    if (!([undefined, "fi", "en", "all"] as const).includes(locale as Locale)) {
      return Response.json({ error: "Locale is required" }, { status: 400 });
    }

    const newsletter = (await req.payload.findByID({
      collection: "weekly-newsletters",
      id: newsletterId,
      depth: 2,
      locale,
    })) as unknown as WeeklyNewsletter;
    let message = "";
    message += `**${newsletter.title}**\n\n`;
    message += parseToTelegramString(
      newsletter.greetings.root.children as Node[],
    );
    message += parseToc(newsletter, locale as Locale);

    return Response.json({ message });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(
      { error: "An unknown error occurred." },
      { status: 500 },
    );
  }
};
