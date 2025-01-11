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
    tripHeadsign: string;
    routeShortName: string;
  };
}
export type StopType = "metro" | "tram" | "bus";

export interface Arrival {
  route: string;
  headSign: string;
  arrivalTimeLocalUnix: number;
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
