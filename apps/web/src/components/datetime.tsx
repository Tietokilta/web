"use client";

import { useEffect, useRef } from "react";
import {
  type GetDateTimeFormatterOptions,
  getDateTimeFormatter,
} from "../lib/utils";
import { useCurrentLocale } from "../locales/client";

interface SharedProps {
  defaultFormattedDate: string;
  rawDate: string;
  formatOptions: GetDateTimeFormatterOptions;
}
type TimeProps = SharedProps &
  Omit<React.HTMLProps<HTMLTimeElement>, "dateTime"> & {
    as?: "time";
  };
type SpanProps = SharedProps &
  React.HTMLProps<HTMLSpanElement> & {
    as?: "span";
  };
type Props = TimeProps | SpanProps;

export function DateTime({
  defaultFormattedDate,
  rawDate,
  formatOptions,
  as = "time",
  ...rest
}: Props) {
  const ref = useRef<HTMLTimeElement | HTMLSpanElement | null>(null);
  const locale = useCurrentLocale();

  useEffect(() => {
    if (ref.current) {
      const formatFn = getDateTimeFormatter(formatOptions);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      ref.current.textContent = formatFn(rawDate, locale, timeZone);
    }
  }, [formatOptions, rawDate, locale]);

  const Component = as;

  return (
    <Component
      // @ts-expect-error -- I don't know how to fix this error since the component is dynamic, some TS Wizard can try, but it's not worth the time
      ref={ref}
      dateTime={as === "time" ? rawDate : undefined}
      {...rest}
    >
      {defaultFormattedDate}
    </Component>
  );
}
