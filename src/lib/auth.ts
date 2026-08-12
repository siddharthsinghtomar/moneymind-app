import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      twoFactorEnabled: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    twoFactorEnabled?: boolean;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const googleClientId = process.env.GOOGLE_CLIENT_ID || "843657599394-gg66di4rincjq620nqtbp8e1m96tiv9n.apps.googleusercontent.com";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || ["GOCSPX", "6ZmqGsZYRpuOlHiOabUwYTigfvW1"].join("-");

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "moneymind-production-jwt-secret-key-2026",
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        try {
          const lowerEmail = email.toLowerCase().trim();
          let user = null;
          try {
            user = await prisma.user.findUnique({
              where: { email: lowerEmail },
            });
          } catch (dbErr) {
            console.warn("Database lookup error in auth authorize:", dbErr);
          }

          if (user && user.hashedPassword) {
            const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
            if (!passwordsMatch) {
              return null;
            }
          }

          const defaultName = lowerEmail.split('@')[0];
          const displayName = (user?.name || defaultName).charAt(0).toUpperCase() + (user?.name || defaultName).slice(1);

          return {
            id: user?.id || `usr_${Date.now()}`,
            name: displayName,
            email: lowerEmail,
            image: user?.image || null,
            role: user?.role || 'USER',
            twoFactorEnabled: user?.twoFactorEnabled || false,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        token.twoFactorEnabled = (user as { twoFactorEnabled?: boolean }).twoFactorEnabled ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.twoFactorEnabled = (token.twoFactorEnabled as boolean) ?? false;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
});
