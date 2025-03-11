import type { Locale } from "../../../locales/server";
import type {
  DayMenu,
  Food,
  OpeningHour,
  Restaurant,
  RestaurantMenu,
  RestaurantMenuLite,
} from "../types/kanttiinit-types";

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
  const today = new Date().toISOString().split("T")[0];
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
          menus: menus
            .filter((menu: RestaurantMenuLite) => menu.restaurantID === restaurant.id,)
            .flatMap((menu) =>
              menu.menus.map((dayMenu) => {
                return {
                  date: dayMenu.date,
                  foods: dayMenu.foods.filter((food: Food) =>
                      !/chef´s Kitchen|erikoisannos|jälkiruoka|wicked rabbit/i.test(food.title)
                  ).map((food) => {
                        if (food.title.includes(":")) {
                          return {
                            id: food.id,
                            title: food.title.replace(/^.*?: /, ""),
                            properties: food.properties,
                          };
                        }
                        return { ...food };
                      }
                )};
              }),
            ),
        };
      },
    );
    return newMenus;
  } catch (_err: unknown) {
    // Error handling can be added here
  }
  return [];
};
