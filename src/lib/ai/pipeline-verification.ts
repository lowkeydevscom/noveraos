import { db } from "../db";
import { createThoughtAction, updateThoughtAction } from "../actions/thought-actions";

async function verifyPipeline() {
  console.log("--- Starting AI Background Pipeline Verification ---");

  const startCreate = Date.now();
  const createRes = await createThoughtAction({
    rawContent: "Architecting NoveraOS background processing pipeline with #pgvector and OpenAI #embeddings.",
  });
  const createDuration = Date.now() - startCreate;

  if (!createRes.success) {
    throw new Error(`Failed to create thought: ${createRes.error}`);
  }

  const thoughtId = createRes.data.id;
  console.log(`[PASS] Thought created instantly in ${createDuration}ms (ID: ${thoughtId}).`);

  // Poll database for 1536-dimensional embedding, summary, and entities (max 3 seconds)
  const pollStart = Date.now();
  let embeddingFound = false;
  let embeddingVectorLength = 0;
  let summaryText: string | null = null;
  let entityCount = 0;

  while (Date.now() - pollStart < 3000) {
    const rawRows = (await db.$queryRawUnsafe(
      `SELECT COUNT(*)::bigint as count, vector_dims("vector") as dim FROM "Embedding" WHERE "thoughtId" = $1 GROUP BY "vector";`,
      thoughtId
    )) as Array<{ count: bigint; dim: number }>;

    const thought = await db.thought.findUnique({
      where: { id: thoughtId },
    });

    if (rawRows.length > 0 && thought?.summary && thought?.entities?.length > 0) {
      embeddingFound = true;
      embeddingVectorLength = rawRows[0].dim;
      summaryText = thought.summary;
      entityCount = thought.entities.length;
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const elapsedCreateEnrich = Date.now() - pollStart;

  if (!embeddingFound) {
    throw new Error(`[FAIL] Embedding did not appear in database within 3 seconds!`);
  }

  console.log(
    `[PASS] Created thought embedding verified in DB within ${elapsedCreateEnrich}ms (< 3s target).`
  );
  console.log(`  - Vector dimension: ${embeddingVectorLength} (Expected: 768)`);
  console.log(`  - Generated Summary: "${summaryText}"`);
  console.log(`  - Extracted Entities: ${entityCount}`);

  if (embeddingVectorLength !== 768) {
    throw new Error(`[FAIL] Vector dimension is ${embeddingVectorLength}, expected 768!`);
  }

  // Test thought update pipeline
  console.log("\n--- Testing Thought Update AI Background Pipeline ---");
  const updateContent = "Updating thought content with new AI workspace features and #vector search optimization.";
  const updateRes = await updateThoughtAction({
    id: thoughtId,
    rawContent: updateContent,
  });

  if (!updateRes.success) {
    throw new Error(`Failed to update thought: ${updateRes.error}`);
  }

  const updatePollStart = Date.now();
  let updatedSummary: string | null = null;

  while (Date.now() - updatePollStart < 3000) {
    const thought = await db.thought.findUnique({
      where: { id: thoughtId },
    });

    if (thought?.summary && thought.summary.includes("Updating thought content")) {
      updatedSummary = thought.summary;
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const elapsedUpdateEnrich = Date.now() - updatePollStart;

  if (!updatedSummary) {
    throw new Error(`[FAIL] Updated thought summary did not appear in database within 3 seconds!`);
  }

  console.log(`[PASS] Updated thought pipeline verified in DB within ${elapsedUpdateEnrich}ms (< 3s target).`);
  console.log(`  - Updated Summary: "${updatedSummary}"`);

  // Cleanup test data
  await db.thought.delete({ where: { id: thoughtId } });
  console.log("\n[SUCCESS] AI Background Pipeline Verification completed successfully!");
  process.exit(0);
}

verifyPipeline().catch((err) => {
  console.error("\n[ERROR] Pipeline verification failed:", err);
  process.exit(1);
});
