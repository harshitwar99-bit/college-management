import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Merges a Firebase Auth login with the PostgreSQL Database.
 * If the user exists in Postgres, it returns them. 
 * If they don't (first login), it creates their record in Postgres based on Firebase info.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, email, name, role, phone } = body;

        if (!firebaseId || !email) {
            return NextResponse.json({ success: false, error: "Missing core user identifiers" }, { status: 400 });
        }

        const prisma = getPrisma();
        // 1. Check if user already exists
        let user = await prisma.user.findUnique({
            where: { firebaseId: firebaseId }
        });

        // 2. If not, create them (first time login sync)
        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebaseId,
                    email,
                    name: name || email.split('@')[0],
                    role: role || 'STUDENT',
                    phone: phone || null
                }
            });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });

    } catch (error) {
        console.error("Firebase to Postgres Sync Error:", error);
        return NextResponse.json({ success: false, error: "Database synchronization failed" }, { status: 500 });
    }
}
