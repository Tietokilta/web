import stringify from "json-stable-stringify";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies, draftMode } from "next/headers";
import { stringify as qsStringify } from "qs";

export function fetcher<TRequest, TResponse>(
  tag: (req: TRequest) => string,
  dataFetcher: (
    req: TRequest,
    draft: boolean,
    fetchOptions: RequestInit,
  ) => Promise<TResponse | undefined | null>,
) {
  return async (req: TRequest): Promise<TResponse | undefined | null> => {
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
}

export function getAll<
  TRequest extends Record<string, unknown>,
  TResponse extends unknown[],
>(path: string) {
  return fetcher<TRequest, TResponse>(
    (req) => `get_${path}_${stringify(req)}`,
    async (req, draft, fetchOptions): Promise<TResponse | undefined> => {
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
      ).then((res) => res.json() as Promise<{ docs?: TResponse }>);

      return result.docs ?? undefined;
    },
  );
}

export function getOne<TRequest extends Record<string, unknown>, TResponse>(
  path: string,
) {
  return (req: TRequest & { locale: string }) =>
    getAll<TRequest, TResponse[]>(path)(req).then((res) => res?.[0]);
}

export function getGlobal<TResponse>(path: string, locale: string) {
  return fetcher<Record<string, never>, TResponse>(
    () => `getGlobal_${path}?locale=${locale}`,
    async (_, draft, fetchOptions): Promise<TResponse | undefined> => {
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
      ).then((res) => res.json() as Promise<TResponse>);

      return result;
    },
  );
}
