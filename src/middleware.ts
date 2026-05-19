import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// NOTE: The Map-based rate limiter was removed.
// On Vercel, each serverless Lambda has isolated memory — the Map resets on
// every cold start, making per-IP counters meaningless and causing false 429s.
// For real rate limiting on Vercel, use Upstash Redis + @upstash/ratelimit.

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY || "YOUR_SUPER_SECRET_KEY_FOR_JWT_SIGNING";
    if (!secret || secret.length === 0) {
        throw new Error("The environment variable JWT_SECRET_KEY is not set.");
    }
    return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Let auth pages and public API routes pass through
    if (pathname.startsWith("/login") || pathname.startsWith("/api") || pathname === "/") {
        return NextResponse.next();
    }

    // Check for secure HttpOnly session token cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const verified = await jwtVerify(token, getJwtSecretKey());
        const sessionRole = verified.payload.role as string;

        // Strict Role-based access control (RBAC)
        if (pathname.startsWith("/student") && sessionRole !== "student") {
            if (sessionRole === "faculty") return NextResponse.redirect(new URL("/faculty/dashboard", request.url));
            if (sessionRole === "coordinator") return NextResponse.redirect(new URL("/coordinator/dashboard", request.url));
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (pathname.startsWith("/faculty") && sessionRole !== "faculty") {
            if (sessionRole === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
            if (sessionRole === "coordinator") return NextResponse.redirect(new URL("/coordinator/dashboard", request.url));
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (pathname.startsWith("/coordinator") && sessionRole !== "coordinator") {
            if (sessionRole === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
            if (sessionRole === "faculty") return NextResponse.redirect(new URL("/faculty/dashboard", request.url));
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("JWT Verification failed:", error);
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth_token");
        return response;
    }
}

export const config = {
    matcher: ["/student/:path*", "/faculty/:path*", "/coordinator/:path*", "/login"],
};
