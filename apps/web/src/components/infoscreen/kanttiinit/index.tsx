import { getCurrentLocale, getScopedI18n } from "../../../locales/server";
import type { RestaurantMenu, Food } from "../types/kanttiinit-types";
import { fetchMenus } from "./fetcher";

interface MenuProps {
  menu: RestaurantMenu;
  className: string;
}

function MenuItem(menuProp: MenuProps) {
  return (
    <div>
      {menuProp.menu.menus.map((dayMenu) =>
        dayMenu.foods.map((food: Food, _) => (
          <li
            className={menuProp.className}
            key={food.title + food.description}
          >
            <h3 className="text-xl font-bold">
              {food.title ? food.title : "Annos"}:
            </h3>
            <p className="text-m">{food.properties.join(" ")}</p>
            <div>
              <p className="ml-3 text-lg font-normal">{food.description}</p>
            </div>
          </li>
        )),
      )}
    </div>
  );
}

export async function KanttiinitCombined() {
  const locale = await getCurrentLocale();
  const menus = await fetchMenus(locale);
  if (menus.length === 0) {
    return null;
  }
  const t = await getScopedI18n("infoscreen");

  return (
    <div className="h-full">
      <div className="h-[95%] w-full flex-row justify-center">
        <div className="flex w-full justify-center">
          <h1 className="mb-1 mt-2 text-center font-mono text-5xl font-bold">
            {t("Ruokalistat")}
          </h1>
        </div>
        <div className="top-3 flex w-full justify-between gap-x-4 gap-y-2 p-3 pt-0">
          {menus.map((menu) => (
            <div
              key={menu.restaurant.id}
              className="flex w-full flex-col gap-4 p-2 pt-0"
            >
              <ul className="min-h-full rounded-md border-gray-500 p-2 shadow-gray-300 md:items-center">
                <li className="flex h-12 justify-center p-2 font-mono text-2xl font-bold">
                  {menu.restaurant.name}
                </li>
                <MenuItem
                  menu={menu}
                  className="mx-0 my-2 grid items-center rounded-md border-2 p-2 font-mono text-gray-900 md:items-center"
                />
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 z-10 h-[5%] w-full content-center text-center align-text-bottom">
        A+ = Sisältää Allergeenejä | L = Laktoositon | VL = Vähälaktoosinen | G
        = Gluteeniton | M = Maidoton | V = Vegaaninen | O+ = Sisältää
        valkosipulia | VV = Vegaaninen
      </div>
    </div>
  );
}
