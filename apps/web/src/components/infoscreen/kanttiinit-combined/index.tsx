"use client";

import type {
  Food,
  RestaurantMenu,
} from "../../../lib/types/kanttiinit-types.ts";

export function KanttiinitCombined({ menus }: { menus: RestaurantMenu[] }) {
  /*const [error, setError] = useState("");
  if (error !== "") {
    return (
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">{error}</h1>
      </div>
    );
  }*/
  return (
    <div>
      {menus.map((menu) => (
        <div key={menu.restaurant.id}>
          <p>
            {menu.restaurant.name} ({menu.restaurant.id})
          </p>
          <ul>
            {menu.menus.map((dayMenu) =>
              dayMenu.foods.map((food: Food, index: number) => (
                <li key={index}>{food.title}</li>
              )),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
