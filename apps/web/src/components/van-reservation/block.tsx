import { getMessages } from "next-intl/server";
import type { JSX } from "react";
import { fetchBusySlots } from "../../lib/api/external/pakuvaraus";
import { NextIntlClientProvider } from "../../locales/client";
import { getLocale, getTranslations } from "../../locales/server";
import { AvailabilityCalendar, ReservationForm } from "./lazy";

// OPEN QUESTION: membership check. The form asks nothing about membership and
// pakuvaraus does not check it either.
export async function VanReservation(): Promise<JSX.Element> {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("pakuvaraus");
  const tErrors = await getTranslations("errors");
  const busySlots = await fetchBusySlots();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <section className="not-prose my-8 flex flex-col items-center gap-8">
        <div className="w-full space-y-2">
          <h3 className="font-mono text-xl">{t("Availability")}</h3>
          <p className="text-sm">{t("Times are in Finnish time")}</p>
          {busySlots.ok ? (
            <div className="h-160">
              <AvailabilityCalendar slots={busySlots.data} />
            </div>
          ) : (
            <p className="text-red-600">{tErrors(busySlots.error)}</p>
          )}
        </div>
        <ReservationForm />
      </section>
    </NextIntlClientProvider>
  );
}
