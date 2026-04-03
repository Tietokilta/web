import { isTruthy } from "remeda";
import { CustomIframe } from "@components/infoscreen/custom-iframe";
import EventListInfoscreen from "@components/infoscreen/events-list";
import { HSLcombinedSchedule } from "@components/infoscreen/hsl-schedules";
import InfoScreenSwitcher from "@components/infoscreen/infoscreen-switcher/index";
import { KanttiinitCombined } from "@components/infoscreen/kanttiinit";
import { fetchInfoScreen } from "@lib/api/info-screen";
import { getLocale } from "@locales/server";

export default async function InfoScreenContents() {
  const locale = await getLocale();
  const infoScreenConfig = await fetchInfoScreen(locale)({});
  if (!infoScreenConfig) {
    return (
      <InfoScreenSwitcher>
        <KanttiinitCombined />
        <EventListInfoscreen />
        <HSLcombinedSchedule />
      </InfoScreenSwitcher>
    );
  }
  return (
    <InfoScreenSwitcher>
      {infoScreenConfig.showKanttiinit ? <KanttiinitCombined /> : null}
      {infoScreenConfig.showEvents ? <EventListInfoscreen /> : null}
      {infoScreenConfig.showHSL ? <HSLcombinedSchedule /> : null}
      {infoScreenConfig.additionalIframes
        ?.filter((iframe) => iframe.enabled)
        .map((iframe, i) => (
          <CustomIframe
            url={iframe.IframeUrl}
            title={iframe.IframeTitle}
            key={iframe.id ?? i}
          />
        ))
        .filter(isTruthy)}
    </InfoScreenSwitcher>
  );
}
