import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function getDb() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const db = getDb();
        const { data: user } = await db
          .from("users")
          .select("id, email, name, image, password")
          .eq("email", credentials.email)
          .single();

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],

  callbacks: {
    // Google 로그인 시 Supabase users 테이블에 자동 저장
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const db = getDb();

        const { data: existing } = await db
          .from("users")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (existing) {
          token.id = existing.id;
        } else {
          const { data: created } = await db
            .from("users")
            .insert({
              name: user.name,
              email: user.email,
              image: user.image,
              email_verified: new Date().toISOString(),
            })
            .select("id")
            .single();

          if (created) token.id = created.id;
        }
      }

      if (user?.id && !token.id) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
