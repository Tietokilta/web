import { NotFound, type PayloadHandler } from "payload";
import { render } from "react-email";
import { type Node } from "@lexical-types";
import { type WeeklyNewsletter } from "@payload-types";
import { signedIn } from "../access/signed-in";
import { NewsletterEmail } from "../emails/newsletter-email";
import { type Locale } from "../emails/utils/utils";
import { env } from "../env";
import { sendEmail } from "../mailgun";
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

    const { PUBLIC_LEGACY_URL, PUBLIC_FRONTEND_URL } = env;

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

    // Without ?locale the email has both languages; with ?locale=fi or
    // ?locale=en it has only that one, to match the per-language mailing lists.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- query may be undefined, payload types are scuffed
    const requestedLocale = req.query?.locale;
    if (
      requestedLocale !== undefined &&
      requestedLocale !== "fi" &&
      requestedLocale !== "en"
    ) {
      return Response.json(
        { error: "locale must be fi or en" },
        { status: 400 },
      );
    }
    const includeFinnish = requestedLocale !== "en";
    const includeEnglish = requestedLocale !== "fi";

    // draft: download the latest saved version, which is what the editor shows,
    // not the last published one (which may be stale, or missing entirely).
    const englishNewsletter = includeEnglish
      ? await req.payload.findByID({
          collection: "weekly-newsletters",
          id: newsletterId,
          depth: 2,
          locale: "en",
          draft: true,
        })
      : undefined;

    const finnishNewsletter = includeFinnish
      ? await req.payload.findByID({
          collection: "weekly-newsletters",
          id: newsletterId,
          depth: 2,
          locale: "fi",
          draft: true,
        })
      : undefined;

    const { PUBLIC_LEGACY_URL, PUBLIC_FRONTEND_URL } = env;

    // Render the HTML content
    const html = await render(
      NewsletterEmail({
        finnishNewsletter,
        englishNewsletter,
        PUBLIC_LEGACY_URL: PUBLIC_LEGACY_URL ?? "",
        PUBLIC_FRONTEND_URL: PUBLIC_FRONTEND_URL ?? "",
      }),
    );

    const filename = `${[finnishNewsletter?.title, englishNewsletter?.title]
      .filter(Boolean)
      .join(" - ")
      // "viikkotiedote 16/2025": a slash isn't allowed in a file name.
      .replaceAll("/", "-")}.html`;
    // Titles hold ä/ö, which header values can't carry raw: give an ASCII
    // fallback and the real name in RFC 5987 form.
    const asciiFilename = filename.replace(/[^\x20-\x7e]|["\\]/g, "_");

    // Return the result to the client
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    if (error instanceof NotFound) {
      return Response.json({ error: "Newsletter not found" }, { status: 404 });
    }
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
