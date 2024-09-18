import * as React from "react";
import { type WeeklyNewsletter } from "@tietokilta/cms-types/payload";
import { Head, Html, Font } from "@react-email/components";
import { newsletterPreviewProps } from "./newsletter-example";
import { Newsletter } from "./newsletter";

interface NewsletterEmailProps {
  finnishNewsletter: WeeklyNewsletter;
  englishNewsletter: WeeklyNewsletter;
  PUBLIC_LEGACY_URL: string;
  PUBLIC_FRONTEND_URL: string;
}

export const NewsletterEmail = ({
  finnishNewsletter,
  englishNewsletter,
  PUBLIC_LEGACY_URL,
  PUBLIC_FRONTEND_URL,
}: NewsletterEmailProps): React.ReactElement => {
  return (
    <Html>
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
      <Newsletter
        newsletter={finnishNewsletter}
        locale="fi"
        PUBLIC_LEGACY_URL={PUBLIC_LEGACY_URL}
        PUBLIC_FRONTEND_URL={PUBLIC_FRONTEND_URL}
      ></Newsletter>
      <Newsletter
        newsletter={englishNewsletter}
        locale="en"
        PUBLIC_LEGACY_URL={PUBLIC_LEGACY_URL}
        PUBLIC_FRONTEND_URL={PUBLIC_FRONTEND_URL}
      ></Newsletter>
    </Html>
  );
};
NewsletterEmail.PreviewProps = newsletterPreviewProps;

export default NewsletterEmail;
