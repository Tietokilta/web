import type { Response } from "express";
import type { PayloadRequest } from "payload/types";
import { render } from "@react-email/components";
import { signedIn } from "../access/signed-in";
import { sendEmail } from "../mailgun";
import NewsletterEmail from "../emails/newsletter-email";

export const newsletterSenderController = async (
  req: PayloadRequest,
  res: Response,
) => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
    return;
  }
  try {
    const { subject, html } = req.body;

    if (!subject || !html) {
      return res
        .status(400)
        .json({ error: "Missing required fields: subject, html" });
    }

    await sendEmail({ subject, html });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmailController = async (
  req: PayloadRequest,
  res: Response,
) => {
  const { newsletterId } = req.params;

  try {
    // Fetch the English version of the newsletter
    const englishNewsletter = await req.payload.findByID({
      collection: "weekly-newsletters",
      id: newsletterId,
      depth: 2,
      locale: "en",
    });

    // Fetch the Finnish version of the newsletter
    const finnishNewsletter = await req.payload.findByID({
      collection: "weekly-newsletters",
      id: newsletterId,
      depth: 2,
      locale: "fi",
    });
    // Ensure both newsletters exist
    if (!englishNewsletter) {
      throw new Error("English newsletter not found");
    }
    if (!finnishNewsletter) {
      throw new Error("Finnish newsletter not found");
    }
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
    return res.status(200).json({
      html,
      subject: `${finnishNewsletter.title} / ${englishNewsletter.title}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred." });
  }
};
