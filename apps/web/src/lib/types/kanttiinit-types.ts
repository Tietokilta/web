import {open} from "node:fs";

export interface Restaurant {
  opening_hours: openingHour[];
  id: number;
  type: string;
  url: string;
  name: string;
}
export type openingHour =  string | Date | null;

export interface KanttinitResponse {
  openingHours: openingHour[];
  "id": number,
  "type": string,
  "url": string,
  "latitude": number,
  "longitude": number,
  "address": string,
  "priceCategory": string,
  "name": string
}
export interface Food {
  title: string;
  properties: string[];
}
export interface RestaurantMenu {
  restaurant: Restaurant;
  foods: Food[];
}
