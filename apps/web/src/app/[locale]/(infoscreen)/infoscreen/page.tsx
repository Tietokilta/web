import { HSLcombinedSchedule } from "../../../../components/infoscreen/hsl-schedules-combined";
import { KanttiinitCombined } from "../../../../components/infoscreen/kanttiinit-combined";
import InfoScreenSwitcher from "../../../../components/infoscreen/infoscreen-switcher/index";
import EventListInfoscreen from "../../../../components/infoscreen/events-list";

export const dynamic = "force-dynamic";

export default function InfoScreenContents() {
  return (
    <InfoScreenSwitcher>
      <HSLcombinedSchedule />
      <KanttiinitCombined />
      <EventListInfoscreen />
    </InfoScreenSwitcher>
  );
}
