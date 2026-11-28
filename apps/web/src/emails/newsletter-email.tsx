import * as React from "react";
import { Head, Html, Font } from "react-email";
import { type WeeklyNewsletter } from "@payload-types";
import { Newsletter } from "./newsletter";
import { newsletterPreviewProps } from "./newsletter-example";

interface NewsletterEmailProps {
  /** Leave one language out to render a single-language email. */
  finnishNewsletter?: WeeklyNewsletter;
  englishNewsletter?: WeeklyNewsletter;
  PUBLIC_LEGACY_URL: string;
  PUBLIC_FRONTEND_URL: string;
}

export function NewsletterEmail({
  finnishNewsletter,
  englishNewsletter,
  PUBLIC_LEGACY_URL,
  PUBLIC_FRONTEND_URL,
}: NewsletterEmailProps): React.ReactElement {
  // Each section carries its own lang; the document's is the first one's,
  // since <Html> would otherwise default to "en".
  const lang = finnishNewsletter ? "fi" : "en";

  return (
    <Html lang={lang}>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
        />
      </Head>
      {finnishNewsletter ? (
        <Newsletter
          newsletter={finnishNewsletter}
          locale="fi"
          PUBLIC_LEGACY_URL={PUBLIC_LEGACY_URL}
          PUBLIC_FRONTEND_URL={PUBLIC_FRONTEND_URL}
        />
      ) : null}
      {englishNewsletter ? (
        <Newsletter
          newsletter={englishNewsletter}
          locale="en"
          PUBLIC_LEGACY_URL={PUBLIC_LEGACY_URL}
          PUBLIC_FRONTEND_URL={PUBLIC_FRONTEND_URL}
        />
      ) : null}
    </Html>
  );
}
NewsletterEmail.PreviewProps = newsletterPreviewProps;

export default NewsletterEmail;
