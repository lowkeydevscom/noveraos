// Added by Antigravity
"use server";

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ActionResult, ThoughtItem } from "@/lib/types/thought";
import { createThoughtSchema, updateThoughtSchema, archiveThoughtSchema } from "@/lib/validations/thought";
import { processThoughtBackground } from "@/lib/ai/pipeline";
import { getAuthenticatedUserId, mapThoughtItem } from "./action-utils";

export async function createThoughtAction(input: { rawContent: string }): Promise<ActionResult<ThoughtItem>> {
  try {
    const validation = createThoughtSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || "Invalid payload.", code: "VALIDATION_ERROR" };
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized access.", code: "UNAUTHORIZED" };
    }

    const thought = await db.thought.create({
      data: { userId, rawContent: validation.data.rawContent },
    });

    logger.info("THOUGHT_CREATED", { userId, thoughtId: thought.id });

    processThoughtBackground(thought.id, thought.rawContent).catch((err) =>
      logger.error("BACKGROUND_PIPELINE_ERROR", err, { thoughtId: thought.id }, userId)
    );

    return { success: true, data: mapThoughtItem(thought) };
  } catch (err) {
    logger.error("CREATE_THOUGHT_ERROR", err);
    return { success: false, error: "Failed to create thought.", code: "DATABASE_ERROR" };
  }
}

export async function updateThoughtAction(input: { id: string; rawContent: string }): Promise<ActionResult<ThoughtItem>> {
  try {
    const validation = updateThoughtSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0]?.message || "Invalid payload.", code: "VALIDATION_ERROR" };
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized access.", code: "UNAUTHORIZED" };
    }

    const thought = await db.thought.update({
      where: { id: validation.data.id, userId },
      data: { rawContent: validation.data.rawContent },
    });

    logger.info("THOUGHT_UPDATED", { userId, thoughtId: thought.id });

    processThoughtBackground(thought.id, thought.rawContent).catch((err) =>
      logger.error("BACKGROUND_PIPELINE_ERROR", err, { thoughtId: thought.id }, userId)
    );

    return { success: true, data: mapThoughtItem(thought) };
  } catch (err) {
    logger.error("UPDATE_THOUGHT_ERROR", err);
    return { success: false, error: "Failed to update thought.", code: "DATABASE_ERROR" };
  }
}

export async function getThoughtsAction(): Promise<ActionResult<ThoughtItem[]>> {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized access.", code: "UNAUTHORIZED" };
    }

    const thoughts = await db.thought.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    logger.info("THOUGHTS_FETCHED", { userId, count: thoughts.length });

    return { success: true, data: thoughts.map(mapThoughtItem) };
  } catch (err) {
    logger.error("GET_THOUGHTS_ERROR", err);
    return { success: false, error: "Failed to fetch thoughts.", code: "DATABASE_ERROR" };
  }
}

export async function archiveThoughtAction(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const validation = archiveThoughtSchema.safeParse({ id });
    if (!validation.success) {
      return { success: false, error: "Invalid thought ID.", code: "VALIDATION_ERROR" };
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: "Unauthorized access.", code: "UNAUTHORIZED" };
    }

    await db.thought.update({
      where: { id: validation.data.id, userId },
      data: { isArchived: true },
    });

    logger.info("THOUGHT_ARCHIVED", { userId, thoughtId: id });

    return { success: true, data: { id } };
  } catch (err) {
    logger.error("ARCHIVE_THOUGHT_ERROR", err);
    return { success: false, error: "Failed to archive thought.", code: "DATABASE_ERROR" };
  }
}
