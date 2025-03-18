// Helper type for opening hours
export type OpeningHour = string | Date | null;

// Single food item in a menu
export interface Food {
  id: number;
  title: string;
  description: string;
  properties: string[];
}

// Container for meals in a single day
export interface DayMenu {
  date: string;
  foods: Food[];
}

// Container for menus of a single restaurant (with restaurant info)
export interface RestaurantMenu {
  restaurant: RestaurantResponse;
  menus: DayMenu[];
}
export interface RestaurantResponse {
  openingHours: OpeningHour[];
  id: number;
  type: string;
  url: string;
  latitude: number;
  longitude: number;
  address: string;
  priceCategory: string;
  name: string;
}

// Single day of meals in Kanttiinit API, key is date
export type DayMenuResponse = Record<string, Food[]>;

// Single restaurant menu in Kanttiinit API, key is restaurant id
export type RestaurantMenuResponse = Partial<Record<string, DayMenuResponse>>;
