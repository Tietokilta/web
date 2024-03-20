import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { Button, Progress } from "@tietokilta/ui";
import {
  type IlmomasiinaEvent,
  fetchEvent,
  type EventQuota,
  type EventQuotaWithSignups,
  type QuotaSignupWithQuotaTitle,
  OPEN_QUOTA_ID,
  QUEUE_QUOTA_ID,
} from "../../../../lib/api/external/ilmomasiina";
import { signUp } from "../../../../lib/api/external/ilmomasiina/actions";
import {
  formatDateTimeSeconds,
  formatDatetimeYear,
  getQuotasWithOpenAndQueue,
} from "../../../../lib/utils";
import { BackButton } from "../../../../components/back-button";
import { getCurrentLocale, getScopedI18n } from "../../../../locales/server";

async function SignUpText({
  startDate,
  endDate,
  className,
}: {
  startDate?: string | null;
  endDate?: string | null;
  className?: string;
}) {
  const locale = getCurrentLocale();
  const t = await getScopedI18n("ilmomasiina.status");
  if (!startDate || !endDate) {
    return (
      <span className={className}>{t("Tapahtumaan ei voi ilmoittautua")}</span>
    );
  }

  const hasStarted = new Date(startDate) < new Date();
  const hasEnded = new Date(endDate) < new Date();

  if (hasStarted && hasEnded) {
    return (
      <span className={className}>{t("Ilmoittautuminen on päättynyt")}</span>
    );
  }

  if (hasStarted && !hasEnded) {
    return (
      <span className={className}>
        {t("Ilmoittautuminen auki", {
          endDate: formatDatetimeYear(endDate, locale),
        })}
      </span>
    );
  }

  return (
    <span className={className}>
      {t("Ilmoittautuminen alkaa", {
        startDate: formatDatetimeYear(startDate, locale),
      })}
    </span>
  );
}

