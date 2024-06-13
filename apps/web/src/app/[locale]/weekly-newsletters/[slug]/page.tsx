import WeeklyNewsletterPage from "../../../../custom-pages/weekly-newsletter-page";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params: { slug } }: PageProps) {
  return <WeeklyNewsletterPage slug={slug} />;
}
