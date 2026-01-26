import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { TZDate } from "@date-fns/tz";
import type {
  HSLResponse,
  StopHSL,
  Stop,
  HSLStopTime,
  StopType,
} from "../types/hsl-helper-types.ts";

interface StopConfig {
  stopType: StopType;
  stops: [string, string];
}
const STOPS = [
  // Metro east and west
  { stopType: "metro", stops: ["HSL:2222603", "HSL:2222604"] },
  // Raide jokeri east and west
  { stopType: "tram", stops: ["HSL:2222406", "HSL:2222405"] },
  // Aalto Yliopisto bus stop "east" and "west"
  { stopType: "bus", stops: ["HSL:2222234", "HSL:2222212"] },
] as const satisfies StopConfig[];

// count of arrivals to render
const N_ARRIVALS = 10;

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key":
        process.env.DIGITRANSIT_SUBSCRIPTION_KEY ?? "",
    },
    fetchOptions: {
      next: {
        revalidate: 30,
      },
    },
  }),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
  cache: new InMemoryCache({
    resultCaching: false,
  }),
  ssrMode: true,
});

const getData = async (stop: string) => {
  try {
    const data = await client
      .query<HSLResponse>({
        // https://api.digitransit.fi/graphiql/hsl/v2/gtfs/v1?query=%257B%250A%2520%2520stop%28id%253A%2520%2522HSL%253A2222234%2522%29%2520%257B%250A%2520%2520%2520%2520name%250A%2520%2520%2520%2520stoptimesWithoutPatterns%2520%257B%250A%2520%2520%2520%2520%2520%2520realtimeArrival%250A%2520%2520%2520%2520%2520%2520serviceDay%250A%2520%2520%2520%2520%2520%2520trip%2520%257B%250A%2520%2520%2520%2520%2520%2520%2520%2520tripHeadsign%250A%2520%2520%2520%2520%2520%2520%2520%2520routeShortName%250A%2520%2520%2520%2520%2520%2520%257D%250A%2520%2520%2520%2520%257D%250A%2520%2520%257D%250A%257D
        query: gql(`
        {
          stop(id: "${stop}") {
            name
              stoptimesWithoutPatterns {
              realtimeArrival
              serviceDay
              trip{
                gtfsId
                tripHeadsign
                routeShortName
              }
            }
          }
        }
`),
      })
      .then((result) => {
        if (!result.data) return null;
        return mapStop(result.data.stop);
      });
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console -- TODO: add actual logger
    console.error(e);
    return null;
  }
};

export async function HSLSchedules() {
  const stops = await Promise.all(STOPS.map(getStop));
  return stops.filter((f) => f !== null);
}

function pad(number: number, size: number) {
  let s = String(number);
  while (s.length < (size || 2)) {
    s = "0".concat(s);
  }
  return s;
}

function mapStop(stop: StopHSL): Omit<Stop, "type"> {
  return {
    name: stop.name,
    arrivals: stop.stoptimesWithoutPatterns
      .map((arr: HSLStopTime) => {
        const tripId = arr.trip.gtfsId;
        const route = arr.trip.routeShortName;
        const headSign = arr.trip.tripHeadsign;
        const arrivalTimeLocal = arr.realtimeArrival + arr.serviceDay;
        const serviceDay = arr.serviceDay;
        const fullTime = makePrintTime(arrivalTimeLocal, serviceDay);
        if (!fullTime) {
          return null;
        }
        return {
          tripId,
          arrivalTimeUnix: arrivalTimeLocal,
          serviceDay,
          route: route ? route.replace(" ", "") : "Null",
          headSign: headSign || "Null",
          hours: Math.floor((arrivalTimeLocal - arr.serviceDay) / 60 / 60) % 24,
          minutes: Math.floor(((arrivalTimeLocal - arr.serviceDay) / 60) % 60),
          fullTime,
        };
      })
      .filter((arr) => arr !== null),
  };
}

function makePrintTime(
  arrivalTimeUnix: number,
  serviceDay: number,
): string | null {
  const date = new TZDate(new Date(), "Europe/Helsinki");
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const secondsFromMidnight = (hour * 60 + min) * 60 + sec;
  const arrivalTime = arrivalTimeUnix - serviceDay;
  if (arrivalTime - secondsFromMidnight > 600) {
    return `${pad(
      Math.floor((arrivalTimeUnix - serviceDay) / 60 / 60) % 24,
      2,
    )}:${pad(Math.floor(((arrivalTimeUnix - serviceDay) / 60) % 60), 2)}`;
  }
  const t1 = Math.floor(arrivalTime - secondsFromMidnight);
  if (t1 < -60) {
    return null;
  }
  const t = Math.floor(Math.max(t1, 0) / 60);
  return t <= 1 ? "~0" : String(t);
}

const getStop = async ({ stopType, stops }: StopConfig) => {
  const [result1, result2] = await Promise.all(stops.map(getData));

  if (!result1 || !result2) return null;

  const result: Stop = {
    name: result1.name,
    type: stopType,
    arrivals: result1.arrivals
      .concat(result2.arrivals)
      .sort((arr1, arr2) => arr1.arrivalTimeUnix - arr2.arrivalTimeUnix)
      .slice(0, N_ARRIVALS),
  };
  return result;
};
