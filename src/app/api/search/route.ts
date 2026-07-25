// Added by Antigravity
import { NextRequest, NextResponse } from "next/server";
import { executeHybridSearch } from "@/lib/ai/hybrid-search";
import { getAuthenticatedUserId } from "@/lib/actions/action-utils";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      logger.warn("SEARCH_UNAUTHORIZED_ACCESS");
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    logger.info("SEARCH_EXECUTE", { userId, query });
    const { results, latencyMs } = await executeHybridSearch(query, userId, 10);

    return NextResponse.json({
      success: true,
      query,
      results,
      latencyMs,
    });
  } catch (err: unknown) {
    logger.error("SEARCH_API_ERROR", err);
    const message = err instanceof Error ? err.message : "Search API Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
