import { HSLcombinedSchedule } from "@components/infoscreen/hsl-schedules";
import { KanttiinitCombined } from "@components/infoscreen/kanttiinit";
import InfoScreenSwitcher from "@components/infoscreen/infoscreen-switcher/index";
import EventListInfoscreen from "@components/infoscreen/events-list";

export const dynamic = "force-dynamic";

export default function InfoScreenContents() {
  return (
    <InfoScreenSwitcher>
      <KanttiinitCombined />
      <EventListInfoscreen />
      <HSLcombinedSchedule />
    </InfoScreenSwitcher>
  );
}
