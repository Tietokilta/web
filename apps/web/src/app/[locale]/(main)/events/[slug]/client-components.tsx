"use client";

import { Button, type ButtonProps } from "@tietokilta/ui";
import React, { useEffect, useState } from "react";
import {
  I18nProviderClient,
  useCurrentLocale,
  useScopedI18n,
} from "@/locales/client";

export function AutoEnableButton({
  startDate,
  endDate,
  ...props
}: React.PropsWithChildren<
  Omit<ButtonProps, "disabled"> & { startDate: string; endDate: string }
>) {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const tick = () => {
      console.log("button tick", props.children);
      const hasStarted = new Date(startDate) < new Date();
      const hasEnded = new Date(endDate) < new Date();
      setIsDisabled(!hasStarted || hasEnded);
    };

    if (new Date(startDate) < new Date()) {
      setIsDisabled(false);
      return;
    }

    tick();
    const interval = setInterval(tick, 500);

    return () => {
      clearInterval(interval);
    };
  }, [startDate, endDate, props.children]);

  return <Button disabled={isDisabled} {...props} />;
}

const oneMinuteMs = 1000 * 60;

function CountdownUnwrapped({ startDate }: { startDate: string }) {
  const t = useScopedI18n("ilmomasiina.countdown");
  const [timeToStart, setTimeToStart] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      console.log("countdown tick");
      const hasStarted = new Date(startDate) < new Date();
      if (hasStarted) {
        setTimeToStart(null);
        return;
      }

      const newTimeToStart =
        new Date(startDate).getTime() - new Date().getTime();

      setTimeToStart(newTimeToStart);
    };

    if (new Date(startDate) < new Date()) {
      return;
    }

    tick();
    const interval = setInterval(tick, 500);

    return () => {
      clearInterval(interval);
    };
  }, [startDate]);

  if (!timeToStart || timeToStart < 0 || timeToStart > oneMinuteMs) {
    return null;
  }

  return (
    <div>
      {t("Starting in {seconds} seconds", {
        seconds: Math.floor(timeToStart / 1000),
      })}
    </div>
  );
}

export function Countdown(
  props: React.ComponentProps<typeof CountdownUnwrapped>,
) {
  const locale = useCurrentLocale();

  return (
    <I18nProviderClient locale={locale}>
      <CountdownUnwrapped {...props} />
    </I18nProviderClient>
  );
}
