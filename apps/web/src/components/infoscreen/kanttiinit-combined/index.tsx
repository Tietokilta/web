"use client";

import {Food, Restaurant, type RestaurantMenu} from "../../../lib/types/kanttiinit-types.ts";
import {useEffect, useState} from "react";
import type {RenderableStop} from "../../../lib/types/hsl-helper-types.ts";
import {kanttiinitFetcher, kanttiinitMenuFetcher} from "../../../lib/fetcher.ts";
import {useRouter} from "next/navigation";

export function KanttiinitCombined({
  menus,
  setMenus,
}: {
  menus: RestaurantMenu[];
  setMenus: React.Dispatch<React.SetStateAction<RestaurantMenu[]>>;
}) {
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    // This use effect updates the times displayed on the info screen
    const fetchData = async (): Promise<void> => {
      try {
        const restaurantResults: { status: number; result: Restaurant[] | null } =
          await kanttiinitFetcher("https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids=2,7,52&priceCategories=student");
        const menuResults: { status: number; result: Food[] | null } =
          await kanttiinitMenuFetcher("https://kitchen.kanttiinit.fi/menus?restaurants=", [2, 7, 52]);
        console.log(restaurantResults)
        console.log(menuResults)
        if (restaurantResults.status === 200 && menuResults.status === 200) {
          setError("");
          const newMenus: RestaurantMenu[] =
            (restaurantResults.result ? restaurantResults.result : []).map(
              (restaurant: Restaurant) => {
              return {
                restaurant: restaurant,
                foods: (menuResults.result ? menuResults.result : []).filter((food: Food) => food.id === restaurant.id),
              };
          });
          setMenus(newMenus);
        } else {
          setError("Error fetching data");
          router.push("/infonaytto/naytto");
        }
      } catch (err: any) {
        setError(err.message);
        router.push("/infonaytto/naytto");
      }
    };
    // Call fetchData immediately and then set up the interval
    fetchData().catch((err: Error) => {
      setError(err.message);
    });
    const intervalId = setInterval(fetchData, 3600000); // timeout n milliseconds

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [menus, setMenus]);
  if (error !== "") {
    return (
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">{error}</h1>
      </div>
    );
  }
  return (
    <div>
      {menus.map(menu => (<div><p>{menu.restaurant.name}</p><p>{menu.restaurant.id}</p></div>))}
    </div>
  );
}
