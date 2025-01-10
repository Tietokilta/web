import type {
  DayMenu,
  Food,
  RestaurantMenuLite,
} from "../types/kanttiinit-types";

// Single day of meals in Kanttiinit API, key is date
type DayMenuResponse = Record<string, Food[]>;

// Single restaurant menu in Kanttiinit API, key is restaurant id
type RestaurantMenuResponse = Record<string, DayMenuResponse>;

export async function KanttiinitMenus() {
  const ids = [2, 7, 52];
  const today = new Date().toISOString().split("T")[0];
  const response: Response = await fetch(
    `https://kitchen.kanttiinit.fi/menus?${ids.join(",")}&days=${today}`,
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
