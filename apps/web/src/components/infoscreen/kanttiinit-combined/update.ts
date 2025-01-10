import type {
  Restaurant,
  RestaurantMenu,
  RestaurantMenuLite,
} from "../types/kanttiinit-types";
import { KanttiinitMenus } from "./menus";
import { KanttiinitRestaurants } from "./restaurants";

export const fetchMenus = async (): Promise<RestaurantMenu[]> => {
  try {
    const restaurants = await KanttiinitRestaurants();
    const menus = await KanttiinitMenus();
    const newMenus: RestaurantMenu[] = restaurants.map(
      (restaurant: Restaurant) => {
        return {
          restaurant,
          menus: menus
            .filter(
              (menu: RestaurantMenuLite) => menu.restaurantID === restaurant.id,
            )
            .flatMap((menu) =>
              menu.menus.map((dayMenu) => {
                return {
                  date: dayMenu.date,
                  foods: dayMenu.foods
                    .map((food) => {
                      if (
                        !/chef´s Kitchen|erikoisannos|jälkiruoka|wicked rabbit/i.test(
                          food.title,
                        )
                      ) {
                        if (food.title.includes(":")) {
                          return {
                            id: food.id,
                            title: food.title.replace(/^(?:.*?): /, ""),
                            properties: food.properties,
                          };
                        }
                        return {
                          id: food.id,
                          title: food.title,
                          properties: food.properties,
                        };
                      }
                      return undefined;
                    })
                    .filter((food) => food !== undefined),
                };
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
