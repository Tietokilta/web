import type { MainNavigation } from "@payload-types";
import { SELF_URL } from "./util";

export function register() {
  if (
    process.env.NODE_ENV !== "production" ||
    // eslint-disable-next-line turbo/no-undeclared-env-vars -- Next.js built-in runtime env
    process.env.NEXT_RUNTIME !== "nodejs"
  ) {
    return;
  }

  // Fire-and-forget — don't block server startup
  void warmCache(SELF_URL);
}

async function warmCache(baseUrl: string) {
  const ready = await waitForReady(baseUrl);
  if (!ready) {
    // eslint-disable-next-line no-console -- startup logging
    console.error("[cache-warming] Server did not become ready, skipping");
    return;
  }

  // eslint-disable-next-line no-console -- startup logging
  console.log("[cache-warming] Starting cache warming...");

  const locales = ["fi", "en"];

  // Warm landing pages first (highest traffic)
  await Promise.allSettled(
    locales.map((locale) => warmUrl(baseUrl, `/${locale}`)),
  );

  // Fetch main navigation for each locale and warm linked pages
  const paths = new Set<string>();
  for (const locale of locales) {
    try {
      const res = await fetch(
        `${baseUrl}/api/globals/main-navigation?locale=${locale}&depth=1`,
      );
      const nav = (await res.json()) as MainNavigation;
      for (const path of extractNavPaths(nav)) {
        paths.add(path);
      }
    } catch (error) {
      // eslint-disable-next-line no-console -- startup logging
      console.error(
        `[cache-warming] Failed to fetch navigation for ${locale}:`,
        error,
      );
    }
  }

  // Warm nav-linked pages (deduplicated across locales)
  await Promise.allSettled([...paths].map((path) => warmUrl(baseUrl, path)));

  const total = paths.size + locales.length;
  // eslint-disable-next-line no-console -- startup logging
  console.log(`[cache-warming] Done — warmed ${String(total)} pages`);
}

async function waitForReady(
  baseUrl: string,
  maxAttempts = 30,
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${baseUrl}/next_api/health`);
      if (res.ok) return true;
    } catch {
      // Server not ready yet
    }
    await new Promise<void>((r) => {
      setTimeout(r, 1000);
    });
  }
  return false;
}

async function warmUrl(baseUrl: string, path: string) {
  try {
    await fetch(`${baseUrl}${path}`);
    // eslint-disable-next-line no-console -- startup logging
    console.log(`[cache-warming] Warmed: ${path}`);
  } catch {
    // eslint-disable-next-line no-console -- startup logging
    console.warn(`[cache-warming] Failed to warm: ${path}`);
  }
}

function extractNavPaths(nav: MainNavigation): string[] {
  const paths: string[] = [];

  for (const item of nav.items) {
    if (item.type === "page") {
      const page = item.pageConfig?.page;
      if (typeof page === "object" && page.path) {
        paths.push(page.path);
      }
    } else if (item.type === "topic") {
      for (const category of item.topicConfig?.categories ?? []) {
        for (const pageRef of category.pages ?? []) {
          const page = pageRef.page;
          if (typeof page === "object" && page.path) {
            paths.push(page.path);
          }
        }
      }
    }
  }

  return paths;
}
