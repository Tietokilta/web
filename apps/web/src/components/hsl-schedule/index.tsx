'use-client'
import { checkIfPast } from "../../assets/api_hooks/hsl_api_hooks.ts";
import type { RenderableStop, StopType } from "../../assets/api_hooks/hsl_api_types.ts";
import { useState, useEffect } from "react";

export function HSLSchedule(props: any) {
  const [result, setResult] = useState<RenderableStop>(props.result);
  useEffect(() => {
    setResult(props.result);
  }, [props.result]);

  console.log("Here", result)

  const colorMetro = "#ca4000";
  const colorTram = "#007e79";
  const colorBus = "#007ac9";
  const colorNull = "gray-900";
  console.log("Hello There")

  const getColor = (): string => {
    if (result.type === "metro") {
      return colorMetro;
    } else if (result.type === "tram") {
      return colorTram;
    } else if (result.type === "bus") {
      return colorBus;
    } else {
      return colorNull;
    }
  };

  const className = `shadow-solid shadow-[var(--infonayttoHSLcolor)] text-l flex flex-col justify-between rounded-md border-2 border-[var(--infonayttoHSLcolor)] p-3 font-mono text-gray-900 md:flex-row md:items-center`;

  const stopName = (type: StopType) => {
    if (type === "metro") {
      return "Metro";
    } else if (type === "tram") {
      return "Raidejokeri";
    } else if (type === "bus") {
      return "Bussit";
    } else {
      return "Unknown";
    }
  };
  console.log(result);
  return (
    <div className="h-full items-center w-full gap-4" style={{ "--infonayttoHSLcolor": getColor() } as React.CSSProperties}>
      <h1 className='font-mono flex text-2xl p-2 h-[3rem] text-[var(--infonayttoHSLcolor)] font-bold justify-center w-full'>{stopName(result.type)}</h1>
      <ul className="space-y-2 font-bold justify-between">
        {
          result.arrivals.filter( (arr) => checkIfPast(arr)).map((arr) => (
            <li key={arr.route + arr.fullTime} className={className}>
              <div className='text-2xl text-[var(--infonayttoHSLcolor)]'>{arr.route}</div>
              <div className='text-xl'>{arr.headSign}</div>
              <div className='text-2xl'>{arr.fullTime}</div>

            </li>
          ))
        }
      </ul>

    </div>
  );
}
