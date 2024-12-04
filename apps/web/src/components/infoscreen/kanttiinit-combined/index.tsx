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
  const className = `shadow-solid shadow-black text-l rounded-md border-2 border-black p-3 font-mono text-gray-900 md:items-center`;

  return (
    <div className="flex w-full justify-center">
      {menus.map((menu) => (
        <div
          key={menu.restaurant.id}
          className="flex w-full flex-col gap-4 p-2 pt-0"
        >
          <h1 className="flex h-12 justify-center p-2 font-mono text-2xl font-bold">
            {menu.restaurant.name}
          </h1>
          <ul className={className}>
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
