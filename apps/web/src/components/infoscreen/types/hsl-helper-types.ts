export interface HSLResponse {
  stop: StopHSL;
}
export interface StopHSL {
  name: string;
  stoptimesWithoutPatterns: HSLStopTime[];
}

export interface HSLStopTime {
  realtimeArrival: number;
  serviceDay: number;
  trip: {
    gtfsId: string;
    tripHeadsign: string;
    routeShortName: string;
  };
}
export type StopType = "metro" | "tram" | "bus";

export interface Arrival {
  tripId: string;
  route: string;
  headSign: string;
  arrivalTimeUnix: number;
  serviceDay: number;
  hours: number;
  minutes: number;
  fullTime: string;
}
export interface Stop {
  name: string;
  type: StopType;
  arrivals: Arrival[];
}
