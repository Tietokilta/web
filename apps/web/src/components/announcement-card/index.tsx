import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  Button,
  ChevronDownIcon,
  MegaphoneIcon,
} from "@tietokilta/ui";
import Link from "next/link";
import type { News, Page } from "@payload-types";
import { cn } from "../../lib/utils";
import { getScopedI18n } from "../../locales/server";

function AnnouncementIcon({
  type,
  className,
}: {
  type: News["type"];
  className?: string;
}): React.ReactNode {
  if (type === "announcement") {
    return (
      <MegaphoneIcon
        className={cn("fill-success-500 mt-2 h-8 w-8 shrink-0", className)}
      />
    );
  }
  if (type === "warning") {
    return (
      <AlertTriangleIcon
        className={cn("fill-warning-500 mt-2 h-8 w-8 shrink-0", className)}
      />
    );
  }
  if (type === "danger") {
    return (
      <AlertOctagonIcon
        className={cn("fill-danger-500 mt-2 h-8 w-8 shrink-0", className)}
      />
    );
  }

  return null;
}

export async function AnnouncementCard({ news }: { news: News }) {
  const t = await getScopedI18n("action");

  return (
    <section className="shadow-solid relative z-20 -mt-24 flex gap-4 overflow-hidden rounded-md border-2 border-gray-900 bg-gray-100 px-4 pb-6 pt-12 font-mono md:px-6 lg:-mt-48">
      <div
        className={cn(
          "absolute left-0 top-0 flex w-full justify-between border-b-2 border-gray-900 bg-gray-100 p-2",
          news.type === "announcement" && "bg-success-500",
          news.type === "warning" && "bg-warning-500",
          news.type === "danger" && "bg-danger-500",
        )}
      >
        <div className="flex w-5 gap-1">
          <span
            className={cn(
              "bg-secondary-600 h-2 w-2 rounded-full border border-gray-900",
              news.type === "announcement" && "bg-success-700",
              news.type === "warning" && "bg-warning-700",
              news.type === "danger" && "bg-danger-700",
            )}
          />
          <span
            className={cn(
              "bg-primary-600 h-2 w-2 rounded-full border border-gray-900",
              news.type === "announcement" && "bg-success-700",
              news.type === "warning" && "bg-warning-700",
              news.type === "danger" && "bg-danger-700",
            )}
          />
        </div>
        {news.type ? (
          <span className="self-center text-sm font-medium">
            {news.type}.md
          </span>
        ) : null}
        {news.type ? <div className="w-5" /> : null}
      </div>

      <AnnouncementIcon className="hidden md:block" type={news.type} />

      <div className="hidden flex-1 flex-col md:flex">
        <div className="flex flex-col">
          <h2 className="text-lg font-medium">{news.title}</h2>
          <p>{news.excerpt}</p>
        </div>
        {news.ctaType === "page" && news.pageLink ? (
          <Button asChild className="md:self-end" variant="link">
            <Link href={(news.pageLink as Page).path ?? "#broken"}>
              <span aria-hidden="true">{t("Read more")}</span>
              <span className="sr-only">
                {t("Read more about {something}", { something: news.title })}
              </span>
            </Link>
          </Button>
        ) : null}
        {news.ctaType === "external" && news.externalLink ? (
          <Button asChild className="md:self-end" variant="link">
            <Link href={news.externalLink}>
              <span aria-hidden="true">{t("Read more")}</span>
              <span className="sr-only">
                {t("Read more about {something}", { something: news.title })}
              </span>
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-4 md:hidden">
        <details className="group flex w-full flex-col">
          <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-2 text-lg font-medium [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <h2>{news.title}</h2>
            <ChevronDownIcon className="inline-block size-6 shrink-0 transition-all group-open:rotate-180" />
          </summary>
          <p className="pt-2">{news.excerpt}</p>
        </details>
        {news.ctaType === "page" && news.pageLink ? (
          <Button asChild variant="link">
            <Link href={(news.pageLink as Page).path ?? "#broken"}>
              <span aria-hidden="true">{t("Read more")}</span>
              <span className="sr-only">
                {t("Read more about {something}", { something: news.title })}
              </span>
            </Link>
          </Button>
        ) : null}
        {news.ctaType === "external" && news.externalLink ? (
          <Button asChild className="md:self-end" variant="link">
            <Link href={news.externalLink}>
              <span aria-hidden="true">{t("Read more")}</span>
              <span className="sr-only">
                {t("Read more about {something}", { something: news.title })}
              </span>
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
