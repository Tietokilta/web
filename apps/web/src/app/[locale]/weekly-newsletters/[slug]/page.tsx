import WeeklyNewsletterPage from "../../../../custom-pages/weekly-newsletter-page";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { slug } = params;

  return <WeeklyNewsletterPage slug={slug} />;
}
