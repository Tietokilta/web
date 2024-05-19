import { ApolloClient, DocumentNode, gql, InMemoryCache } from "@apollo/client";
import nextResponse from "next";
import API_KEY from "../../../../../../secrets.json";

import { Arrival, ArrivalAttribute, RenderableStop, Stop, StopOutData, StopTime, StopType } from "../../../assets/api_hooks/hsl_api_types.ts";

const STOPS = [["HSL:2222406", "HSL:2222405"], ["HSL:2222603", "HSL:2222604"], ["HSL:2222234", "HSL:2222212"]] // [["HSL:2222234", "HSL:E22259"], ["HSL:2000102"], ["HSL:E0773", "HSL:E0772"]];


export async function GET() {
  console.log("wadafak")

  var dataFromHsl: any[] = []
  for (let stop of STOPS) {
    dataFromHsl.push(await getStop(stop))
  }
  console.log(dataFromHsl)

  const retData = {
    type: "Data",
    data: dataFromHsl
  }

  return Response.json({ retData })
}

export const revalidate = 5;

export const GetStopSchedule = (StopId: string): DocumentNode => gql(`
  {
    stop(id: "${StopId}") {
      name
        stoptimesWithoutPatterns {
        realtimeArrival
        realtimeArrival
        serviceDay
        headsign
        trip{
          routeShortName
        }
      }
    }
  }
`)

function pad(number: number, size: number) {
  var s = String(number);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function removeSubstring(fullString: string): string {
  const subStrings: string[] = [" via Leppävaara",  " via Rautatientori", " via Tapiola (M)", " via Huopalahti as.", " via Tapiola", " via Pasila as."]
  for (let subString of subStrings) {
    fullString = fullString.replace(subString, "");
  }
  return fullString;
}

function isTram(arrival: Arrival): boolean {
  return arrival.route.includes("15")
}
function isMetro(arrival: Arrival): boolean {
  return arrival.route.includes("M")
}
function getType(arrivals: Arrival[]): StopType {
  if (arrivals.length === 0) return null;

  let tram = false;
  let metro = false;
  for (const arrival of arrivals) {
    tram ||= isTram(arrival)
    metro ||= isMetro(arrival)
  }
  if (metro) {
    return "metro"
  } else if (tram) {
    return "tram"
  } else {
    return "bus"
  }

}
function toOutData(stop: any): StopOutData | null {
  if (!stop.stoptimesWithoutPatterns) return null

  return {
    name: stop.name,
    type: stop.type,
    arrival: stop.stoptimesWithoutPatterns.map(
      (arr: StopTime) => ({
        route: arr.trip.routeShortName,
        headSign: arr.headsign,
        realTimeArrival: arr.realtimeArrival + arr.serviceDay,
        serviceDay: arr.serviceDay,
      })
    )
  }
}

export const getData = async (stop: string): Promise<Stop | null> => {
  const client: ApolloClient<object> = new ApolloClient({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    cache: new InMemoryCache(),
    headers: {
      'Content-Type': 'application/json',
      'digitransit-subscription-key': API_KEY["digitransit-subscription-key"],
    }
  })
  var data: object | null = null
  await client.query({
      query: GetStopSchedule(stop),
      fetchPolicy: 'network-only',
    }
  ).then(
    (result) => {
      data = result.data.stop
    }
  )

  return data
}

function makeFullTime(arrival: Arrival): string {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  const currentTSM = hour * 60 + min
  const arrivalTime = Math.floor((arrival.realTimeArrival - arrival.serviceDay) / 60)
  if (arrivalTime - currentTSM > 10) {
    return `${pad(Math.floor((arrival.realTimeArrival - arrival.serviceDay) / 60 / 60) % 24, 2)}:${pad(Math.floor((arrival.realTimeArrival - arrival.serviceDay) / 60 % 60), 2)}`
  }
  const t = Math.max(Math.floor(arrivalTime-currentTSM), 0)
  return t === 0 ? "~0" : String(t)
}
export function checkIfPast(arrival: ArrivalAttribute): boolean {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  const currentTSM = hour * 60 + min
  const arrivalTime = Math.floor((arrival.hours * 60 + arrival.minutes) / 60)
  return arrivalTime-currentTSM < -0.5
}

export const getStop = async (stops: string[], n: number = 7): Promise<RenderableStop | null> => {
  var data: Stop | null = null
  var data2: Stop | null = null
  await getData(stops[0]).then(
    (result: Stop | null) =>(
      data = result)
  )
  await getData(stops[1]).then(
    (result: Stop | null) =>(
      data2 = result)
  )
  if (!data || !data2) return null;

  const result1: StopOutData | null = toOutData(data)
  const result2: StopOutData | null = toOutData(data2)

  if (!result1 || !result2) return null

  const result: StopOutData = {
    name: result1.name,
    type: getType(result1.arrival),
    arrival: result1.arrival.map(
      (arr) => ( arr )
    ).concat(result2.arrival.map(
      (arr) => ( arr ))
    ).sort( (arr1, arr2) => arr1.realTimeArrival - arr2.realTimeArrival
    ).slice(0, n),
  }
  const ArrivalsFormatted: ArrivalAttribute[] = result.arrival.map((arr: Arrival) => ({
    route: arr.route,
    headSign: removeSubstring(arr.headSign),
    hours : Math.floor((arr.realTimeArrival - arr.serviceDay) / 60 / 60) % 24,
    minutes: Math.floor((arr.realTimeArrival - arr.serviceDay) / 60 % 60),
    intTime: arr.realTimeArrival,
    fullTime: makeFullTime(arr)
  }))
  return {
    name: result.name,
    type: result.type,
    arrivals: ArrivalsFormatted,
  }
}
