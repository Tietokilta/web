import type { Locale } from "../../../locales/server";
import type { OpeningHour, Restaurant } from "../types/kanttiinit-types";

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

export async function KanttiinitRestaurants(locale?: Locale) {
  const response: Response = await fetch(
    `https://kitchen.kanttiinit.fi/restaurants?lang=${locale ?? "fi"}&ids=2,7,52&priceCategories=student`,
    { next: { revalidate: 3600 } }, // fetch only once per hour
  );

  if (response.status !== 200) {
    return [];
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

  return data;
}
