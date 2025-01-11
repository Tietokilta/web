import type { Stop, StopType } from "../types/hsl-helper-types.ts";

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

const stopName = (type: StopType) => {
  switch (type) {
    case "metro":
      return "Metro";
    case "tram":
      return "Raide-Jokeri";
    case "bus":
      return "Bussit";
  }
};
interface HSLScheduleProps {
  stop: Stop;
  className: string;
}

export function HSLSchedule({ stop }: HSLScheduleProps) {
  return (
    <div
      className="size-full items-center gap-4"
      style={
        { "--infonayttoHSLcolor": getColor(stop.type) } as React.CSSProperties
      }
    >
      <h1 className="flex h-12 w-full justify-center p-2 font-mono text-2xl font-bold text-[var(--infonayttoHSLcolor)]">
        {stopName(stop.type)}
      </h1>
      <ul className="space-y-4 font-bold">
        {stop.arrivals.map((arr) => (
          <li
            key={arr.route + arr.headSign + arr.fullTime}
            className="shadow-solid flex flex-col items-center justify-between rounded-md border-2 border-[var(--infonayttoHSLcolor)] p-3 font-mono text-gray-900 shadow-[var(--infonayttoHSLcolor)] md:flex-row md:items-center"
          >
            <div className="text-left text-2xl text-[var(--infonayttoHSLcolor)]">
              {arr.route}
            </div>
            <div className="text-center text-xl">{arr.headSign}</div>
            <div className="text-right text-2xl">{arr.fullTime}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
