"use client";
import type { UserEventResponse } from "@tietokilta/ilmomasiina-models";
import { useLocale, useTranslations } from "next-intl";
import Countdown from "react-countdown";
import { formatDatetimeYear } from "@lib/utils";
import { SignupButtons } from "./signup-buttons";

export function SignUpText({
  startDate,
  endDate,
  className,
  total,
  seconds,
  isOpen,
}: {
  startDate?: string | null;
  endDate?: string | null;
  className?: string;
  total: number;
  seconds: number;
  isOpen?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("ilmomasiina");
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

  if ((hasStarted || isOpen) && !hasEnded) {
    return (
      <span className={className}>
        {t("Signups open until {endDate}", {
          endDate: formatDatetimeYear(endDate, locale),
        })}
      </span>
    );
  }

  const counter =
    total < 60 * 1000 ? (
      <span className="text-primary-800">{`\u00A0(${seconds.toString()} s)`}</span>
    ) : null;

  return (
    <span className={className}>
      {t("Signups open on {startDate}", {
        startDate: formatDatetimeYear(startDate, locale),
      })}
      {counter}
    </span>
  );
}

export function SignupCountdown({
  event,
  startDate,
  endDate,
}: {
  event: UserEventResponse;
  startDate?: string | null;
  endDate?: string | null;
}) {
  const openingTime = new Date(startDate ?? 0);
  const renderSignupContent = ({
    isOpen,
    seconds,
    total,
  }: {
    isOpen: boolean;
    seconds: number;
    total: number;
  }) => (
    <>
      <SignUpText
        startDate={startDate}
        endDate={endDate}
        total={total}
        seconds={seconds}
        className="block"
        isOpen={isOpen}
      />
      <SignupButtons
        event={event}
        disabled={!isOpen || event.registrationClosed}
      />
    </>
  );

  return (
    <Countdown
      date={openingTime}
      daysInHours
      renderer={({ completed, seconds, total }) =>
        renderSignupContent({ isOpen: completed, seconds, total })
      }
    />
  );
}
