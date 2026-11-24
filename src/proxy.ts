import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Checagem otimista: sem sessão, /admin/** redireciona para o login.
// Cada página e Server Action do painel confere a sessão de novo (requireAdmin).
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
