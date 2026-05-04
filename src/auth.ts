import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";
import { authConfig } from "./auth.config";
import { rateLimit, rateLimitKey } from "./lib/rate-limit";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"];
    }
    interface User {
        id: string;
        role: string;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const email = String(credentials.email).toLowerCase().trim();
                    const limited = rateLimit(rateLimitKey("login", email), 8, 15 * 60 * 1000);
                    if (!limited.ok) return null;

                    const user = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (!user) return null;

                    const canAccess =
                        user.status === "ACTIVE" || (user.role === "STUDENT" && user.status === "PENDING");

                    if (!canAccess) return null;

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash
                    );

                    if (!isPasswordValid) return null;

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
});
