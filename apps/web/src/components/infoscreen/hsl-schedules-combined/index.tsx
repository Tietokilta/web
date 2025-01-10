import { HSLSchedule } from "../hsl-schedule";
import { HSLschedules } from "./fetcher.ts";

export const revalidate = 30; // 30 seconds

export async function HSLcombinedSchedule() {
  // Call fetchData immediately and then set up the interval
  const stopData = await HSLschedules();

  const error = stopData.length === 0 ? "Failed to fetch data" : "";

  if (error !== "") {
    return (
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">{error}</h1>
      </div>
    );
  }
  return (
    <div className="w-full flex-row justify-center">
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">
          Aalto-yliopisto (M)
        </h1>
      </div>
      <div className="flex w-full justify-between gap-4 p-8 pt-0">
        {stopData.map((res) => (
          <HSLSchedule
            key={
              res.arrivals[0].headSign ? res.arrivals[0].headSign : "Unknown"
            }
            result={res}
            className="flex flex-col gap-4"
          />
        ))}
      </div>
    </div>
  );
}
