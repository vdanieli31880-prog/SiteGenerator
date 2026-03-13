import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/", // on redirigera sur l'accueil ou on fera une page de login dédiée
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // Optionnel: on peut attacher l'ID de l'utilisateur à la session
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
}
