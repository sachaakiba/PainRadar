import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { sendNewUserNotification } from "@/lib/user-notifications";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

async function getUserLocale(userId: string): Promise<string> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { locale: true },
  });
  return user?.locale ?? "en";
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://pain-radar-phi.vercel.app",
    "https://pain-radar.com",
    "https://www.pain-radar.com",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const locale = await getUserLocale(user.id);
      void sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        url,
        locale,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const locale = await getUserLocale(user.id);
      void sendVerificationEmail({
        to: user.email,
        name: user.name,
        url,
        locale,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  user: {
    additionalFields: {
      locale: { type: "string", required: false },
      role: { type: "string", required: false },
      plan: { type: "string", required: false },
      planManagedManually: { type: "boolean", required: false },
      stripeCustomerId: { type: "string", required: false },
      stripeSubscriptionId: { type: "string", required: false },
      planExpiresAt: { type: "date", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendNewUserNotification({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
          });
        },
      },
    },
  },
});
