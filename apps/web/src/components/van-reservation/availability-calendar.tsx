"use client";

import { TZDate } from "@date-fns/tz";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { fi } from "date-fns/locale/fi";
import { useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type View,
  Views,
} from "react-big-calendar";
import "../../custom-pages/event-calendar.css";
import type { BusySlot } from "../../lib/api/external/pakuvaraus";
import { useLocale, useTranslations } from "../../locales/client";

// react-big-calendar draws in the browser's time zone, so give it Dates whose
// local wall clock shows Helsinki time
const helsinkiWallClock = (iso: string) => {
  const time = new TZDate(iso, "Europe/Helsinki");
  return new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    time.getMinutes(),
  );
};

const time = (date: Date) => format(date, "HH:mm");

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { en: enUS, fi },
});

export default function AvailabilityCalendar({ slots }: { slots: BusySlot[] }) {
  const t = useTranslations("calendar");
  const tp = useTranslations("pakuvaraus");
  const locale = useLocale();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(() => new Date());

  const events = slots.map((slot) => ({
    start: helsinkiWallClock(slot.start),
    end: helsinkiWallClock(slot.end),
    title: tp("Reserved"),
  }));

  return (
    <Calendar
      localizer={localizer}
      culture={locale}
      events={events}
      views={[Views.MONTH, Views.WEEK]}
      view={view}
      onView={setView}
      date={date}
      onNavigate={setDate}
      showMultiDayTimes
      popup
      formats={{
        eventTimeRangeFormat: ({ start, end }) => `${time(start)}–${time(end)}`,
        eventTimeRangeStartFormat: ({ start }) => `${time(start)}–`,
        eventTimeRangeEndFormat: ({ end }) => `–${time(end)}`,
      }}
      messages={{
        week: t("Week"),
        month: t("Month"),
        previous: t("Previous"),
        next: t("Next"),
        today: t("Today"),
      }}
    />
  );
}
