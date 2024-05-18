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

export type Arrival = {
  route: string,
  headSign: string,
  realTimeArrival: number,
  serviceDay: number,
}
export type StopOutData = {
  name: string,
  arrival: Arrival[],
}

export type RenderAttribute = {
  route: string,
  head: string,
  realTimeArrival: number,
}
