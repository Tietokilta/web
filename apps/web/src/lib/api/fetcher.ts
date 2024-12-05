import { type Config } from "@tietokilta/cms-types/payload";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies, draftMode } from "next/headers";
import { stringify as qsStringify } from "qs";

export type CollectionSlug = keyof Config["collections"];
export type GlobalSlug = keyof Config["globals"];

export function fetcher<TRequest, TResponse>({
  tags,
  dataFetcher,
}: {
  tags: string[];
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
    // eslint-disable-next-line no-console -- for debugging purposes
    console.log("tagToCache", tags);

    const res = await dataFetcher(
      req,
      Boolean(isDraftMode) && Boolean(payloadToken),
      {
        // this is the key we'll use to on-demand revalidate pages that use this data
        // we do this by calling `revalidateTag()` using the same key
        // see `app/api/revalidate.ts` for more info
        next: {
          revalidate: false,
          tags,
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

export function getAllCollectionItems<
  TRequest extends Record<string, unknown>,
  TResponse extends unknown[],
>(collectionSlug: CollectionSlug, globalOpts: { sort?: string } = {}) {
  return fetcher<TRequest & { locale: string }, TResponse>({
    tags: ["collection-pages", `collection-${collectionSlug}`],
    dataFetcher: async (
      req,
      draft,
      fetchOptions,
    ): Promise<TResponse | undefined> => {
      const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}/api/${collectionSlug}?${qsStringify(
        {
          ...req,
          ...(draft ? { draft: "true" } : {}),
          depth: req.depth ?? 10, // TODO: remove this when we have a better way to handle depth for example with GraphQL
          // Needs to be bigger than 1 to get media / images
          limit: req.limit ?? 100,
          sort: globalOpts.sort,
        },
      ).toString()}`;

      // eslint-disable-next-line no-console -- for debugging purposes
      console.log("getAll", collectionSlug, "req", req, "fetchUrl", fetchUrl);

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

export function getOneCollectionItem<
  TRequest extends Record<string, unknown>,
  TResponse,
>(collectionSlug: CollectionSlug, globalOpts: { sort?: string } = {}) {
  return (req: TRequest & { locale: string }) =>
    getAllCollectionItems<TRequest, TResponse[]>(
      collectionSlug,
      globalOpts,
    )(req).then((res) => res?.[0]);
}

export function getGlobal<TResponse>(
  globalSlug: GlobalSlug,
  globalOpts: { locale: string; sort?: string },
) {
  return fetcher<Record<string, never>, TResponse>({
    tags: [`global-${globalSlug}`],
    dataFetcher: async (
      _,
      draft,
      fetchOptions,
    ): Promise<TResponse | undefined> => {
      const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? ""}/api/globals/${globalSlug}?${qsStringify(
        {
          locale: globalOpts.locale,
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
