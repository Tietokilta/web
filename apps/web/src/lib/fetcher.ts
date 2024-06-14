import { type RenderableStop } from "./types/hsl-helper-types.ts";

async function wait(s: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000 * s);
  });
}

export function delay(s: number) {
  return wait(s);
}

export async function hslFetcher(): Promise<RenderableStop[] | null> {
  if (!process.env.PUBLIC_FRONTEND_URL) {
    return null;
  }
  const response: Response = await fetch(
    process.env.PUBLIC_FRONTEND_URL.concat("/next_api/fetch-hsl-stops"),
    { headers: { "cache-control": "no-cache" } },
  );
  if (response.status !== 200) {
    throw new Error("Something went wrong");
  }
  const responseBody: { retData: { data: RenderableStop[] } } =
    await response.json();
  return responseBody.retData.data;
}
