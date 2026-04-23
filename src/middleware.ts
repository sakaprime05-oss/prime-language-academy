import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;
    const role = req.auth?.user?.role;

    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/api/auth");
    const isProtectedRoute = pathname.startsWith("/dashboard");

    // Si c'est une route d'authentification
    if (isAuthRoute) {
        if (isLoggedIn && pathname === "/login") {
            // Rediriger selon le rôle
            if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
            if (role === "TEACHER") return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
            return NextResponse.redirect(new URL("/dashboard/student", req.url));
        }
        return NextResponse.next();
    }

    // Si route protégée mais pas connecté → login
    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ======= PROTECTION PAR RÔLE =======

    // Routes Admin : accessibles UNIQUEMENT aux ADMIN
    if (pathname.startsWith("/dashboard/admin")) {
        if (role !== "ADMIN") {
            // Rediriger vers leur propre dashboard
            if (role === "TEACHER") return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
            return NextResponse.redirect(new URL("/dashboard/student", req.url));
        }
    }

    // Routes Teacher : accessibles UNIQUEMENT aux TEACHER
    if (pathname.startsWith("/dashboard/teacher")) {
        if (role !== "TEACHER") {
            if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
            return NextResponse.redirect(new URL("/dashboard/student", req.url));
        }
    }

    // Routes Student : accessibles UNIQUEMENT aux STUDENT
    if (pathname.startsWith("/dashboard/student")) {
        if (role !== "STUDENT") {
            if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
            if (role === "TEACHER") return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
