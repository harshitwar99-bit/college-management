import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
    // Next.js dynamic route evaluation is handled by force-dynamic

    try {
        const prisma = getPrisma();
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                collegeRollNo: true,
                universityRollNo: true,
                createdAt: true,
                department: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json({ success: true, data: users }, { status: 200 });
    } catch (error: unknown) {
        console.error("Failed to fetch users:", error instanceof Error ? error.message : String(error));
        return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const prisma = getPrisma();
        const body = await request.json();

        const newUser = await prisma.user.create({
            data: {
                firebaseId: body.firebaseId,
                email: body.email,
                name: body.name,
                role: body.role,
                phone: body.phone,
            }
        });

        return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    } catch (error: unknown) {
        console.error("Failed to create user:", error instanceof Error ? error.message : String(error));
        return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
    }
}
