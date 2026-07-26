import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

if (!getApps().length) {
  try {
    if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      logger.info("FIREBASE_ADMIN_INITIALIZED");
    } else {
      logger.warn("FIREBASE_ADMIN_MISSING_CREDENTIALS");
    }
  } catch (error) {
    logger.error("FIREBASE_ADMIN_INIT_ERROR", error);
  }
}

export const adminAuth: Auth | null = getApps().length ? getAuth() : null;

export async function verifyFirebaseIdToken(idToken: string) {
  if (!adminAuth) {
    logger.warn("FIREBASE_ADMIN_NOT_CONFIGURED");
    return null;
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error("FIREBASE_TOKEN_VERIFICATION_FAILED", error);
    return null;
  }
}
