import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { trackPageView } from "@lib/analytics";

/**
 * POST /next_api/analytics/track
 *
 * Internal endpoint for tracking page views.
 * Called by middleware to record unique visitor sessions.
 *
 * Body: { path: string }
 * Headers: x-forwarded-for, user-agent (forwarded from original request)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { path } = body as { path?: string };

    if (!path || typeof path !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid path" },
        { status: 400 },
      );
    }

    const result = await trackPageView({
      path,
      headers: request.headers,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[Analytics API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
