// Restaurant
export interface Restaurant {
  opening_hours: OpeningHour[];
  id: number;
  type: string;
  url: string;
  name: string;
}

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

// Container for menus of a single restaurant
export interface RestaurantMenuLite {
  restaurantID: number;
  menus: DayMenu[];
}

// Container for menus of a single restaurant (with restaurant info)
export interface RestaurantMenu {
  restaurant: Restaurant;
  menus: DayMenu[];
}
