import { kanttiinitFetcher, kanttiinitMenuFetcher } from "../../../lib/fetcher";
import type {
  Restaurant,
  RestaurantMenu,
  RestaurantMenuLite,
} from "../types/kanttiinit-types";

export const fetchMenus = async (
  setMenus: React.Dispatch<React.SetStateAction<RestaurantMenu[]>>,
): Promise<void> => {
  try {
    const restaurantResults: {
      status: number;
      result: Restaurant[] | null;
    } = await kanttiinitFetcher("/next_api/kanttiinit");
    const menuResults: { status: number; result: RestaurantMenuLite[] | null } =
      await kanttiinitMenuFetcher(
        "/next_api/kanttiinit/menus?restaurants=",
        [2, 7, 52],
      );
    if (restaurantResults.status === 200 && menuResults.status === 200) {
      const newMenus: RestaurantMenu[] = (
        restaurantResults.result ? restaurantResults.result : []
      ).map((restaurant: Restaurant) => {
        return {
          restaurant,
          menus: (menuResults.result ? menuResults.result : [])
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
      });
      setMenus(newMenus);
    }
  } catch (_err: unknown) {
    // Error handling can be added here
  }
};
