import { isDefined, unique } from "remeda";
import type { Locale } from "@locales/server.ts";
import type {
  DayMenu,
  DayMenuResponse,
  Food,
  RestaurantMenu,
  RestaurantMenuResponse,
  RestaurantResponse,
} from "../types/kanttiinit-types";

const RESTAURANT_IDS = [2, 7, 52].join(",");

async function KanttiinitRestaurants(locale?: Locale) {
  const response: Response = await fetch(
    `https://kitchen.kanttiinit.fi/restaurants?lang=${locale ?? "fi"}&ids=${RESTAURANT_IDS}&priceCategories=student`,
    { next: { revalidate: 3600 } }, // fetch only once per hour
  );

  if (response.status !== 200) {
    return [];
  }
  const responseBody = (await response.json()) as RestaurantResponse[];

  return responseBody;
}

async function KanttiinitMenus(locale?: Locale) {
  const today = new Date().toISOString().split("T")[0];
  const response: Response = await fetch(
    `https://kitchen.kanttiinit.fi/menus?lang=${locale ?? "fi"}&restaurants=${RESTAURANT_IDS}&days=${today}`,
    { next: { revalidate: 3600 } }, // fetch only once per hour
  );

  const responseBody = (await response.json()) as RestaurantMenuResponse;

  return responseBody;
}

export const fetchMenus = async (locale: Locale): Promise<RestaurantMenu[]> => {
  try {
    const restaurants = await KanttiinitRestaurants(locale);
    const menus = await KanttiinitMenus(locale);
    const newMenus: RestaurantMenu[] = Object.entries(menus)
      .map(([restaurantId, menus]) => {
        const restaurant = restaurants.find(
          (restaurant) => String(restaurant.id) === restaurantId,
        );
        if (!restaurant || !menus) {
          return;
        }
        return {
          restaurant,
          menus: mapMenus(menus),
        };
      })
      .filter(isDefined);
    return newMenus;
  } catch (_err: unknown) {
    // Error handling can be added here
  }
  return [];
};

const formatFoods = (foods: Food[]): string => {
  return foods
    .map((food) => food.title.split(":")[1])
    .join(", ")
    .replace(" ,", ",");
};

const mapMenus = (restaurantMenus: DayMenuResponse): DayMenu[] => {
  // Regroup menus by the portion of their title before the first colon
  /* Example:
   *  beginning Foods: [{title: "kasvislounas: herneitä", properties: ["L", "G"]}, {title: "kasvislounas: perunoita", properties: ["L", "G"]}]
   *  end result Foods: [{title: "kasvislounas: herneitä, perunoita", properties: ["L", "G", "L", "G"]}]
   * */
  return Object.entries(restaurantMenus).map(([date, foods]): DayMenu => {
    const foodsGroupedByPrefix = Object.groupBy(foods, (menu) =>
      menu.title.split(":")[0].trim(),
    );
    const mappedFoods = Object.entries(foodsGroupedByPrefix)
      .map(([prefix, foods]): Food | undefined => {
        if (!foods?.length) {
          return;
        }
        const foodDescription = formatFoods(foods);
        return foodDescription === ""
          ? {
              title: "",
              id: foods[0].id,
              properties: unique(foods.flatMap(({ properties }) => properties)),
              description: prefix,
            }
          : {
              title: prefix,
              id: foods[0].id,
              properties: unique(foods.flatMap(({ properties }) => properties)),
              description: foodDescription,
            };
      })
      .filter(isDefined)
      .sort((a, b) => -a.title.localeCompare(b.title));
    return {
      date,
      foods: mappedFoods,
    };
  });
};
