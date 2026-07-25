import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Private Beta Access",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || typeof credentials.email !== "string") {
          logger.warn("AUTH_ATTEMPT_MISSING_EMAIL");
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const allowedEmails = env.ALLOWED_BETA_EMAILS.split(",").map((e) => e.trim().toLowerCase());

        const isAllowed = allowedEmails.includes(email) || allowedEmails.includes("*");
        if (!isAllowed) {
          logger.warn("AUTH_DENIED_NOT_IN_BETA_COHORT", { email });
          return null;
        }

        try {
          let user = await db.user.findUnique({ where: { email } });
          if (!user) {
            user = await db.user.create({
              data: {
                email,
                name: email.split("@")[0],
              },
            });
            logger.info("BETA_USER_CREATED", { userId: user.id, email });
          } else {
            logger.info("BETA_USER_AUTHENTICATED", { userId: user.id, email });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (err) {
          logger.error("AUTH_DB_ERROR", err, { email });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: env.AUTH_SECRET,
});
