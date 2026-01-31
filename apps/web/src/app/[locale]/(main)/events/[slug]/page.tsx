/* eslint-disable no-nested-ternary -- much uglier without */
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, Progress } from "@tietokilta/ui";
import { type Metadata } from "next";
import {
  getSignupsByQuota,
  type SignupWithQuota,
  type QuotaSignups,
} from "@tietokilta/ilmomasiina-client/dist/utils/signupUtils";
import {
  type PublicSignupSchema,
  type Question,
  type UserEventResponse,
  SignupStatus,
} from "@tietokilta/ilmomasiina-models";
import { getMessages } from "next-intl/server";
import { fetchEvent } from "@lib/api/external/ilmomasiina";
import {
  formatDateTimeSeconds,
  formatDateTimeSecondsOptions,
  formatDatetimeYear,
  formatDatetimeYearOptions,
} from "@lib/utils";
import { BackButton } from "@components/back-button";
import { getLocale, getTranslations } from "@locales/server";
import { NextIntlClientProvider } from "@locales/client";
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
  const locale = await getLocale();
  const t = await getTranslations("ilmomasiina");
  if (!startDate || !endDate) {
    return (
      <span className={className}>{t("Event does not have signups")}</span>
    );
  }

  const hasStarted = new Date(startDate) < new Date();
  const hasEnded = new Date(endDate) < new Date();

  if (hasStarted && hasEnded) {
    return <span className={className}>{t("Signups have ended")}</span>;
  }

  if (hasStarted && !hasEnded) {
    return (
      <span className={className}>
        {t("Signups open until {endDate}", {
          endDate: formatDatetimeYear(endDate, locale),
        })}
      </span>
    );
  }

  return (
    <span className={className}>
      {t("Signups open on {startDate}", {
        startDate: formatDatetimeYear(startDate, locale),
      })}
    </span>
  );
}

