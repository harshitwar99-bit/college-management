import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function PUT(request: Request) {
    try {
        const prisma = getPrisma();
        const body = await request.json();
        const { firebaseId, name, phone } = body;

        if (!firebaseId) {
            return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { firebaseId: firebaseId },
            data: {
                ...(name && { name }),
                ...(phone !== undefined && { phone })
            }
        });

        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
    }
}
