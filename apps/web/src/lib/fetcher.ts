import { type RenderableStop } from "./types/hsl-helper-types.ts";
import {Food, KanttinitResponse, Restaurant} from "./types/kanttiinit-types.ts";

async function wait(s: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000 * s);
  });
}

export function delay(s: number) {
  return wait(s);
}

export async function hslFetcher(): Promise<{
  status: number;
  result: RenderableStop[] | null;
}> {
  //console.log(process.env.NEXT_PUBLIC_FRONTEND_URL)
  if (!process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return { status: 500, result: null };
  }
  const response: Response = await fetch("/next_api/fetch-hsl-stops", {
    headers: { "cache-control": "no-cache" },
  });
  if (response.status !== 200) {
    return { status: response.status, result: null };
  }
  const responseBody: { retData: { data: RenderableStop[] } } =
    await response.json();
  return { status: 200, result: responseBody.retData.data };
}

export async function kanttiinitFetcher(url: string): Promise<{
  status: number;
  result: Restaurant[] | null;
}> {
  const response: Response = await fetch(url);
  if (response.status !== 200) {
    return { status: response.status, result: null };
  }
  const responseBody: { retData: { data: KanttinitResponse[] } } =
    await response.json();
  const restaurants: Restaurant[] = responseBody.retData.data.map(
    (restaurant: KanttinitResponse) => {
      return {
        id: restaurant.id,
        name: restaurant.name,
        type: restaurant.type,
        url: restaurant.url,
        opening_hours: restaurant.openingHours,
      };
    })
  return { status: 200, result: restaurants };
}

export async function kanttiinitMenuFetcher(url: string, ids: number[]): Promise<{
  status: number;
  result: Food[] | null;
}> {
  const today = new Date().toISOString().split('T')[0]
  const response: Response = await fetch(`${url}${ids.join(",")}&days=${today}`);
  if (response.status !== 200) {
    return { status: response.status, result: null };
  }
  const responseBody: { retData: { data: any } } =
    await response.json();

  const menus: Food[] = []

  responseBody.retData.data.forEach((data: any[]) => {
    data.map((menus: any) => {
      menus.append({
        id: menus.getItem(ids),
        title: menus.getItem(ids).getItem(today).title,
        properties: menus.getItem(ids).getItem(today).properties,
      })
    });
  });
  return { status: 200, result: menus };
}
