import { isTruthy } from "remeda";
import { HSLcombinedSchedule } from "@components/infoscreen/hsl-schedules";
import { KanttiinitCombined } from "@components/infoscreen/kanttiinit";
import InfoScreenSwitcher from "@components/infoscreen/infoscreen-switcher/index";
import EventListInfoscreen from "@components/infoscreen/events-list";
import { fetchInfoScreen } from "@lib/api/info-screen";
import { getLocale } from "next-intl/server";
import { CustomIframe } from "@components/infoscreen/custom-iframe";

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
