import exp from "node:constants";
import {list} from "postcss";

export interface Restaurant {
    opening_hours: Date[],
    id: string,
    type: string,
    url: string,
    name: string,
}
export interface Food {
    title: string,
    properties: string[],
}
export interface RestaurantMenu {
    restaurant: Restaurant,
    foods: Food[],
}
