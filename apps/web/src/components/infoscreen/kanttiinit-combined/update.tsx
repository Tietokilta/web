import { kanttiinitFetcher, kanttiinitMenuFetcher } from "../../../lib/fetcher";
import type {
  Restaurant,
  RestaurantMenu,
  RestaurantMenuLite,
} from "../../../lib/types/kanttiinit-types";

export const fetchMenus = async (
  setMenus: React.Dispatch<React.SetStateAction<RestaurantMenu[]>>,
	//setError: React.Dispatch<React.SetStateAction<string>>
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
      //setError("");
      const newMenus: RestaurantMenu[] = (
        restaurantResults.result ? restaurantResults.result : []
      ).map((restaurant: Restaurant) => {
        return {
          restaurant,
          menus: (menuResults.result ? menuResults.result : [])
            .filter(
              (menu: RestaurantMenuLite) => menu.restaurantID === restaurant.id,
            )
            .flatMap((menu) => menu.menus),
        };
      });
      setMenus(newMenus);
    } else {
      //setError("Error fetching data");
    }
  } catch (_err: unknown) {
    //setError(err.message);
  }
};
