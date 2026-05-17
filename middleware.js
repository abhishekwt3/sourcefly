import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "kendra_session";
const ADMIN_COOKIE_NAME = "kendra_admin";

const PUBLIC_PREFIXES = [
  "/auth",
  "/api/auth",
  "/_next",
  "/favicon",
];

const AUTH_REQUIRED_PREFIXES = [
  "/onboarding",
  "/seller",
  "/api/profile",
  "/api/recommendations",
  "/api/imagekit",
];

async function readSession(token, secret) {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return { userId: payload.userId, role: payload.role ?? null };
  } catch {
    return null;
  }
}

async function verifyAdminToken(token, secret) {
  if (!token || !secret) return null;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret + "_admin"));
    return { admin: true };
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // Admin routes — separate auth
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const adminSession = await verifyAdminToken(adminToken, process.env.SESSION_SECRET);
    if (!adminSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Public assets and auth endpoints — always pass
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const needsAuth = AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = await readSession(token, process.env.SESSION_SECRET);

  // Force role selection for any authenticated user who hasn't picked one
  if (session && !session.role && !pathname.startsWith("/onboarding/role")) {
    if (needsAuth || pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding/role";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (needsAuth && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/phone";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Role fences
  if (session?.role === "BUYER" && pathname.startsWith("/onboarding/seller")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  if (session?.role === "SELLER" && pathname.startsWith("/onboarding/buyer")) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
