"use client";
import type {
  ArrivalAttribute,
  RenderableStop,
  StopType,
} from "../../lib/types/hsl-helper-types";

export function HSLSchedule(props: {
  result: RenderableStop;
  className: string;
}) {
  const result = props.result;

  const colorMetro = "#ca4000";
  const colorTram = "#007e79";
  const colorBus = "#007ac9";
  const colorNull = "gray-900";

  const getColor = (): string => {
    if (result.type === "metro") {
      return colorMetro;
    } else if (result.type === "tram") {
      return colorTram;
    } else if (result.type === "bus") {
      return colorBus;
    }
    return colorNull;
  };

  const className = `shadow-solid shadow-[var(--infonayttoHSLcolor)] text-l flex flex-col justify-between rounded-md border-2 border-[var(--infonayttoHSLcolor)] p-3 font-mono text-gray-900 md:flex-row md:items-center`;

  const stopName = (type: StopType) => {
    if (type === "metro") {
      return "Metro";
    } else if (type === "tram") {
      return "Raidejokeri";
    } else if (type === "bus") {
      return "Bussit";
    }
    return "Unknown";
  };
  return (
    <div
      className="size-full items-center gap-4"
      style={{ "--infonayttoHSLcolor": getColor() } as React.CSSProperties}
    >
      <h1 className="flex h-12 w-full justify-center p-2 font-mono text-2xl font-bold text-[var(--infonayttoHSLcolor)]">
        {stopName(result.type)}
      </h1>
      <ul className="space-y-4 font-bold">
        {result.arrivals
          /*These are here to prevent the async useEffect from including extraneous data here*/
          .filter((arr) => arr.fullTime !== "NaN")
          .sort(
            (arr1: ArrivalAttribute, arr2: ArrivalAttribute) =>
              arr1.realtimeArrival - arr2.realtimeArrival,
          )
          .slice(0, 10)
          .map((arr) => (
            <li
              key={arr.route + arr.headSign + arr.fullTime}
              className={className}
            >
              <div className="w-[15%] text-2xl text-[var(--infonayttoHSLcolor)]">
                {arr.route}
              </div>
              <div className="w-1/2 text-xl">{arr.headSign}</div>
              <div className="w-[35‰] text-right text-2xl">{arr.fullTime}</div>
            </li>
          ))}
      </ul>
    </div>
  );
}
