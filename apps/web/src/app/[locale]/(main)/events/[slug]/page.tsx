import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, Progress } from "@tietokilta/ui";
import { type Metadata } from "next";
import {
  type IlmomasiinaEvent,
  fetchEvent,
  type EventQuota,
  type EventQuotaWithSignups,
  type QuotaSignupWithQuotaTitle,
  OPEN_QUOTA_ID,
  QUEUE_QUOTA_ID,
  type EventQuestion,
  type QuotaSignup,
  type QuestionAnswer,
} from "@lib/api/external/ilmomasiina";
import {
  formatDateTimeSeconds,
  formatDateTimeSecondsOptions,
  formatDatetimeYear,
  formatDatetimeYearOptions,
  getLocalizedEventTitle,
  getQuotasWithOpenAndQueue,
} from "@lib/utils";
import { BackButton } from "@components/back-button";
import { getCurrentLocale, getScopedI18n } from "@locales/server";
import { I18nProviderClient } from "@locales/client";
import { DateTime } from "@components/datetime";
import { remarkI18n } from "@lib/plugins/remark-i18n";
import { SignupButtons } from "./signup-buttons";

async function SignUpText({
  startDate,
  endDate,
  className,
}: {
  startDate?: string | null;
  endDate?: string | null;
  className?: string;
}) {
  const locale = await getCurrentLocale();
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

function getFormattedAnswer(
  question: EventQuestion,
  answers: QuestionAnswer[],
) {
  const answer = answers.find((a) => a.questionId === question.id)?.answer;

  if (!answer) {
    return "";
  }

  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  return answer;
}

async function SignUpRow({
  signup,
  publicQuestions,
  isGeneratedQuota,
}: {
  signup: QuotaSignup | QuotaSignupWithQuotaTitle;
  publicQuestions: EventQuestion[];
  isGeneratedQuota: boolean;
}) {
  const t = await getScopedI18n("ilmomasiina");
  return (
    <tr className="odd:bg-gray-300 even:bg-gray-200">
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
            {signup.confirmed ? t("Piilotettu") : t("Vahvistamaton")}
          </span>
        )}
      </td>
      {publicQuestions.map((question) => (
        <td key={question.id} className="border-b border-gray-900 px-2 py-1">
          {getFormattedAnswer(question, signup.answers)}
        </td>
      ))}
      {isGeneratedQuota ? (
        <td className="border-b border-gray-900 px-2 py-1">
          {"quotaTitle" in signup ? signup.quotaTitle : ""}
        </td>
      ) : null}
      <td className="border-b border-gray-900 px-2 py-1">
        <time dateTime={signup.createdAt} className="group">
          <DateTime
            as="span"
            defaultFormattedDate={formatDateTimeSeconds(signup.createdAt)}
            rawDate={signup.createdAt}
            formatOptions={formatDateTimeSecondsOptions}
          />
          <span className="invisible group-hover:visible">
            .
            {new Date(signup.createdAt)
              .getMilliseconds()
              .toFixed()
              .padStart(3, "0")}
          </span>
        </time>
      </td>
    </tr>
  );
}

