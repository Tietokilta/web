import { HSLSchedule } from "../hsl-schedule";
import { HSLSchedules } from "./fetcher.ts";

export async function HSLcombinedSchedule() {
  const stopData = await HSLSchedules();

  if (stopData.length === 0) {
    return null;
  }
  return (
    <div className="w-full flex-row justify-center">
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">
          Aalto-yliopisto (M)
        </h1>
      </div>
      <div className="flex w-full justify-between gap-4 p-8 pt-0">
        {stopData.map((stop) => (
          <HSLSchedule
            key={stop.name + stop.type}
            stop={stop}
            className="flex flex-col gap-4"
          />
        ))}
      </div>
    </div>
  );
}
