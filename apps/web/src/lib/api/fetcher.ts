import stringify from "json-stable-stringify";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies, draftMode } from "next/headers";
import { stringify as qsStringify } from "qs";

export function fetcher<TRequest, TResponse>({
  tagFn,
  dataFetcher,
}: {
  tagFn: (req: TRequest) => string;
  dataFetcher: (
    req: TRequest,
    draft: boolean,
    fetchOptions: RequestInit,
  ) => Promise<TResponse | undefined | null>;
}) {
  return async (req: TRequest): Promise<TResponse | undefined | null> => {
    let payloadToken: RequestCookie | undefined;

    const { isEnabled: isDraftMode } = draftMode();

    if (isDraftMode) {
      payloadToken = cookies().get("payload-token");
    }
    const tagToCache =
      tagFn(req) +
      (isDraftMode && payloadToken ? `_${Date.now().toFixed()}` : "");

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
  return fetcher<TRequest & { locale: string }, TResponse>({
    tagFn: (req) => `get_${path}_${stringify(req)}`,
    dataFetcher: async (
      req,
      draft,
      fetchOptions,
    ): Promise<TResponse | undefined> => {
      const fetchUrl = `${process.env.PUBLIC_SERVER_URL ?? ""}${path}?${qsStringify(
        {
          ...req,
          ...(draft ? { draft: "true" } : {}),
          depth: 10, // TODO: remove this when we have a better way to handle depth for example with GraphQL
          // Needs to be bigger than 1 to get media / images
          limit: 100,
        },
      ).toString()}`;

      // eslint-disable-next-line no-console -- for debugging purposes
      console.log("getAll", path, "req", req, "fetchUrl", fetchUrl);

      const response = await fetch(fetchUrl, {
        method: "GET",
        credentials: "include",
        ...fetchOptions,
      });
      const result = (await response.json()) as { docs?: TResponse };

      return result.docs ?? undefined;
    },
  });
}

export function getOne<TRequest extends Record<string, unknown>, TResponse>(
  path: string,
) {
  return (req: TRequest & { locale: string }) =>
    getAll<TRequest, TResponse[]>(path)(req).then((res) => res?.[0]);
}

export function getGlobal<TResponse>(path: string, locale: string) {
  return fetcher<Record<string, never>, TResponse>({
    tagFn: () => `getGlobal_${path}?locale=${locale}`,
    dataFetcher: async (
      _,
      draft,
      fetchOptions,
    ): Promise<TResponse | undefined> => {
      const fetchUrl = `${process.env.PUBLIC_SERVER_URL ?? ""}${path}?${qsStringify(
        {
          locale,
          depth: 10, // TODO: remove this when we have a better way to handle depth for example with GraphQL
          // Needs to be bigger than 1 to get media / images
          ...(draft ? { draft: "true" } : {}),
        },
      ).toString()}`;

      // eslint-disable-next-line no-console -- for debugging purposes
      console.log("getGlobal", "path", "fetchUrl", fetchUrl);

      const response = await fetch(fetchUrl, {
        method: "GET",
        credentials: "include",
        ...fetchOptions,
      });
      const result = (await response.json()) as TResponse;

      return result;
    },
  });
}
