import { isTruthy } from "remeda";
import { CustomIframe } from "@components/infoscreen/custom-iframe";
import EventListInfoscreen from "@components/infoscreen/events-list";
import { HSLcombinedSchedule } from "@components/infoscreen/hsl-schedules";
import InfoScreenSwitcher, {
  type InfoScreenItem,
} from "@components/infoscreen/infoscreen-switcher/index";
import { KanttiinitCombined } from "@components/infoscreen/kanttiinit";
import { fetchInfoScreen } from "@lib/api/info-screen";
import { getLocale, getTranslations } from "@locales/server";

export default async function InfoScreenContents() {
  const locale = await getLocale();
  const [tInfoscreen, tIlmo, infoScreenConfig] = await Promise.all([
    getTranslations("infoscreen"),
    getTranslations("ilmomasiina"),
    fetchInfoScreen(locale)({}),
  ]);

  const showKanttiinit = infoScreenConfig?.showKanttiinit ?? true;
  const showEvents = infoScreenConfig?.showEvents ?? true;
  const showHSL = infoScreenConfig?.showHSL ?? true;

  const iframeItems: InfoScreenItem[] =
    infoScreenConfig?.additionalIframes
      ?.filter((iframe) => iframe.enabled)
      .map((iframe) => ({
        title: iframe.IframeTitle,
        content: (
          <CustomIframe url={iframe.IframeUrl} title={iframe.IframeTitle} />
        ),
      })) ?? [];

  const items: InfoScreenItem[] = [
    showKanttiinit
      ? { title: tInfoscreen("Menus"), content: <KanttiinitCombined /> }
      : null,
    showEvents
      ? { title: tIlmo("Events"), content: <EventListInfoscreen /> }
      : null,
    showHSL
      ? {
          title: tInfoscreen("Aalto-university"),
          content: <HSLcombinedSchedule />,
        }
      : null,
    ...iframeItems,
  ].filter(isTruthy);

  return <InfoScreenSwitcher items={items} />;
}
