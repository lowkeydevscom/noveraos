import { NextRequest, NextResponse } from "next/server";
import { retrieveSemanticContext } from "@/lib/ai/rag";
import { WORKSPACE_SYNTHESIZER_SYSTEM_PROMPT, assembleRAGPrompt } from "@/lib/ai/prompts/workspace-synthesizer";
import { getAuthenticatedUserId } from "@/lib/actions/action-utils";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      logger.warn("CHAT_UNAUTHORIZED_ACCESS");
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    logger.info("CHAT_QUERY_RECEIVED", { userId, queryLength: lastUserMessage.length });

    const retrievedThoughts = await retrieveSemanticContext(lastUserMessage, userId, 8);
    const ragContext = assembleRAGPrompt(retrievedThoughts);

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (apiKey) {
      const formattedContents = messages.slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || "" }],
      }));

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: `${WORKSPACE_SYNTHESIZER_SYSTEM_PROMPT}\n\n${ragContext}` }],
            },
            contents: formattedContents,
          }),
        }
      );

      if (geminiRes.ok && geminiRes.body) {
        const reader = geminiRes.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const transformStream = new ReadableStream({
          async start(controller) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                  const trimmed = line.trim();
                  if (trimmed.startsWith("data: ")) {
                    const dataStr = trimmed.slice(6);
                    try {
                      const json = JSON.parse(dataStr);
                      const chunkText = json.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (chunkText) {
                        controller.enqueue(
                          encoder.encode(
                            `data: ${JSON.stringify({ choices: [{ delta: { content: chunkText } }] })}\n\n`
                          )
                        );
                      }
                    } catch {
                      // Skip invalid json frames
                    }
                  }
                }
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            } catch (streamErr) {
              controller.error(streamErr);
            }
          },
        });

        return new Response(transformStream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }
    }

    let responseText = "";
    if (retrievedThoughts.length === 0) {
      responseText = "I do not have enough recorded thoughts in your NoveraOS memory to answer this question accurately.";
    } else {
      const topThought = retrievedThoughts[0];
      const summaryOrContent = topThought.summary || topThought.rawContent;
      responseText = `Based on your recorded memory, ${summaryOrContent.trim()} [Thought #${topThought.index}].`;

      if (retrievedThoughts.length > 1) {
        const secondThought = retrievedThoughts[1];
        responseText += ` Additionally, you noted "${(secondThought.summary || secondThought.rawContent).slice(0, 100)}" [Thought #${secondThought.index}].`;
      }
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = responseText.match(/.{1,10}/g) || [responseText];
        for (const chunk of chunks) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`)
          );
          await new Promise((r) => setTimeout(r, 20));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    logger.error("CHAT_API_ERROR", err);
    const errorMsg = err instanceof Error ? err.message : "Chat API Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
