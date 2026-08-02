import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

// NB: le middleware tourne en Edge runtime, incompatible avec `jsonwebtoken`
// (basé sur le module `crypto` de Node). On se limite donc ici à une
// vérification rapide de présence du cookie pour une redirection immédiate ;
// la vérification cryptographique complète du JWT est faite côté
// Server Components / Route Handlers (runtime Node.js) via `getAdminSession()`.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
