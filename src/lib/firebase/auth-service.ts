import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "./client";
import { logger } from "@/lib/logger";

export async function loginWithEmail(email: string, pass: string): Promise<UserCredential> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    logger.info("FIREBASE_LOGIN_SUCCESS", { uid: cred.user.uid, email: cred.user.email });
    return cred;
  } catch (error) {
    logger.error("FIREBASE_LOGIN_ERROR", error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string): Promise<UserCredential> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    logger.info("FIREBASE_REGISTER_SUCCESS", { uid: cred.user.uid, email: cred.user.email });
    return cred;
  } catch (error) {
    logger.error("FIREBASE_REGISTER_ERROR", error);
    throw error;
  }
}

export async function loginWithGoogle(): Promise<UserCredential> {
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    logger.info("FIREBASE_GOOGLE_LOGIN_SUCCESS", { uid: cred.user.uid, email: cred.user.email });
    return cred;
  } catch (error) {
    logger.error("FIREBASE_GOOGLE_LOGIN_ERROR", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    logger.info("FIREBASE_LOGOUT_SUCCESS");
  } catch (error) {
    logger.error("FIREBASE_LOGOUT_ERROR", error);
    throw error;
  }
}
