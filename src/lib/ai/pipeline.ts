import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

const EMBEDDING_MODEL = "text-embedding-3-small";
const VECTOR_DIMENSION = 1536;

function generateFallbackEmbedding(text: string): number[] {
  const vector: number[] = new Array(VECTOR_DIMENSION);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  let sumSq = 0;
  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    const val = Math.sin(hash + i * 1.618);
    vector[i] = val;
    sumSq += val * val;
  }
  const norm = Math.sqrt(sumSq) || 1;
  return vector.map((v) => v / norm);
}

async function getEmbedding(text: string): Promise<{ vector: number[]; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { vector: generateFallbackEmbedding(text), model: EMBEDDING_MODEL };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input: text, model: EMBEDDING_MODEL }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.statusText}`);
    const json = await res.json();
    const vector = json.data[0].embedding as number[];
    return { vector, model: EMBEDDING_MODEL };
  } catch (err) {
    logger.warn("OPENAI_EMBEDDING_FALLBACK", { error: String(err) });
    return { vector: generateFallbackEmbedding(text), model: EMBEDDING_MODEL };
  }
}

function extractSummaryAndEntities(text: string): { summary: string; entities: string[] } {
  const clean = text.trim();
  const firstSentence = clean.split(/[.!?\n]/)[0] || clean;
  const summary = firstSentence.length > 150 ? `${firstSentence.slice(0, 147)}...` : firstSentence;

  const hashtagMatches = clean.match(/#[\w-]+/g) || [];
  const hashtags = hashtagMatches.map((t) => t.replace("#", "").toLowerCase());

  const words = clean
    .split(/\s+/)
    .map((w) => w.replace(/[^\w]/g, ""))
    .filter((w) => w.length > 3 && /^[A-Z]/.test(w));

  const capitalizedEntities = Array.from(new Set(words));
  const combined = Array.from(new Set([...hashtags, ...capitalizedEntities]));
  const entities = combined.length > 0 ? combined : ["uncategorized"];

  return { summary, entities };
}

export async function processThoughtBackground(thoughtId: string, rawContent: string): Promise<void> {
  const startTime = Date.now();
  try {
    const { vector, model } = await getEmbedding(rawContent);
    const { summary, entities } = extractSummaryAndEntities(rawContent);

    const vectorStr = `[${vector.join(",")}]`;

    await db.$executeRawUnsafe(
      `INSERT INTO "Embedding" ("id", "thoughtId", "vector", "model", "createdAt")
       VALUES (gen_random_uuid(), $1, $2::vector, $3, NOW())
       ON CONFLICT ("thoughtId") DO UPDATE
       SET "vector" = $2::vector, "model" = $3;`,
      thoughtId,
      vectorStr,
      model
    );

    const thought = await db.thought.update({
      where: { id: thoughtId },
      data: { summary, entities },
    });

    for (const entityName of entities) {
      if (entityName !== "uncategorized") {
        await db.summary.upsert({
          where: { id: `${thought.userId}-${entityName}` },
          create: {
            id: `${thought.userId}-${entityName}`,
            userId: thought.userId,
            entityName,
            condensedContext: `Context derived from thought: ${summary}`,
          },
          update: {
            condensedContext: `Updated memory context from thought: ${summary}`,
          },
        }).catch(() => null);
      }
    }

    logger.info(
      "THOUGHT_AI_PROCESSED",
      {
        durationMs: Date.now() - startTime,
        vectorDimension: vector.length,
        entityCount: entities.length,
      },
      thought.userId
    );
  } catch (error) {
    logger.error("THOUGHT_AI_PROCESSING_FAILED", error, { thoughtId });
  }
}
