import WeeklyNewsletterPage from "@custom-pages/weekly-newsletter-page";
import { setLocaleFromParams } from "@locales/server";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const generateStaticParams = () => [];

export default async function Page(props: PageProps) {
  await setLocaleFromParams(props.params);
  const { slug } = await props.params;

  return <WeeklyNewsletterPage slug={slug} />;
}
