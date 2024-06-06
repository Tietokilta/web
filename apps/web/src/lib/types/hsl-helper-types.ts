export interface Trip {
  routeShortName: string;
}
export interface StopFromApi {
  __typename: string;
  name: string;
  stopTimesWithoutPatterns: [];
}
export interface Data {
  stop: StopFromApi;
}
export interface HSLResponse {
  data: Data;
  loading: false;
  networkStatus: number;
}
export interface StopTime {
  realtimeArrival: number;
  serviceDay: number;
  headsign: string;
  trip: Trip;
}
export interface Stop {
  name: string;
  type: StopType;
  stoptimesWithoutPatterns: StopTime[];
}
export type StopType = "metro" | "tram" | "bus" | null;

export interface Arrival {
  route: string;
  headSign: string;
  realTimeArrival: number;
  serviceDay: number;
}
export interface StopOutData {
  name: string;
  type: StopType;
  arrival: Arrival[];
}

export interface ArrivalAttribute {
  route: string;
  headSign: string;
  hours: number;
  minutes: number;
  fullTime: string;
}
export interface RenderableStop {
  name: string;
  type: StopType;
  arrivals: ArrivalAttribute[];
}
