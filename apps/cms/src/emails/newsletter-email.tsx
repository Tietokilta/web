import * as React from "react";
import { type WeeklyNewsletter } from "@tietokilta/cms-types/payload";
import { Html } from "@react-email/components";
import { newsletterPreviewProps } from "./newsletter-example";
import Newsletter from "./newsletter";

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
      <main
        id="main"
        className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
      >
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
      </main>
    </Html>
  );
};
NewsletterEmail.PreviewProps = newsletterPreviewProps;

export default NewsletterEmail;
