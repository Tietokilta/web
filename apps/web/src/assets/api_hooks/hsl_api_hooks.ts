import { ApolloClient, DocumentNode, InMemoryCache, useQuery, gql} from "@apollo/client";

import API_KEY from '../../../../../secrets.json';

import { StopOutData, Stop } from "./hsl_api_types";

const GetStopSchedule = (StopId: string): DocumentNode => gql(`
  {
    stop(id: "${StopId}") {
      name
        stoptimesWithoutPatterns {
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
    }
  ).then(
    (result) => {
      data = result.data.stop
    }
  )
  console.log("Data after stop", data)

  return data
}
