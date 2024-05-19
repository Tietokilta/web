export type Trip = {
  routeShortName: string;
}
export type StopTime = {
  realtimeArrival: number,
  serviceDay: number,
  headsign: string,
  trip: Trip,
}
export type Stop = {
  name: string,
  stoptimesWithoutPatterns: StopTime[],
}
export type Data = {
  stop: Stop,
}
export type StopType = "metro" | "tram" | "bus" | null

export type Arrival = {
  route: string,
  headSign: string,
  realTimeArrival: number,
  serviceDay: number,
}
export type StopOutData = {
  name: string,
  type: StopType,
  arrival: Arrival[],
}

export type ArrivalAttribute = {
  route: string,
  headSign: string,
  hours: number,
  minutes: number,
  fullTime: string,
}
export type RenderableStop = {
  name: string,
  type: StopType,
  arrivals: ArrivalAttribute[]
}
