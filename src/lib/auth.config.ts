import type { NextAuthConfig } from "next-auth";

/** Configuração sem dependências de Node (usada também pelo proxy). */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/admin/login") return true;
      if (pathname.startsWith("/admin")) return !!auth?.user;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "EDITOR";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        (session.user as { role?: string }).role = String(token.role ?? "EDITOR");
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
