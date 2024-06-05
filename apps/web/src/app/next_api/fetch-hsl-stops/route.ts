import type {
  ApolloQueryResult,
  DefaultOptions,
  DocumentNode,
} from "@apollo/client";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import type {
  Arrival,
  ArrivalAttribute,
  Data,
  RenderableStop,
  Stop,
  StopFromApi,
  StopOutData,
  StopTime,
  StopType,
} from "../../../lib/types/hsl-helper-types.ts";

const STOPS = [
  ["HSL:2222603", "HSL:2222604"],
  ["HSL:2222406", "HSL:2222405"],
  ["HSL:2222234", "HSL:2222212"],
];
const N_ARRIVALS = 6;

export const dynamic = "force-dynamic";

export async function GET() {
  const dataFromHsl: RenderableStop[] = [];

  const stopPromises = STOPS.map(async (stop) => {
    return await getStop(stop[0], stop[1]);
  });

  // Wait for all promises to resolve
  const stops = await Promise.all(stopPromises);

  // Filter out null values and add to dataFromHsl
  stops.forEach((stop) => {
    if (stop) dataFromHsl.push(stop);
  });

  const retData = {
    type: "Data",
    data: dataFromHsl,
  };

  return Response.json(
    { retData },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache, no-store",
        Expires: "0",
      },
    },
  );
}

const GetStopSchedule = (StopId: string): DocumentNode =>
  gql(`
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
`);

function pad(number: number, size: number) {
  let s = String(number);
  while (s.length < (size || 2)) {
    s = "0".concat(s);
  }
  return s;
}

function removeSubstring(fullString: string): string {
  const subStrings: string[] = [
    " via Leppävaara",
    " via Rautatientori",
    " via Tapiola (M)",
    " via Huopalahti as.",
    " via Tapiola",
    " via Pasila as.",
  ];
  let str = fullString;
  for (const subString of subStrings) {
    // HSL sometimes has a bug where HEadSign is null so this handles case string in is null :D
    if (str) {
      str = str.replace(subString, "");
    } else {
      ("Null");
    }
  }
  return str;
}

function isTram(arrival: Arrival): boolean {
  return arrival.route.includes("15");
}
function isMetro(arrival: Arrival): boolean {
  return arrival.route.includes("M");
}
function getType(arrivals: Arrival[]): StopType {
  if (arrivals.length === 0) return null;
  const arrival = arrivals[0];
  if (isMetro(arrival)) {
    return "metro";
  } else if (isTram(arrival)) {
    return "tram";
  }
  return "bus";
}
function toOutData(stop: Stop | null): StopOutData | null {
  if (!stop) return null;
  return {
    name: stop.name,
    type: stop.type,
    arrival: stop.stoptimesWithoutPatterns.map((arr: StopTime) => ({
      route: arr.trip.routeShortName,
      headSign: arr.headsign,
      realTimeArrival: arr.realtimeArrival + arr.serviceDay,
      serviceDay: arr.serviceDay,
    })),
  };
}

const getData = async (stop: string): Promise<Stop | null> => {
  const defaultOptions: DefaultOptions = {
    query: {
      fetchPolicy: "no-cache",
    },
  };

  const client = new ApolloClient<object>({
    uri: "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
    cache: new InMemoryCache({
      resultCaching: false,
    }),
    defaultOptions,
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key":
        process.env.DIGITRANSIT_SUBSCRIPTION_KEY ?? "",
    },
  });
  let data: StopFromApi | null = null;

  await client
    .query({
      query: GetStopSchedule(stop),
    })
    .then((result: ApolloQueryResult<Data>) => {
      data = result.data.stop;
    });

  return data;
};

function makePrintTime(arrival: Arrival): string {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const currentTSM = (hour * 60 + min) * 60 + sec;
  let arrivalTime = arrival.realTimeArrival - arrival.serviceDay;
  if (Math.floor(arrivalTime / 3600) >= 24) {
    arrivalTime -= 24 * 3600;
  }
  if (arrivalTime - currentTSM > 600) {
    return `${pad(
      Math.floor((arrival.realTimeArrival - arrival.serviceDay) / 60 / 60) % 24,
      2,
    )}:${pad(
      Math.floor(((arrival.realTimeArrival - arrival.serviceDay) / 60) % 60),
      2,
    )}`;
  }
  const t1 = Math.floor(arrivalTime - currentTSM);
  if (t1 < -60) {
    return "NaN";
  }
  const t = Math.floor(Math.max(t1, 0) / 60);
  return t <= 1 ? "~0" : String(t);
}

const getStop = async (
  first: string,
  second: string,
  n = N_ARRIVALS,
): Promise<RenderableStop | null> => {
  let data: Stop | null = null;
  let data2: Stop | null = null;
  await getData(first).then((result: Stop | null) => (data = result));
  await getData(second).then((result: Stop | null) => (data2 = result));

  const result1: StopOutData | null = toOutData(data);
  const result2: StopOutData | null = toOutData(data2);

  if (!result1 || !result2) return null;

  const result: StopOutData = {
    name: result1.name,
    type: getType(result1.arrival),
    arrival: result1.arrival
      .map((arr) => arr)
      .concat(result2.arrival.map((arr) => arr))
      .sort((arr1, arr2) => arr1.realTimeArrival - arr2.realTimeArrival)
      .slice(0, n + 1),
  };
  const ArrivalsFormatted: ArrivalAttribute[] = result.arrival
    .map((arr: Arrival) => {
      return {
        route: arr.route ? arr.route.replace(" ", "") : "Null",
        headSign: removeSubstring(arr.headSign),
        hours:
          Math.floor((arr.realTimeArrival - arr.serviceDay) / 60 / 60) % 24,
        minutes: Math.floor(((arr.realTimeArrival - arr.serviceDay) / 60) % 60),
        intTime: arr.realTimeArrival,
        fullTime: makePrintTime(arr),
      };
    })
    .filter((arr) => arr.fullTime !== "NaN");
  return {
    name: result.name,
    type: result.type,
    arrivals: ArrivalsFormatted,
  };
};
