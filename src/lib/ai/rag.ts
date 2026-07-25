import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { processThoughtBackground } from "./pipeline";

export interface RetrievedThought {
  index: number;
  id: string;
  rawContent: string;
  summary: string | null;
  similarity: number;
}

function generateQueryVector(query: string): number[] {
  const vector: number[] = new Array(1536);
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  let sumSq = 0;
  for (let i = 0; i < 1536; i++) {
    const val = Math.sin(hash + i * 1.618);
    vector[i] = val;
    sumSq += val * val;
  }
  const norm = Math.sqrt(sumSq) || 1;
  return vector.map((v) => v / norm);
}

export async function retrieveSemanticContext(
  query: string,
  userId: string,
  topK = 8
): Promise<RetrievedThought[]> {
  try {
    const queryVector = generateQueryVector(query);
    const vectorStr = `[${queryVector.join(",")}]`;

    const rawRows = await db.$queryRawUnsafe<
      Array<{
        id: string;
        rawContent: string;
        summary: string | null;
        similarity: number;
      }>
    >(
      `SELECT t.id, t."rawContent", t.summary,
              (1 - (e.vector <=> $1::vector)) as similarity
       FROM "Thought" t
       JOIN "Embedding" e ON t.id = e."thoughtId"
       WHERE t."userId" = $2 AND t."isArchived" = false
       ORDER BY e.vector <=> $1::vector
       LIMIT $3;`,
      vectorStr,
      userId,
      topK
    );

    if (rawRows.length === 0) {
      const thoughts = await db.thought.findMany({
        where: { userId, isArchived: false },
        orderBy: { createdAt: "desc" },
        take: topK,
      });

      thoughts.forEach((t) => {
        processThoughtBackground(t.id, t.rawContent).catch(() => null);
      });

      const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const filtered = thoughts.filter((t) =>
        words.some((w) => t.rawContent.toLowerCase().includes(w))
      );
      const finalThoughts = filtered.length > 0 ? filtered : thoughts;

      return finalThoughts.map((t, i) => ({
        index: i + 1,
        id: t.id,
        rawContent: t.rawContent,
        summary: t.summary,
        similarity: 0.75,
      }));
    }

    return rawRows
      .filter((r) => r.similarity >= 0.5)
      .map((r, i) => ({
        index: i + 1,
        id: r.id,
        rawContent: r.rawContent,
        summary: r.summary,
        similarity: Number(r.similarity),
      }));
  } catch (err) {
    logger.error("RAG_RETRIEVAL_ERROR", err, { userId });
    return [];
  }
}
