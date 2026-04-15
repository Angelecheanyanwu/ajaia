import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                    });

                    if (!user) {
                        const newUser = await prisma.user.create({
                            data: {
                                email: credentials.email as string,
                                password: await bcrypt.hash(
                                    credentials.password as string,
                                    10,
                                ),
                                name: (credentials.email as string).split(
                                    "@",
                                )[0],
                            },
                        });
                        return newUser;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password,
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
});
