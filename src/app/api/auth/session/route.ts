import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY || "YOUR_SUPER_SECRET_KEY_FOR_JWT_SIGNING";
    if (!secret || secret.length === 0) {
        throw new Error("The environment variable JWT_SECRET_KEY is not set.");
    }
    return secret;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, role, email, name, action } = body;

        // Action: logout
        if (action === "logout") {
            const response = NextResponse.json({ success: true, message: "Logged out" });
            response.cookies.set({
                name: "auth_token",
                value: "",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 0,
            });
            return response;
        }

        if (!id || !role) {
            return NextResponse.json({ error: "Missing id or role" }, { status: 400 });
        }

        // Action: login/session creation
        const token = await new SignJWT({ id, role, email, name })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h") // Set token expiration
            .sign(new TextEncoder().encode(getJwtSecretKey()));

        const response = NextResponse.json({ success: true, message: "Session created" }, { status: 200 });

        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            // 24 hours in seconds
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch (error) {
        console.error("Session creation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
