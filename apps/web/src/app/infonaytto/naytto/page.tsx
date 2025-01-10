import { HSLcombinedSchedule } from "../../../components/infoscreen/hsl-schedules-combined";
import { KanttiinitCombined } from "../../../components/infoscreen/kanttiinit-combined";
import InfoScreenSwitcher from "../../../components/infoscreen/infoscreen-switcher/index";

export default function InfoScreenContents() {
  return (
    <InfoScreenSwitcher>
      <HSLcombinedSchedule />
      <KanttiinitCombined />
    </InfoScreenSwitcher>
  );
}
