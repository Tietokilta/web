import stringify from "json-stable-stringify";
import qs from "qs";

import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

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

export const getAll = <
  Request extends Record<string, unknown>,
  Response extends unknown[],
>(
  path: string,
) =>
  fetcher<Request, Response>(
    (req) => `get_${path}_${stringify(req)}`,
    async (req, draft, fetchOptions): Promise<Response | undefined> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${path}?${qs
          .stringify({
            ...req,
            ...(draft ? { draft: "true" } : {}),
          })
          .toString()}`,
        {
          method: "GET",
          ...fetchOptions,
        },
      ).then((res) => res.json() as Promise<{ docs?: Response }>);

      return res?.docs ?? undefined;
    },
  );

export const getOne =
  <Request extends Record<string, unknown>, Response>(path: string) =>
  (req: Request & { locale?: string }) =>
    getAll<Request, Response[]>(path)(req).then((res) => res?.[0]);

export const getGlobal = <Response>(path: string) =>
  fetcher<Record<string, never>, Response>(
    () => `getGlobal_${path}`,
    async (_, draft, fetchOptions): Promise<Response | undefined> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${path}?${qs
          .stringify({
            depth: 1,
            ...(draft ? { draft: "true" } : {}),
          })
          .toString()}`,
        {
          method: "GET",
          ...fetchOptions,
        },
      ).then((res) => res.json() as Promise<Response>);

      return res;
    },
  );
