import { getCurrentLocale, getScopedI18n } from "../../../locales/server";
import type { Food } from "../types/kanttiinit-types";
import { fetchMenus } from "./fetcher";

export async function KanttiinitCombined() {
  const locale = await getCurrentLocale();
  const className = `shadow-solid shadow-black font-bold text-l rounded-md border-2 border-black p-3 font-mono text-gray-900 md:items-center`;
  const menus = await fetchMenus(locale);
  if (menus.length === 0) {
    return null;
  }
  const t = await getScopedI18n("infoscreen");

  return (
    <div className="w-full flex-row justify-center">
      <div className="flex w-full justify-center">
        <h1 className="my-6 text-center font-mono text-5xl font-bold">
          {t("Ruokalistat")}
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
