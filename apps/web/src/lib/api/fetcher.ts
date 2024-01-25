import stringify from "json-stable-stringify";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { stringify as qsStringify } from "qs";
import { draftMode, cookies } from "next/headers";

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

    const { isEnabled: isDraftMode } = draftMode();

    if (isDraftMode) {
      payloadToken = cookies().get("payload-token");
    }
    const tagToCache =
      tag(req) + (isDraftMode && payloadToken ? `_${Date.now()}` : "");
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("tagToCache", tagToCache);
    const res = await dataFetcher(
      req,
      Boolean(isDraftMode) && Boolean(payloadToken),
      {
        // this is the key we'll use to on-demand revalidate pages that use this data
        // we do this by calling `revalidateTag()` using the same key
        // see `app/api/revalidate.ts` for more info
        next: {
          tags: [tagToCache],
        },
        ...(isDraftMode && payloadToken
          ? {
              headers: {
                Authorization: `JWT ${payloadToken.value}`,
              },
            }
          : {}),
      },
    );

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
      const result = await fetch(
        `${process.env.PUBLIC_SERVER_URL}${path}?${qsStringify({
          ...req,
          ...(draft ? { draft: "true" } : {}),
        }).toString()}`,
        {
          method: "GET",
          credentials: "include",
          ...fetchOptions,
        },
      ).then((res) => res.json() as Promise<{ docs?: Response }>);

      return result.docs ?? undefined;
    },
  );

export const getOne =
  <Request extends Record<string, unknown>, Response>(path: string) =>
  (req: Request & { locale: string }) =>
    getAll<Request, Response[]>(path)(req).then((res) => res?.[0]);

export const getGlobal = <Response>(path: string, locale: string) =>
  fetcher<Record<string, never>, Response>(
    () => `getGlobal_${path}?locale=${locale}`,
    async (_, draft, fetchOptions): Promise<Response | undefined> => {
      const fetchUrl = `${process.env.PUBLIC_SERVER_URL}${path}?${qsStringify({
        locale,
        depth: 10, // TODO: remove this when we have a better way to handle depth for example with GraphQL
        // Needs to be bigger than 1 to get media / images
        ...(draft ? { draft: "true" } : {}),
      }).toString()}`;
      console.log("fetchUrl", fetchUrl);
      const result = await fetch(
        `${process.env.PUBLIC_SERVER_URL}${path}?${qsStringify({
          locale,
          depth: 10, // TODO: remove this when we have a better way to handle depth for example with GraphQL
          // Needs to be bigger than 1 to get media / images
          ...(draft ? { draft: "true" } : {}),
        }).toString()}`,
        {
          method: "GET",
          credentials: "include",
          ...fetchOptions,
        },
      ).then((res) => res.json() as Promise<Response>);

      return result;
    },
  );
