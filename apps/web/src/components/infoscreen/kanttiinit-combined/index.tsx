import type { Food } from "../types/kanttiinit-types";
import { fetchMenus } from "./update";

export async function KanttiinitCombined() {
  const className = `shadow-solid shadow-black font-bold text-l rounded-md border-2 border-black p-3 font-mono text-gray-900 md:items-center`;
  const menus = await fetchMenus();
  if (menus.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex-row justify-center">
      <div className="flex w-full justify-center">
        <h1 className="flex justify-center pt-4 text-3xl font-bold">
          Ruokalistat
        </h1>
      </div>
      <div className="top-3 flex w-full justify-between gap-4 p-8 pt-0">
        {menus.map((menu) => (
          <div
            key={menu.restaurant.id}
            className="flex w-full flex-col gap-4 p-2 pt-0"
          >
            <ul className="shadow-solid min-h-full space-y-4 rounded-md border-4 border-gray-500 p-2 shadow-gray-300 md:items-center">
              <li className="flex h-12 justify-center p-2 font-mono text-2xl font-bold">
                {menu.restaurant.name}
              </li>
              {menu.menus.map((dayMenu) =>
                dayMenu.foods.map((food: Food, _) => (
                  <li className={className} key={food.title}>
                    {food.title}
                  </li>
                )),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
