import Link from "next/link";
import {
  type QuotaWithSignupCount,
  type UserEventListItem,
} from "@tietokilta/ilmomasiina-models";
import {
  cn,
  formatDateTime,
  formatDateTimeOptions,
  formatDateYear,
  formatDateYearOptions,
  formatDatetimeYear,
} from "@lib/utils.ts";
import { getLocale, getTranslations } from "next-intl/server";
import { DateTime } from "../datetime";

async function SignUpText({
  startDate,
  endDate,
  className,
  compact = false,
}: {
  startDate?: string | null;
  endDate?: string | null;
  className?: string;
  compact?: boolean;
}) {
  const locale = await getLocale();
  const t = await getTranslations("ilmomasiina.status");
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

  if (compact) {
    if (hasStarted && !hasEnded) {
      return (
        <span className={className}>
          {t("Ilmo auki", {
            endDate: formatDatetimeYear(endDate, locale),
          })}
        </span>
      );
    }
    return (
      <span className={className}>
        {t("Ilmo alkaa", {
          startDate: formatDatetimeYear(startDate, locale),
        })}
      </span>
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

async function SignupQuotas({
  quotas,
  className,
  compact = false,
}: {
  quotas: QuotaWithSignupCount[];
  className?: string;
  compact?: boolean;
}) {
  const t = await getTranslations("ilmomasiina");
  const totalSignupCount = quotas.reduce(
    (acc, quota) => acc + quota.signupCount,
    0,
  );
  const totalSize = quotas.reduce((acc, quota) => acc + (quota.size ?? 0), 0);

  const isSingleQuota = quotas.length === 1;

  // Compact Mode is used on infoscreen
  if (compact) {
    return (
      <ul className={cn(className, "text-xl")}>
        <li className="flex w-full justify-between gap-4 whitespace-nowrap font-medium">
          <span className="w-3/4">{t("Ilmoittautuneita")}</span>{" "}
        </li>
        {quotas.map((quota) => (
          <li
            className="flex w-full justify-between gap-4 whitespace-nowrap"
            key={quota.id}
          >
            <span className="w-1/2 truncate">{quota.title}</span>{" "}
            {typeof quota.size === "number" ? (
              <span className="w-1/2 text-right">
                {quota.signupCount} / {quota.size}
              </span>
            ) : (
              <span className="w-1/4 text-right">{quota.signupCount}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (isSingleQuota) {
    return (
      <div className={className}>
        <span className="flex w-full justify-between gap-4 whitespace-nowrap font-medium">
          <span className="w-3/4">{t("Ilmoittautuneita")}</span>{" "}
          <span className="w-1/4 text-left">
            {totalSignupCount} / {totalSize}
          </span>
        </span>
      </div>
    );
  }

  return (
    <ul className={cn(className)}>
      <li className="flex w-full justify-between gap-4 whitespace-nowrap font-medium">
        <span className="w-3/4">{t("Ilmoittautuneita")}</span>{" "}
        <span className="w-1/4 text-left">
          {totalSignupCount} / {totalSize}
        </span>
      </li>
      {quotas.map((quota) => (
        <li
          className="flex w-full justify-between gap-4 whitespace-nowrap"
          key={quota.id}
        >
          <span className="w-3/4 truncate">{quota.title}</span>{" "}
          {typeof quota.size === "number" ? (
            <span className="w-1/4 text-left">
              {quota.signupCount} / {quota.size}
            </span>
          ) : (
            <span className="w-1/4 text-left">{quota.signupCount}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export async function EventCardCompact({
  event,
  showSignup = true,
}: {
  event: UserEventListItem;
  showSignup: boolean;
}) {
  let showSignupQuotas = true;
  const signupStartDate = event.registrationStartDate;
  const signupEndDate = event.registrationEndDate;
  const hasSignup = event.registrationStartDate && event.registrationEndDate;

  if (!signupEndDate || !signupStartDate) {
    showSignupQuotas = false;
  }

  const t = await getTranslations("ilmomasiina");

  const locale = await getLocale();
  return (
    <li className="relative flex flex-col gap-2 rounded-md border-2 border-gray-900 bg-gray-100 px-3 py-1 shadow-solid">
      <div className="flex flex-row justify-between">
        <div className={`flex grow ${showSignupQuotas ? "flex-col" : ""}`}>
          <Link
            href={`/${locale}/${t("path.events")}/${event.slug}`}
            className="text-pretty text-lg font-bold underline-offset-2 before:absolute before:left-0 before:top-0 before:z-0 before:block before:size-full before:cursor-[inherit] group-hover:underline"
          >
            <h2 className="text-2xl">
              {event.title}
              <br />
              {event.date ? (
                <DateTime
                  rawDate={event.date}
                  defaultFormattedDate={formatDateTime(event.date, locale)}
                  formatOptions={formatDateTimeOptions}
                  className="text-l font-normal"
                />
              ) : null}
            </h2>
          </Link>

          {showSignupQuotas ? (
            <SignUpText
              className="text-xl"
              endDate={event.registrationEndDate}
              startDate={event.registrationStartDate}
              compact
            />
          ) : null}
        </div>
        {event.quotas.length > 0 && showSignup && hasSignup ? (
          <SignupQuotas
            className="ml-5 w-1/3 shrink-0"
            quotas={event.quotas.filter(
              (quota) =>
                // Filter out quotas that are not meant for general signups
                !(
                  /järkkä|järjestä|häry|häirintäyhdyshenkilö|lukka/i.test(
                    quota.title,
                  ) ||
                  (quota.size && quota.size <= 5)
                ),
            )}
            compact
          />
        ) : (
          <span>
            <h3 className="text-xl font-medium">{t("Ei ilmoittautumista")}</h3>
          </span>
        )}
      </div>
    </li>
  );
}

export default async function EventCard({
  event,
}: {
  event: UserEventListItem;
}) {
  const t = await getTranslations("ilmomasiina.path");
  const hasSignup = event.registrationStartDate && event.registrationEndDate;

  const locale = await getLocale();
  return (
    <li className="group relative flex max-w-4xl flex-col gap-2 rounded-md border-2 border-gray-900 bg-gray-100 p-4 shadow-solid md:flex-row md:gap-4 md:p-6">
      <Link
        href={`/${locale}/${t("events")}/${event.slug}`}
        className="text-pretty text-lg font-bold underline-offset-2 before:absolute before:left-0 before:top-0 before:z-0 before:block before:size-full before:cursor-[inherit] group-hover:underline md:w-1/3"
      >
        <h2>{event.title}</h2>
      </Link>

      {event.date ? (
        <DateTime
          className="md:w-1/6"
          rawDate={event.date}
          defaultFormattedDate={formatDateYear(event.date, locale)}
          formatOptions={formatDateYearOptions}
        />
      ) : (
        <div className="md:w-1/6" />
      )}
      <SignUpText
        className="md:w-1/4"
        endDate={event.registrationEndDate}
        startDate={event.registrationStartDate}
      />
      {event.quotas.length > 0 && hasSignup ? (
        <SignupQuotas className="md:w-1/4" quotas={event.quotas} />
      ) : null}
    </li>
  );
}
