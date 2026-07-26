import { auth } from "@/lib/auth";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ThoughtItem } from "@/lib/types/thought";

export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function getAuthenticatedUserId(idToken?: string): Promise<string | null> {
  if (idToken) {
    const firebaseUser = await verifyFirebaseIdToken(idToken);
    if (firebaseUser?.uid) {
      return firebaseUser.uid;
    }
  }

  try {
    const session = await auth();
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch (err) {
    logger.warn("AUTH_SESSION_CHECK_FAILED", { error: String(err) });
  }

  if (process.env.NODE_ENV === "development") {
    try {
      const existingUser = await db.user.findUnique({ where: { id: DEMO_USER_ID } });
      if (!existingUser) {
        await db.user.create({
          data: { id: DEMO_USER_ID, email: "demo@noveraos.local", name: "Demo User" },
        });
      }
    } catch (err) {
      logger.warn("DEMO_USER_PROVISION_WARNING", { error: String(err) });
    }
    return DEMO_USER_ID;
  }

  return null;
}

export function mapThoughtItem(thought: {
  id: string;
  userId: string;
  rawContent: string;
  summary: string | null;
  entities: string[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ThoughtItem {
  return {
    id: thought.id,
    userId: thought.userId,
    rawContent: thought.rawContent,
    summary: thought.summary,
    entities: thought.entities,
    isArchived: thought.isArchived,
    createdAt: thought.createdAt.toISOString(),
    updatedAt: thought.updatedAt.toISOString(),
  };
}