async function SignupButtons({ event }: { event: IlmomasiinaEvent }) {
  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  const t = await getScopedI18n("action");

  const hasStarted = new Date(event.registrationStartDate) < new Date();
  const hasEnded = new Date(event.registrationEndDate) < new Date();

  return (
    <ul className="flex flex-col gap-2">
      {event.quotas.map((quota) => (
        <li key={quota.id} className="contents">
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises -- server actions can be ignored promises */}
          <form action={signUp} className="contents">
            <input type="hidden" name="quotaId" value={quota.id} />
            <Button
              type="submit"
              disabled={!hasStarted || hasEnded}
              variant="secondary"
            >
              {t("Sign up")}
              {event.quotas.length === 1 ? "" : `: ${quota.title}`}
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}

async function SignUpTable({
  quota,
}: {
  quota: EventQuota | EventQuotaWithSignups;
}) {
  const t = await getScopedI18n("ilmomasiina");
  const signups = quota.signups ?? [];
  if (signups.length === 0) {
    return <p>{t("status.Ei ilmoittautuneita vielä")}</p>;
  }

  const isOpenQuota = quota.id === OPEN_QUOTA_ID;
  const isQueueQuota = quota.id === QUEUE_QUOTA_ID;
  const isGeneratedQuota = !!isOpenQuota || !!isQueueQuota;

  return (
    <table className="shadow-solid w-full table-auto border-separate border-spacing-0 rounded-md border-2 border-gray-900">
      <thead>
        <tr className="bg-gray-200">
          <th className="rounded-tl-md border-b border-gray-900 p-2">
            {t("headers.Sija")}
          </th>
          <th className="border-b border-gray-900 p-2">{t("headers.Nimi")}</th>
          {isGeneratedQuota ? (
            <th className="border-b border-gray-900 p-2">
              {t("headers.Kiintiö")}
            </th>
          ) : null}
          <th className="rounded-tr-md border-b border-gray-900 p-2">
            {t("headers.Ilmoittautumisaika")}
          </th>
        </tr>
      </thead>
      <tbody>
        {signups
          .filter((signup) => isGeneratedQuota || signup.status === "in-quota")
          .toSorted((a, b) => a.position - b.position)
          .map((signup) => (
            <tr
              key={signup.position}
              className="odd:bg-gray-300 even:bg-gray-200"
            >
              <td className="border-b border-gray-900 px-2 py-1">
                <span>{signup.position}.</span>
              </td>
              <td className="border-b border-gray-900 px-2 py-1">
                {signup.namePublic ? (
                  <span>
                    {signup.firstName} {signup.lastName}
                  </span>
                ) : (
                  <span className="italic">
                    {signup.confirmed ? "Piilotettu" : "Vahvistamaton"}
                  </span>
                )}
              </td>
              {isGeneratedQuota ? (
                <td className="border-b border-gray-900 px-2 py-1">
                  {"quotaTitle" in signup
                    ? (signup as QuotaSignupWithQuotaTitle).quotaTitle
                    : ""}
                </td>
              ) : null}
              <td className="border-b border-gray-900 px-2 py-1">
                <time dateTime={signup.createdAt} className="group">
                  <span>{formatDateTimeSeconds(signup.createdAt)}</span>
                  <span className="invisible group-hover:visible">
                    .{new Date(signup.createdAt).getMilliseconds()}
                  </span>
                </time>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

async function SignUpList({ event }: { event: IlmomasiinaEvent }) {
  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  const t = await getScopedI18n("ilmomasiina");

  const quotasWithOpenAndQueue = getQuotasWithOpenAndQueue(
    event.quotas,
    event.openQuotaSize,
  );

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-xl font-semibold text-gray-900">
        {t("Ilmoittautuneet")}
      </h2>
      <ul className="space-y-16">
        {quotasWithOpenAndQueue.map((quota) => (
          <li key={quota.id} className="space-y-2">
            <h3 className="font-mono text-lg font-semibold text-gray-900">
              {quota.title}
            </h3>
            <SignUpTable quota={quota} />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Tldr({ event }: { event: IlmomasiinaEvent }) {
  const t = await getScopedI18n("ilmomasiina.headers");
  const locale = getCurrentLocale();
  return (
    <div className="shadow-solid rounded-md border-2 border-gray-900 p-4 md:p-6">
      {event.category ? (
        <span className="block">
          <span className="font-medium">{t("Kategoria")}:</span>{" "}
          <span>{event.category}</span>
        </span>
      ) : null}
      {event.location ? (
        <span className="block">
          <span className="font-medium">{t("Paikka")}:</span>{" "}
          <span>{event.location}</span>
        </span>
      ) : null}
      {event.date ? (
        <span className="block">
          <span className="font-medium">{t("Alkaa")}:</span>{" "}
          <time dateTime={event.date}>
            {formatDatetimeYear(event.date, locale)}
          </time>
        </span>
      ) : null}
      {event.endDate ? (
        <span className="block">
          <span className="font-medium">{t("Loppuu")}:</span>{" "}
          <time dateTime={event.endDate}>
            {formatDatetimeYear(event.endDate, locale)}
          </time>
        </span>
      ) : null}
    </div>
  );
}

async function SignUpQuotas({ event }: { event: IlmomasiinaEvent }) {
  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  const t = await getScopedI18n("ilmomasiina");

  const quotas = getQuotasWithOpenAndQueue(event.quotas, event.openQuotaSize);

  return (
    <div className="shadow-solid max-w-prose space-y-4 rounded-md border-2 border-gray-900 p-4 md:p-6">
      <h2 className="font-mono text-lg font-semibold text-gray-900">
        {t("Ilmoittautuneet")}
      </h2>
      <ul className="flex flex-col gap-2">
        {quotas.map((quota) => (
          <li key={quota.id} className="contents">
            {quota.id === QUEUE_QUOTA_ID ? (
              <span>
                {t("status.Jonossa", {
                  queueCount: quota.signupCount,
                })}
              </span>
            ) : (
              <>
                <span>{quota.title}</span>
                <div className="relative">
                  <Progress
                    value={Math.min(
                      (quota.signupCount / quota.size) * 100,
                      100,
                    )}
                  />
                  <span className="absolute bottom-1/2 left-0 w-full translate-y-1/2 text-center text-sm">
                    {Math.min(quota.signupCount, quota.size)} / {quota.size}
                  </span>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function SignUpActions({ event }: { event: IlmomasiinaEvent }) {
  const t = await getScopedI18n("ilmomasiina");
  return (
    <div className="shadow-solid max-w-prose space-y-4 rounded-md border-2 border-gray-900 p-4 md:p-6">
      <h2 className="font-mono text-lg font-semibold text-gray-900">
        {t("Ilmoittautuminen")}
      </h2>
      <SignUpText
        className="block"
        startDate={event.registrationStartDate}
        endDate={event.registrationEndDate}
      />
      <SignupButtons event={event} />
    </div>
  );
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params: { slug } }: PageProps) {
  const event = await fetchEvent(slug);

  if (!event.ok && event.error === "ilmomasiina-event-not-found") {
    notFound();
  }

  if (!event.ok) {
    console.warn("Failed to fetch event from Ilmomasiina", event.error);
    throw new Error("Failed to fetch event from Ilmomasiina");
  }
  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton />
          <h1 className="font-mono text-4xl">{event.data.title}</h1>
          <div className="flex flex-col gap-16">
            <div className="flex gap-16">
              <div className="flex max-w-xl flex-grow-[2] flex-col gap-8">
                <Tldr event={event.data} />
                {event.data.description ? (
                  <div className="prose">
                    <Markdown>{event.data.description}</Markdown>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-grow-[1] flex-col gap-8">
                <SignUpActions event={event.data} />
                <SignUpQuotas event={event.data} />
              </div>
            </div>
            <SignUpList event={event.data} />
          </div>
        </div>
      </div>
    </main>
  );
}
