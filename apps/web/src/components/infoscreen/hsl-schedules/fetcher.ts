import { TZDate } from "@date-fns/tz";
import { unstable_noStore as noStore } from "next/cache";
import { env } from "../../../env";
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
const REFRESH_INTERVAL_MS = 15_000;
const ACTIVE_CLIENT_WINDOW_MS = 60_000;
const DIGITRANSIT_URI = "https://api.digitransit.fi/routing/v2/hsl/gtfs/v1";

const cachedSchedules = new Map<StopType, Stop>();
let lastRefreshAttemptAt = 0;
let lastAccessAt = 0;
let refreshPromise: Promise<void> | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;

interface DigitransitGraphQLResponse {
  data?: HSLResponse;
  errors?: unknown;
}

const makeStopQuery = (stop: string) => `
  {
    stop(id: "${stop}") {
      name
      stoptimesWithoutPatterns {
        realtimeArrival
        serviceDay
        trip {
          tripHeadsign
          routeShortName
        }
      }
    }
  }
`;

const getData = async (stop: string) => {
  try {
    const response = await fetch(DIGITRANSIT_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "digitransit-subscription-key": env.DIGITRANSIT_SUBSCRIPTION_KEY ?? "",
      },
      body: JSON.stringify({
        query: makeStopQuery(stop),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Digitransit request for stop ${stop} failed with status ${String(response.status)}`,
      );
    }

    const result = (await response.json()) as DigitransitGraphQLResponse;

    if (!result.data?.stop) {
      if (result.errors) {
        // eslint-disable-next-line no-console -- TODO: add actual logger
        console.error(result.errors);
      }
      return null;
    }

    return mapStop(result.data.stop);
  } catch (error) {
    // eslint-disable-next-line no-console -- TODO: add actual logger
    console.error(error);
    return null;
  }
};

export async function HSLSchedules() {
  noStore();
  noteClientAccess();

  if (cachedSchedules.size === 0) {
    await refreshSchedules();
  } else if (shouldRefresh()) {
    void refreshSchedules();
  }

  return getCachedScheduleList();
}

function mapStop(stop: StopHSL): Omit<Stop, "type"> {
  return {
    name: stop.name,
    arrivals: stop.stoptimesWithoutPatterns
      .map((arr: HSLStopTime) => {
        const route = arr.trip.routeShortName;
        const headSign = arr.trip.tripHeadsign;
        const arrivalTimeLocal = arr.realtimeArrival + arr.serviceDay;
        const serviceDay = arr.serviceDay;
        const fullTime = makePrintTime(arrivalTimeLocal, serviceDay);
        if (!fullTime) {
          return null;
        }
        return {
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
    const hours = Math.floor((arrivalTimeUnix - serviceDay) / 60 / 60) % 24;
    const minutes = Math.floor(((arrivalTimeUnix - serviceDay) / 60) % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  const t1 = Math.floor(arrivalTime - secondsFromMidnight);
  if (t1 < -60) {
    return null;
  }
  const t = Math.floor(Math.max(t1, 0) / 60);
  return t <= 1 ? "~0" : String(t);
}

const getStop = async ({
  stopType,
  stops,
}: StopConfig): Promise<Stop | null> => {
  const [result1, result2] = await Promise.all(stops.map(getData));

  if (!result1 || !result2) {
    return null;
  }

  return {
    name: result1.name,
    type: stopType,
    arrivals: result1.arrivals
      .concat(result2.arrivals)
      .sort((arr1, arr2) => arr1.arrivalTimeUnix - arr2.arrivalTimeUnix)
      .slice(0, N_ARRIVALS),
  };
};

const getCachedScheduleList = (): Stop[] =>
  STOPS.map(({ stopType }) => cachedSchedules.get(stopType)).filter(
    (stop): stop is Stop => stop !== undefined,
  );

const shouldRefresh = () =>
  Date.now() - lastRefreshAttemptAt >= REFRESH_INTERVAL_MS;

const noteClientAccess = () => {
  lastAccessAt = Date.now();

  if (refreshTimer) {
    return;
  }

  refreshTimer = setInterval(() => {
    if (Date.now() - lastAccessAt > ACTIVE_CLIENT_WINDOW_MS) {
      stopRefreshLoop();
      return;
    }

    void refreshSchedules();
  }, REFRESH_INTERVAL_MS);
};

const stopRefreshLoop = () => {
  if (!refreshTimer) {
    return;
  }

  clearInterval(refreshTimer);
  refreshTimer = null;
};

const refreshSchedules = async (): Promise<void> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  lastRefreshAttemptAt = Date.now();

  refreshPromise = (async () => {
    const stops = await Promise.all(STOPS.map(getStop));

    let refreshedAny = false;
    stops.forEach((stop) => {
      if (!stop) {
        return;
      }

      cachedSchedules.set(stop.type, stop);
      refreshedAny = true;
    });

    if (!refreshedAny) {
      throw new Error("Failed to refresh any HSL stop groups");
    }
  })()
    .catch((error: unknown) => {
      // eslint-disable-next-line no-console -- TODO: add actual logger
      console.error(error);
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};
