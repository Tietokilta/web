import { HSLcombinedSchedule } from "../../../../../components/infoscreen/hsl-schedules-combined";
import { KanttiinitCombined } from "../../../../../components/infoscreen/kanttiinit-combined";
import InfoScreenSwitcher from "../../../../../components/infoscreen/infoscreen-switcher/index";
import { EventsDisplay } from "../../../../../components/events-display";

export const dynamic = "force-dynamic";

export default function InfoScreenContents() {
  return (
    <InfoScreenSwitcher>
      <HSLcombinedSchedule />
      <KanttiinitCombined />
      <EventsDisplay />
    </InfoScreenSwitcher>
  );
}
