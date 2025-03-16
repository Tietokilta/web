import type { Locale } from "@locales/server.ts";
import type {
  DayMenu,
  Food,
  OpeningHour,
  Restaurant,
  RestaurantMenu,
  RestaurantMenuLite,
} from "../types/kanttiinit-types";
import * as console from "node:console";
import { string } from "zod";

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

// Single day of meals in Kanttiinit API, key is date
type DayMenuResponse = Record<string, Food[]>;

// Single restaurant menu in Kanttiinit API, key is restaurant id
type RestaurantMenuResponse = Record<string, DayMenuResponse>;

async function KanttiinitRestaurants(locale?: Locale) {
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

async function KanttiinitMenus(locale?: Locale) {
  const ids = [2, 7, 52];
  const today = new Date("2025-03-13T03:24:00").toISOString().split("T")[0];
  const response: Response = await fetch(
    `https://kitchen.kanttiinit.fi/menus?lang=${locale ?? "fi"}&${ids.join(",")}&days=${today}`,
    { next: { revalidate: 3600 } }, // fetch only once per hour
  );

  const responseBody = (await response.json()) as RestaurantMenuResponse;

  const data = Object.entries(responseBody).map(
    ([restaurantID, menuResponse]) => {
      const parsedMenu = Object.entries(menuResponse).map(([date, foods]) => {
        const parsedFoods = Object.entries(foods).map(
          ([mealID, meal]) =>
            ({
              id: parseInt(mealID),
              title: meal.title,
              properties: meal.properties,
            }) as Food,
        );
        return {
          date,
          foods: parsedFoods,
        } as DayMenu;
      });
      return {
        restaurantID: parseInt(restaurantID),
        menus: parsedMenu,
      } as RestaurantMenuLite;
    },
  );

  return data;
}

export const fetchMenus = async (locale: Locale): Promise<RestaurantMenu[]> => {
  try {
    const restaurants = await KanttiinitRestaurants(locale);
    const menus = await KanttiinitMenus(locale);
    const newMenus: RestaurantMenu[] = restaurants.map(
      (restaurant: Restaurant) => {
        return {
          restaurant,
          menus: formatMenus(
            menus.filter(
              (menu: RestaurantMenuLite) => menu.restaurantID === restaurant.id,
            ),
          ).flatMap((menu) => menu.menus),
        };
      },
    );
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
const removeDups = (arr: string[]): string[] => {
  let unique: string[] = [];
  arr.forEach((element) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
  });
  return unique;
};

const formatMenus = (menus: RestaurantMenuLite[]): RestaurantMenuLite[] => {
  // Regroup menus by the portion of their title before the first colon
  /* Example:
   *  beginning Foods: [{title: "kasvislounas: herneitä", properties: ["L", "G"]}, {title: "kasvislounas: perunoita", properties: ["L", "G"]}]
   *  end result Foods: [{title: "kasvislounas: herneitä, perunoita", properties: ["L", "G", "L", "G"]}]
   * */
  const groupedMenus: RestaurantMenuLite[] = [];
  menus.forEach((menu) => {
    const newMenus: DayMenu[] = [];
    menu.menus.forEach((dayMenu) => {
      const newFoods: Food[] = [];
      const foodGroups: Record<string, Food[]> = {};
      dayMenu.foods.forEach((food) => {
        const title = food.title.split(":")[0].trim();
        if (foodGroups[title]) {
          foodGroups[title].push(food);
        } else {
          foodGroups[title] = [food];
        }
      });
      Object.entries(foodGroups).forEach(([title, foods]) => {
        if (foods.length === 1) {
          newFoods.push({
            id: foods[0].id,
            title: "",
            description: foods[0].title,
            properties: removeDups(foods.flatMap((food) => food.properties)),
          });
          return;
        }
        newFoods.push({
          id: foods[0].id,
          title: title,
          description: formatFoods(foods),
          properties: removeDups(foods.flatMap((food) => food.properties)),
        });
      });
      newMenus.push({
        date: dayMenu.date,
        foods: newFoods,
      });
    });
    groupedMenus.push({
      restaurantID: menu.restaurantID,
      menus: newMenus,
    });
  });
  return groupedMenus;
};
