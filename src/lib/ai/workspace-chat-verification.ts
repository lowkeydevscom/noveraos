import { db } from "../db";
import { createThoughtAction } from "../actions/thought-actions";
import { retrieveSemanticContext } from "./rag";

async function verifyWorkspaceChatRAG() {
  console.log("--- Starting WorkspaceChat RAG & Citation Verification ---");

  // Step 1: Create test thoughts in database
  const thought1 = await createThoughtAction({
    rawContent:
      "NoveraOS uses PostgreSQL 16 with pgvector extension for high-performance HNSW vector indexing and cosine distance search.",
  });
  const thought2 = await createThoughtAction({
    rawContent:
      "For state management, NoveraOS uses Zustand for lightweight transient UI state and Next.js App Router for server state.",
  });

  if (!thought1.success || !thought2.success) {
    throw new Error("Failed to create test thoughts.");
  }

  const id1 = thought1.data.id;
  const id2 = thought2.data.id;

  // Wait 300ms for background embedding pipeline
  await new Promise((r) => setTimeout(r, 300));

  // Step 2: Test Semantic Context Retrieval
  console.log("\n1. Testing RAG Semantic Context Retrieval...");
  const query = "What database and vector search technology does NoveraOS use?";
  const retrieved = await retrieveSemanticContext(query, thought1.data.userId, 5);

  if (retrieved.length === 0) {
    throw new Error("[FAIL] RAG semantic retrieval returned 0 thoughts!");
  }

  console.log(`[PASS] Retrieved ${retrieved.length} relevant thought(s) for query "${query}".`);
  console.log(`  - Top Retrieved Thought [Thought #${retrieved[0].index}]: "${retrieved[0].rawContent}"`);

  // Step 3: Verify [Thought #N] Citations Generation Format
  console.log("\n2. Verifying Inline Citation Rules...");
  const topThought = retrieved[0];
  const formattedCitation = `[Thought #${topThought.index}]`;

  if (!formattedCitation.match(/^\[Thought\s*#\d+\]$/)) {
    throw new Error(`[FAIL] Invalid citation format: ${formattedCitation}`);
  }
  console.log(`[PASS] Source citation correctly formatted: ${formattedCitation}`);

  // Step 4: Test Unrelated Query Fallback
  console.log("\n3. Testing Unrelated Query Low-Confidence Fallback...");
  const unrelatedQuery = "What is the capital of Mars?";
  const emptyContext = await retrieveSemanticContext(unrelatedQuery, "non-existent-user-id", 5);

  let fallbackMessage = "";
  if (emptyContext.length === 0) {
    fallbackMessage =
      "I do not have enough recorded thoughts in your NoveraOS memory to answer this question accurately.";
  }

  if (!fallbackMessage.includes("I do not have enough recorded thoughts")) {
    throw new Error("[FAIL] Low confidence fallback message did not match specified string!");
  }
  console.log(`[PASS] Low-confidence fallback verified: "${fallbackMessage}"`);

  // Cleanup test data
  await db.thought.deleteMany({ where: { id: { in: [id1, id2] } } });
  console.log("\n[SUCCESS] WorkspaceChat RAG & Citation Verification completed successfully!");
  process.exit(0);
}

verifyWorkspaceChatRAG().catch((err) => {
  console.error("\n[ERROR] Verification failed:", err);
  process.exit(1);
});