function getFormattedAnswer(
  question: Question,
  answers: PublicSignupSchema["answers"],
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
  signup: SignupWithQuota;
  publicQuestions: Question[];
  isGeneratedQuota: boolean;
}) {
  const t = await getTranslations("ilmomasiina");
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
            {signup.confirmed ? t("Hidden") : t("Unconfirmed")}
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
          {signup.quota.title}
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
  quota: QuotaSignups;
  publicQuestions: Question[];
  signupsPublic?: boolean;
}) {
  const t = await getTranslations("ilmomasiina");

  if (!signupsPublic) {
    return <p>{t("Signup information is not public")}</p>;
  }

  const signups = quota.signups;
  if (signups.length === 0) {
    return <p>{t("No signups yet")}</p>;
  }

  const isOpenQuota = quota.type === SignupStatus.IN_OPEN_QUOTA;
  const isQueueQuota = quota.type === SignupStatus.IN_QUEUE;
  const isGeneratedQuota = isOpenQuota || isQueueQuota;

  return (
    <div className="block w-full overflow-x-auto rounded-md border-2 border-gray-900 shadow-solid">
      <table className="w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-200">
            <th className="rounded-tl-md border-b border-gray-900 p-2">
              {t("Position")}
            </th>
            <th className="border-b border-gray-900 p-2">{t("Name")}</th>
            {publicQuestions.map((question) => (
              <th key={question.id} className="border-b border-gray-900 p-2">
                {question.question}
              </th>
            ))}
            {isGeneratedQuota ? (
              <th className="border-b border-gray-900 p-2">{t("Quota")}</th>
            ) : null}
            <th className="rounded-tr-md border-b border-gray-900 p-2">
              {t("Signup time")}
            </th>
          </tr>
        </thead>
        <tbody>
          {signups
            .filter(
              (signup) =>
                isGeneratedQuota || signup.status === SignupStatus.IN_QUOTA,
            )
            .toSorted(
              (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity),
            )
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

async function SignUpList({ event }: { event: UserEventResponse }) {
  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  const t = await getTranslations("ilmomasiina");

  const signupsByQuota = getSignupsByQuota(event);

  const publicQuestions = event.questions.filter((question) => question.public);

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-xl font-semibold text-gray-900">
        {t("Signups")}
      </h2>
      <ul className="space-y-16">
        {signupsByQuota.map((quota) => (
          <li key={quota.id ?? quota.type} className="space-y-2">
            <h3 className="font-mono text-lg font-semibold text-gray-900">
              {quota.type === SignupStatus.IN_OPEN_QUOTA
                ? t("Open quota")
                : quota.type === SignupStatus.IN_QUEUE
                  ? t("Queue")
                  : quota.title}
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

async function Tldr({ event }: { event: UserEventResponse }) {
  const t = await getTranslations("ilmomasiina");
  const locale = await getLocale();
  return (
    <div className="rounded-md border-2 border-gray-900 p-4 shadow-solid md:p-6">
      {event.category ? (
        <span className="block">
          <span className="font-medium">{t("Category")}:</span>{" "}
          <span>{event.category}</span>
        </span>
      ) : null}
      {event.location ? (
        <span className="block">
          <span className="font-medium">{t("Location")}:</span>{" "}
          <span>{event.location}</span>
        </span>
      ) : null}
      {event.date ? (
        <span className="block">
          <span className="font-medium">{t("Starts")}:</span>{" "}
          <DateTime
            rawDate={event.date}
            defaultFormattedDate={formatDatetimeYear(event.date, locale)}
            formatOptions={formatDatetimeYearOptions}
          />
        </span>
      ) : null}
      {event.endDate ? (
        <span className="block">
          <span className="font-medium">{t("Ends")}:</span>{" "}
          <DateTime
            rawDate={event.endDate}
            defaultFormattedDate={formatDatetimeYear(event.endDate, locale)}
            formatOptions={formatDatetimeYearOptions}
          />
        </span>
      ) : null}
      {event.price ? (
        <span className="block">
          <span className="font-medium">{t("Price")}:</span>{" "}
          <span>{event.price}</span>
        </span>
      ) : null}
    </div>
  );
}

async function SignUpQuotas({ event }: { event: UserEventResponse }) {
  if (!event.registrationStartDate || !event.registrationEndDate) {
    return null;
  }

  const t = await getTranslations("ilmomasiina");

  const signupsByQuota = getSignupsByQuota(event);

  return (
    <Card className="max-w-prose space-y-4">
      <h2 className="font-mono text-lg font-semibold text-gray-900">
        {t("Signups")}
      </h2>
      <ul className="flex flex-col gap-2">
        {signupsByQuota.map((quota) => (
          <li key={quota.id ?? quota.type} className="contents">
            {quota.type === SignupStatus.IN_QUEUE ? (
              <span>
                {t("In queue: {queueCount} ({confirmedCount} confirmed)", {
                  queueCount: String(quota.signupCount),
                  confirmedCount: String(
                    quota.signups.filter((s) => s.confirmed).length,
                  ),
                })}
              </span>
            ) : (
              <>
                <span>
                  {quota.type === SignupStatus.IN_OPEN_QUOTA
                    ? t("Open quota")
                    : quota.title}
                </span>
                {typeof quota.size === "number" ? (
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

async function SignUpActions({ event }: { event: UserEventResponse }) {
  const t = await getTranslations("ilmomasiina");
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <div className="max-w-prose space-y-4 rounded-md border-2 border-gray-900 p-4 shadow-solid md:p-6">
      <h2 className="font-mono text-lg font-semibold text-gray-900">
        {t("Signup")}
      </h2>
      <SignUpText
        className="block"
        startDate={event.registrationStartDate}
        endDate={event.registrationEndDate}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SignupButtons event={event} />
      </NextIntlClientProvider>
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

  const locale = await getLocale();
  const event = await fetchEvent(slug, locale);
  if (!event.ok) {
    // eslint-disable-next-line no-console -- nice to know if something goes wrong
    console.warn("Failed to fetch event from Ilmomasiina", event.error);
    return {};
  }

  return {
    title: event.data.title,
    description: event.data.description,
    robots: {
      index: false,
    },
  };
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const locale = await getLocale();

  const event = await fetchEvent(slug, locale);
  const t = await getTranslations("ilmomasiina");
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
          <h1 className="font-mono text-2xl md:text-4xl">{event.data.title}</h1>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4 md:flex-row md:gap-16">
              <div className="flex max-w-xl grow-2 flex-col gap-8">
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
