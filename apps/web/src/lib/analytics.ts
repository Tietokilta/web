import { isbot } from "isbot";
import { getPayload } from "payload";
import config from "../payload.config";

/**
 * Simple server-side analytics for tracking unique page views.
 * - Uses hashed IP + User-Agent + path + date for daily deduplication
 * - No PII is stored, only the hash
 * - Bots are filtered out using the isbot library
 */

/**
 * Generate a SHA-256 hash for session deduplication.
 * Hash includes: IP + User-Agent + path + YYYY-MM-DD
 * This ensures the same visitor is only counted once per day per page.
 */
async function generateSessionHash(
  ip: string,
  userAgent: string,
  path: string,
): Promise<string> {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const data = `${ip}|${userAgent}|${path}|${date}`;

  // Use Web Crypto API (available in Node.js 18+)
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Extract client IP from request headers.
 *
 * For X-Forwarded-For, reads from the RIGHT side to prevent spoofing.
 * Uses XFF_DEPTH env var to determine how many trusted proxies are in front.
 *
 * Example with XFF_DEPTH=2 (e.g., Azure Front Door + App Service):
 *   X-Forwarded-For: <spoofed>, <client>, <proxy1>
 *   We read index -2 from the right = <client>
 *
 * @see https://learn.microsoft.com/en-us/azure/frontdoor/front-door-http-headers-protocol
 */
function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());

    // XFF_DEPTH = number of trusted proxies between client and this server
    // Default to 1 (assumes one reverse proxy like Azure Front Door)
    const depth = parseInt(process.env.XFF_DEPTH ?? "1", 10);

    // Read from the right: if depth=1, take last IP; if depth=2, take second-to-last, etc.
    // The IP at position (length - depth) is the client IP
    const clientIndex = Math.max(0, ips.length - depth);
    return ips[clientIndex] ?? "unknown";
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - in production this should rarely happen
  return "unknown";
}

interface TrackPageViewParams {
  path: string;
  headers: Headers;
}

interface TrackPageViewResult {
  tracked: boolean;
  reason?: "bot" | "duplicate" | "error" | "no-page";
}

/**
 * Track a page view if it's a unique session (not a bot, not seen today).
 * This function is designed to be called from middleware and is non-blocking.
 */
export async function trackPageView({
  path,
  headers,
}: TrackPageViewParams): Promise<TrackPageViewResult> {
  const userAgent = headers.get("user-agent") ?? "";

  // Filter out bots
  if (isbot(userAgent)) {
    return { tracked: false, reason: "bot" };
  }

  const ip = getClientIp(headers);
  const hash = await generateSessionHash(ip, userAgent, path);

  try {
    const payload = await getPayload({ config });

    // Try to create a new session record
    // If the hash already exists (duplicate key error), the view was already counted today
    try {
      await payload.create({
        collection: "view-sessions",
        data: {
          hash,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      // Check if it's a duplicate key error (MongoDB error code 11000)
      if (
        error instanceof Error &&
        (error.message.includes("duplicate") ||
          error.message.includes("11000") ||
          error.message.includes("E11000"))
      ) {
        return { tracked: false, reason: "duplicate" };
      }
      throw error;
    }

    // Find the page by path and increment view count
    // The path in the Pages collection is localized, so we need to search across locales
    const pages = await payload.find({
      collection: "pages",
      where: {
        or: [
          { "path.fi": { equals: path } },
          { "path.en": { equals: path } },
        ],
      },
      limit: 1,
      depth: 0,
    });

    if (pages.docs.length === 0) {
      // Page not found - might be a dynamic route or non-CMS page
      return { tracked: false, reason: "no-page" };
    }

    const page = pages.docs[0];

    // Increment the view count
    await payload.update({
      collection: "pages",
      id: page.id,
      data: {
        viewCount: (page.viewCount ?? 0) + 1,
      },
      // Don't trigger hooks to avoid revalidation on every view
      context: {
        skipRevalidation: true,
      },
    });

    return { tracked: true };
  } catch (error) {
    console.error("[Analytics] Error tracking page view:", error);
    return { tracked: false, reason: "error" };
  }
}
