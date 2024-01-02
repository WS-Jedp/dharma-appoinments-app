import { PrismaClient, UserRole } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/server/prisma";
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/",
    error: "/"
  },
  callbacks: {
    jwt({ token, user }) {
        if(user) {
            token.id = user.id
            token.role = user.role
        }
        return token
    },
    session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id as number;
      session.user.role = token.role as UserRole;
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
