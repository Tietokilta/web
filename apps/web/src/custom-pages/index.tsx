import type { Page } from "@tietokilta/cms-types/payload";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const EventsPage = dynamic(() => import("./events-page"));
const WeeklyNewsletterPage = dynamic(() => import("./weekly-newsletter-page"));
const WeeklyNewslettersListPage = dynamic(
  () => import("./weekly-newsletters-list-page"),
);

export function CustomPage({ page }: { page: Page }) {
  if (page.type === "events-list") {
    return <EventsPage />;
  }

  if (page.type === "weekly-newsletter") {
    return <WeeklyNewsletterPage />;
  }

  if (page.type === "weekly-newsletters-list") {
    return <WeeklyNewslettersListPage />;
  }

  return notFound();
}