async function SignUpTable({
  quota,
  publicQuestions,
  signupsPublic,
}: {
  quota: EventQuota | EventQuotaWithSignups;
  publicQuestions: EventQuestion[];
  signupsPublic?: boolean;
}) {
  const t = await getScopedI18n("ilmomasiina");

  if (!signupsPublic) {
    return <p>{t("status.Ilmoittautumistiedot eivät ole julkisia")}</p>;
  }

  const signups = quota.signups ?? [];
  if (signups.length === 0) {
    return <p>{t("status.Ei ilmoittautuneita vielä")}</p>;
  }

  const isOpenQuota = quota.id === OPEN_QUOTA_ID;
  const isQueueQuota = quota.id === QUEUE_QUOTA_ID;
  const isGeneratedQuota = !!isOpenQuota || !!isQueueQuota;

  return (
    <div className="block w-full overflow-x-auto rounded-md border-2 border-gray-900 shadow-solid">
      <table className="w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-200">
            <th className="rounded-tl-md border-b border-gray-900 p-2">
              {t("headers.Sija")}
            </th>
            <th className="border-b border-gray-900 p-2">
              {t("headers.Nimi")}
            </th>
            {publicQuestions.map((question) => (
              <th key={question.id} className="border-b border-gray-900 p-2">
                {question.question}
              </th>
            ))}
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
            .filter(
              (signup) => isGeneratedQuota || signup.status === "in-quota",
            )
            .toSorted((a, b) => a.position - b.position)
            .map((signup) => (
              <SignUpRow
                key={signup.position}
                signup={signup}
                publicQuestions={publicQuestions}
                isGeneratedQuota={isGeneratedQuota}
              />
            ))}
        </tbody>
      </table>
    </div>
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

  const publicQuestions = event.questions.filter((question) => question.public);

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
            <SignUpTable
              signupsPublic={event.signupsPublic}
              publicQuestions={publicQuestions}
              quota={quota}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Tldr({ event }: { event: IlmomasiinaEvent }) {
  const t = await getScopedI18n("ilmomasiina.headers");
  const locale = await getCurrentLocale();
  return (
    <div className="rounded-md border-2 border-gray-900 p-4 shadow-solid md:p-6">
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
          <DateTime
            rawDate={event.date}
            defaultFormattedDate={formatDatetimeYear(event.date, locale)}
            formatOptions={formatDatetimeYearOptions}
          />
        </span>
      ) : null}
      {event.endDate ? (
        <span className="block">
          <span className="font-medium">{t("Loppuu")}:</span>{" "}
          <DateTime
            rawDate={event.endDate}
            defaultFormattedDate={formatDatetimeYear(event.endDate, locale)}
            formatOptions={formatDatetimeYearOptions}
          />
        </span>
      ) : null}
      {event.price ? (
        <span className="block">
          <span className="font-medium">{t("Hinta")}:</span>{" "}
          <span>{event.price}</span>
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

  const quotas = getQuotasWithOpenAndQueue(event.quotas, event.openQuotaSize, {
    openQuotaName: t("Avoin kiintiö"),
    queueQuotaName: t("Jonossa"),
  });

  return (
    <Card className="max-w-prose space-y-4">
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
                {typeof quota.size === "number" ? (
                  <div className="relative">
                    <Progress
                      value={Math.min(
                        ((quota.signupCount ?? 0) / quota.size) * 100,
                        100,
                      )}
                    />
                    <span className="absolute bottom-1/2 left-0 w-full translate-y-1/2 text-center text-sm">
                      {Math.min(quota.signupCount ?? 0, quota.size)} /{" "}
                      {quota.size}
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <Progress value={100} />
                    <span className="absolute bottom-1/2 left-0 w-full translate-y-1/2 text-center text-sm">
                      {quota.signupCount}
                    </span>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

async function SignUpActions({ event }: { event: IlmomasiinaEvent }) {
  const t = await getScopedI18n("ilmomasiina");
  return (
    <div className="max-w-prose space-y-4 rounded-md border-2 border-gray-900 p-4 shadow-solid md:p-6">
      <h2 className="font-mono text-lg font-semibold text-gray-900">
        {t("Ilmoittautuminen")}
      </h2>
      <SignUpText
        className="block"
        startDate={event.registrationStartDate}
        endDate={event.registrationEndDate}
      />
      <I18nProviderClient locale={await getCurrentLocale()}>
        <SignupButtons event={event} />
      </I18nProviderClient>
    </div>
  );
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;

  const { slug } = params;

  const event = await fetchEvent(slug);
  if (!event.ok) {
    // eslint-disable-next-line no-console -- nice to know if something goes wrong
    console.warn("Failed to fetch event from Ilmomasiina", event.error);
    return {};
  }
  const locale = await getCurrentLocale();

  return {
    title: getLocalizedEventTitle(event.data.title, locale),
    description: event.data.description,
    robots: {
      index: false,
    },
  };
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const locale = await getCurrentLocale();

  const event = await fetchEvent(slug);
  const t = await getScopedI18n("action");
  if (!event.ok && event.error === "ilmomasiina-event-not-found") {
    notFound();
  }

  if (!event.ok) {
    // eslint-disable-next-line no-console -- nice to know if something goes wrong
    console.warn("Failed to fetch event from Ilmomasiina", event.error);
    throw new Error("Failed to fetch event from Ilmomasiina");
  }
  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton>{t("Back")}</BackButton>
          <h1 className="font-mono text-2xl md:text-4xl">
            {getLocalizedEventTitle(event.data.title, locale)}
          </h1>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4 md:flex-row md:gap-16">
              <div className="grow-2 flex max-w-xl flex-col gap-8">
                <Tldr event={event.data} />
                {event.data.description ? (
                  <div className="prose">
                    <Markdown
                      remarkPlugins={[[remarkI18n, { locale }], remarkGfm]}
                    >
                      {event.data.description}
                    </Markdown>
                  </div>
                ) : null}
              </div>
              <div className="flex grow flex-col gap-8">
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
