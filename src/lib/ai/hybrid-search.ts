import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ThoughtItem } from "@/lib/types/thought";

export interface HybridSearchResult extends ThoughtItem {
  score: number;
  semanticScore: number;
  exactScore: number;
  matchType: "hybrid" | "exact" | "semantic";
}

function generateQueryVector(query: string): number[] {
  const vector: number[] = new Array(768);
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  let sumSq = 0;
  for (let i = 0; i < 768; i++) {
    const val = Math.sin(hash + i * 1.618);
    vector[i] = val;
    sumSq += val * val;
  }
  const norm = Math.sqrt(sumSq) || 1;
  return vector.map((v) => v / norm);
}

export async function executeHybridSearch(
  query: string,
  userId: string,
  limit = 10
): Promise<{ results: HybridSearchResult[]; latencyMs: number }> {
  const startTime = Date.now();
  const trimmed = query.trim();

  if (!trimmed) {
    return { results: [], latencyMs: Date.now() - startTime };
  }

  try {
    const queryVector = generateQueryVector(trimmed);
    const vectorStr = `[${queryVector.join(",")}]`;
    const likePattern = `%${trimmed}%`;

    interface RawHybridRow {
      id: string;
      userId: string;
      rawContent: string;
      summary: string | null;
      entities: string[];
      isArchived: boolean;
      createdAt: Date;
      updatedAt: Date;
      semantic_score: number;
      exact_score: number;
    }

    const rawRows = (await db.$queryRawUnsafe(
      `SELECT t.id, t."userId", t."rawContent", t.summary, t.entities, t."isArchived", t."createdAt", t."updatedAt",
              COALESCE(1 - (e.vector <=> $1::vector), 0.0) as semantic_score,
              CASE WHEN t."rawContent" ILIKE $2 OR t.summary ILIKE $2 THEN 1.0 ELSE 0.0 END as exact_score
       FROM "Thought" t
       LEFT JOIN "Embedding" e ON t.id = e."thoughtId"
       WHERE t."userId" = $3 AND t."isArchived" = false
         AND (
           t."rawContent" ILIKE $2
           OR t.summary ILIKE $2
           OR (e.vector IS NOT NULL AND (1 - (e.vector <=> $1::vector)) >= 0.3)
         )
       LIMIT $4;`,
      vectorStr,
      likePattern,
      userId,
      limit * 2
    )) as RawHybridRow[];

    const scored = rawRows.map((row: RawHybridRow) => {
      const semanticScore = Number(row.semantic_score) || 0;
      const exactScore = Number(row.exact_score) || 0;
      const score = Number((semanticScore * 0.7 + exactScore * 0.3).toFixed(4));

      let matchType: "hybrid" | "exact" | "semantic" = "semantic";
      if (exactScore > 0 && semanticScore >= 0.4) {
        matchType = "hybrid";
      } else if (exactScore > 0) {
        matchType = "exact";
      }

      return {
        id: row.id,
        userId: row.userId,
        rawContent: row.rawContent,
        summary: row.summary,
        entities: row.entities || [],
        isArchived: row.isArchived,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        score,
        semanticScore,
        exactScore,
        matchType,
      };
    });

    scored.sort((a: HybridSearchResult, b: HybridSearchResult) => b.score - a.score);
    const results = scored.slice(0, limit);

    return { results, latencyMs: Date.now() - startTime };
  } catch (err) {
    logger.error("HYBRID_SEARCH_ERROR", err, { query, userId });
    return { results: [], latencyMs: Date.now() - startTime };
  }
}
