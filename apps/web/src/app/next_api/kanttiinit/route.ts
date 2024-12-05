import type {
  OpeningHour,
  Restaurant,
} from "../../../lib/types/kanttiinit-types";

interface RestaurantResponse {
  openingHours: OpeningHour[];
  id: number;
  type: string;
  url: string;
  latitude: number;
  longitude: number;
  address: string;
  priceCategory: string;
  name: string;
}

export async function GET() {
  const response: Response = await fetch(
    "https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids=2,7,52&priceCategories=student",
  );

  if (response.status !== 200) {
    return Response.error();
  }
  const responseBody = (await response.json()) as RestaurantResponse[];

  const data: Restaurant[] = responseBody.map(
    (restaurant: RestaurantResponse) => {
      return {
        id: restaurant.id,
        name: restaurant.name,
        type: restaurant.type,
        url: restaurant.url,
        opening_hours: restaurant.openingHours,
      };
    },
  );

  return Response.json(data);
}
