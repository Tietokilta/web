import { HSLSchedule } from "../../../../components/hsl-schedule";
const STOPS: string[][] = [["HSL:2222406", "HSL:2222405"], ["HSL:2222603", "HSL:2222604"], ["HSL:2222234", "HSL:2222212"]] // [["HSL:2222234", "HSL:E22259"], ["HSL:2000102"], ["HSL:E0773", "HSL:E0772"]];

export function InfoScreen() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex w-[90%] justify-between">
        {STOPS.map(stops => (<HSLSchedule stops={stops} className="flex flex-col" />))}
      </div>
    </div>
  );
}

export default InfoScreen;
