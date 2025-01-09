import type { RenderableStop } from "./types/hsl-helper-types.ts";
import type {
  Restaurant,
  RestaurantMenuLite,
} from "./types/kanttiinit-types.ts";

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

// Fetches the list of restaurants from the Kanttiinit API
export async function kanttiinitFetcher(url: string): Promise<{
  status: number;
  result: Restaurant[] | null;
}> {
  const response: Response = await fetch(url);
  if (response.status !== 200) {
    return { status: response.status, result: null };
  }
  const responseBody = (await response.json()) as Restaurant[];
  return { status: 200, result: responseBody };
}

// Fetches the menus for the given restaurant ids from the Kanttiinit API
export async function kanttiinitMenuFetcher(
  url: string,
  ids: number[],
): Promise<{
  status: number;
  result: RestaurantMenuLite[] | null;
}> {
  const today = new Date().toISOString().split("T")[0];
  const response: Response = await fetch(
    `${url}${ids.join(",")}&days=${today}`,
  );
  if (response.status !== 200) {
    return { status: response.status, result: null };
  }
  const menus = (await response.json()) as RestaurantMenuLite[];
  return { status: 200, result: menus };
}
