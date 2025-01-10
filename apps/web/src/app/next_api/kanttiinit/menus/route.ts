//import type { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import type {
  DayMenu,
  Food,
  RestaurantMenuLite,
} from "../../../../components/infoscreen/types/kanttiinit-types";

// Single day of meals in Kanttiinit API, key is date
type DayMenuResponse = Record<string, Food[]>;

// Single restaurant menu in Kanttiinit API, key is restaurant id
type RestaurantMenuResponse = Record<string, DayMenuResponse>;

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();
  const response: Response = await fetch(
    `https://kitchen.kanttiinit.fi/menus?${query}`,
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

  return Response.json(data);
}
