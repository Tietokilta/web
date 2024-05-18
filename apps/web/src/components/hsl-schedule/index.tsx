import { getData } from "../../assets/api_hooks/hsl_api_hooks.ts";
import type { Stop, StopOutData, StopTime } from "../../assets/api_hooks/hsl_api_types.ts";

function pad(number: number, size: number) {
  var s = String(number);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function toOutData(stop: any): StopOutData | null {
  if (!stop.stoptimesWithoutPatterns) return null

  return {
    name: stop.name,
    arrival: stop.stoptimesWithoutPatterns.map(
      (arr: StopTime) => ({
        route: arr.trip.routeShortName,
        headSign: arr.headsign,
        realTimeArrival: arr.realtimeArrival,
        serviceDay: arr.serviceDay,
      })
    )
  }
}

export async function HSLSchedule(props: any) {
  var data: Stop | null = null
  var data2: Stop | null = null
  await getData(props.stops[0]).then(
    (result: Stop | null) =>(
      data = result)
  )
  await getData(props.stops[1]).then(
    (result: Stop | null) =>(
      data2 = result)
  )
  if (!data || !data2) return null;

  console.log("data", data)

  const result1: StopOutData | null = toOutData(data)
  const result2: StopOutData | null = toOutData(data2)

  if (!result1 || !result2) return null

  const result: StopOutData = {
    name: result1.name,
    arrival: result1.arrival.map(
      (arr) => ( arr )
    ).concat(result2.arrival.map(
      (arr) => ( arr ))
    ).sort( (arr1, arr2) => arr1.realTimeArrival - arr2.realTimeArrival
    ),
  }

return (
      <div>
        <h2 className="font-bold">{result1.name}</h2>
        {result.arrival.map( arr => (<p>{arr.route + " " + arr.headSign + " " + pad(Math.floor(arr.realTimeArrival / 60 / 60) % 24, 2) + ":" + pad(Math.floor(arr.realTimeArrival / 60 % 60), 2) }</p>))}
      </div>
    );
}
