import { getTranslations } from "@locales/server";
import type { Stop, StopType } from "../types/hsl-helper-types";
import { HSLSchedules } from "./fetcher";

const getColor = (type: StopType): string => {
  switch (type) {
    case "metro":
      return "#ca4000";
    case "tram":
      return "#007e79";
    case "bus":
      return "#007ac9";
  }
};

const stopName = async (type: StopType) => {
  const t = await getTranslations("infoscreen");
  switch (type) {
    case "metro":
      return t("Metro");
    case "tram":
      return t("Raide-Jokeri");
    case "bus":
      return t("Buses");
  }
};
interface HSLScheduleProps {
  stop: Stop;
  className: string;
}

function HSLSchedule({ stop }: HSLScheduleProps) {
  return (
    <div
      className="size-full items-center gap-4"
      style={
        { "--infonayttoHSLcolor": getColor(stop.type) } as React.CSSProperties
      }
    >
      <h1 className="flex h-12 w-full justify-center p-2 font-mono text-3xl font-bold text-(--infonayttoHSLcolor)">
        {stopName(stop.type)}
      </h1>
      <ul className="space-y-4 font-bold">
        {stop.arrivals.map((arr) => (
          <li
            key={`${arr.route}-${arr.headSign}-${arr.arrivalTimeUnix}`}
            className="grid grid-cols-[1fr_2fr_1fr] items-center rounded-md border-2 border-(--infonayttoHSLcolor) p-3 font-mono text-gray-900 shadow-(--infonayttoHSLcolor) shadow-solid md:items-center"
          >
            <div className="text-left text-3xl text-(--infonayttoHSLcolor)">
              {arr.route}
            </div>
            <div className="text-center text-2xl">{arr.headSign}</div>
            <div className="text-right text-3xl">{arr.fullTime}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function HSLcombinedSchedule() {
  const stopData = await HSLSchedules();
  const t = await getTranslations("infoscreen");

  if (stopData.length === 0) {
    return null;
  }
  return (
    <div className="w-full flex-row justify-center">
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-4xl font-bold">
          {t("Aalto-university")}
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
