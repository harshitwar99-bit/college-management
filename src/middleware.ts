import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Simple in-memory rate limiter for Edge
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 200; // Max requests per IP per minute

function rateLimit(ip: string): boolean {
    const now = Date.now();
    let record = rateLimitMap.get(ip);
    
    if (!record) {
        record = { count: 1, lastReset: now };
        rateLimitMap.set(ip, record);
        return true;
    }

    if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
        record.count = 1;
        record.lastReset = now;
        return true;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    record.count += 1;
    return true;
}

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY || "YOUR_SUPER_SECRET_KEY_FOR_JWT_SIGNING";
    if (!secret || secret.length === 0) {
        throw new Error("The environment variable JWT_SECRET_KEY is not set.");
    }
    return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    
    // Apply rate limiting
    if (!rateLimit(ip)) {
        return new NextResponse("Too Many Requests", { status: 429 });
    }

    const { pathname } = request.nextUrl;

    // Let auth pages and API routes pass through
    if (pathname.startsWith("/login") || pathname.startsWith("/api") || pathname === "/") {
        return NextResponse.next();
    }

    // Check for secure HttpOnly session token cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        // Cryptographically Verify JWT Token
        const verified = await jwtVerify(token, getJwtSecretKey());
        const sessionRole = verified.payload.role as string;

        // Strict Role-based access control (RBAC)
        if (pathname.startsWith("/student") && sessionRole !== "student") {
            if (sessionRole === "faculty") {
                return NextResponse.redirect(new URL("/faculty/dashboard", request.url));
            } else if (sessionRole === "coordinator") {
                return NextResponse.redirect(new URL("/coordinator/dashboard", request.url));
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (pathname.startsWith("/faculty") && sessionRole !== "faculty") {
            if (sessionRole === "student") {
                return NextResponse.redirect(new URL("/student/dashboard", request.url));
            } else if (sessionRole === "coordinator") {
                return NextResponse.redirect(new URL("/coordinator/dashboard", request.url));
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (pathname.startsWith("/coordinator") && sessionRole !== "coordinator") {
            if (sessionRole === "student") {
                return NextResponse.redirect(new URL("/student/dashboard", request.url));
            } else if (sessionRole === "faculty") {
                return NextResponse.redirect(new URL("/faculty/dashboard", request.url));
            }
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        // If JWT tampering is detected, it throws here
        console.error("JWT Verification failed in middleware:", error);

        // Clear the bad cookie and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth_token");
        return response;
    }
}

export const config = {
    matcher: ["/student/:path*", "/faculty/:path*", "/coordinator/:path*", "/login"],
};
