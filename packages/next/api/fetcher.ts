import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { mapKeys } from "lodash";

export const fetcher =
  <Request, Response>(
    tag: (req: Request) => string,
    dataFetcher: (
      req: Request,
      draft: boolean,
      fetchOptions: RequestInit,
    ) => Promise<Response | undefined | null>,
  ) =>
  async (req: Request): Promise<Response | undefined | null> => {
    let payloadToken: RequestCookie | undefined;

    const { draftMode, cookies } = await import("next/headers");
    const { isEnabled: isDraftMode } = draftMode();

    if (isDraftMode) {
      payloadToken = cookies().get("payload-token");
    }

    const res = await dataFetcher(req, !!isDraftMode && !!payloadToken, {
      // this is the key we'll use to on-demand revalidate pages that use this data
      // we do this by calling `revalidateTag()` using the same key
      // see `app/api/revalidate.ts` for more info
      next: {
        tags: [
          tag(req) + (isDraftMode && payloadToken ? `_${Date.now()}` : ""),
        ],
      },
      ...(isDraftMode && payloadToken
        ? {
            headers: {
              Authorization: `JWT ${payloadToken?.value}`,
            },
          }
        : {}),
    });

    return res ?? null;
  };

export const getSortedJSON = (data: object): string =>
  JSON.stringify(data, Object.keys(data).sort());

export const getAll = <
  Request extends Record<string, string>,
  Response extends unknown[],
>(
  path: string,
) =>
  fetcher<Request, Response>(
    (req) => `get_${path}_${getSortedJSON(req)}`,
    async (req, draft, fetchOptions): Promise<Response | undefined> => {
      const res: { docs?: Response } = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${path}?${new URLSearchParams({
          ...mapKeys(req, (_, key) => `where[${key}][equals]`),
          ...(draft ? { draft: "true" } : {}),
        }).toString()}`,
        {
          method: "GET",
          ...fetchOptions,
        },
      ).then((res) => res.json());

      return res?.docs ?? undefined;
    },
  );

export const getOne =
  <Request extends Record<string, string>, Response>(path: string) =>
  (req: Request) =>
    getAll<Request, Response[]>(path)(req).then((res) => res?.[0]);
