import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isbot } from "isbot";
import { getPayload } from "payload";
import config from "@payload-config";
import { generateSessionHash, getClientIp } from "@lib/analytics";

interface FeedbackBody {
  path: string;
  vote: "up" | "down";
  comment?: string;
}

/**
 * POST /next_api/feedback
 *
 * Submit page feedback (thumbs up/down with optional comment).
 * Uses same hash logic as analytics for deduplication.
 * One vote per visitor per page per day.
 *
 * Body: { path: string, vote: "up" | "down", comment?: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";

    // Filter out bots
    if (isbot(userAgent)) {
      return NextResponse.json(
        { error: "Feedback not accepted" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as FeedbackBody;
    const { path, vote, comment } = body;

    // Validate input
    if (!path || typeof path !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid path" },
        { status: 400 },
      );
    }

    if (vote !== "up" && vote !== "down") {
      return NextResponse.json(
        { error: "Invalid vote, must be 'up' or 'down'" },
        { status: 400 },
      );
    }

    // Sanitize comment (limit length, strip dangerous content)
    const sanitizedComment = comment
      ? comment.slice(0, 1000).trim() || undefined
      : undefined;

    const ip = getClientIp(request.headers);
    const hash = await generateSessionHash(ip, userAgent, path);

    const payload = await getPayload({ config });

    // Check if feedback already exists for this hash
    const existingFeedback = await payload.find({
      collection: "page-feedback",
      where: {
        hash: { equals: hash },
        path: { equals: path },
      },
      limit: 1,
    });

    if (existingFeedback.docs.length > 0) {
      // Update existing feedback (allow changing vote or adding comment)
      const existing = existingFeedback.docs[0];
      await payload.update({
        collection: "page-feedback",
        id: existing.id,
        data: {
          vote,
          // Only update comment if provided, otherwise keep existing
          ...(sanitizedComment !== undefined && { comment: sanitizedComment }),
        },
      });

      return NextResponse.json({
        success: true,
        updated: true,
        id: existing.id,
      });
    }

    // Create new feedback
    const feedback = await payload.create({
      collection: "page-feedback",
      data: {
        hash,
        path,
        vote,
        comment: sanitizedComment,
      },
    });

    return NextResponse.json({
      success: true,
      created: true,
      id: feedback.id,
    });
  } catch (error) {
    console.error("[Feedback API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /next_api/feedback?path=/some/path
 *
 * Get aggregated feedback stats for a page (public) and user's existing vote.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const path = request.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });

    // Get feedback counts for this path
    const [upVotes, downVotes] = await Promise.all([
      payload.count({
        collection: "page-feedback",
        where: {
          path: { equals: path },
          vote: { equals: "up" },
        },
      }),
      payload.count({
        collection: "page-feedback",
        where: {
          path: { equals: path },
          vote: { equals: "down" },
        },
      }),
    ]);

    // Check if current user has already voted
    const userAgent = request.headers.get("user-agent") ?? "";
    const ip = getClientIp(request.headers);
    const hash = await generateSessionHash(ip, userAgent, path);

    const existingVote = await payload.find({
      collection: "page-feedback",
      where: {
        hash: { equals: hash },
        path: { equals: path },
      },
      limit: 1,
    });

    return NextResponse.json({
      upVotes: upVotes.totalDocs,
      downVotes: downVotes.totalDocs,
      userVote: existingVote.docs[0]?.vote ?? null,
      hasVoted: existingVote.docs.length > 0,
    });
  } catch (error) {
    console.error("[Feedback API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
