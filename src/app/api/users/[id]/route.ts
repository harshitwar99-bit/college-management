import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const prisma = getPrisma();

        const updated = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                role: body.role?.toUpperCase(),
                collegeRollNo: body.dept
            }
        });

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error("User Update Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const prisma = getPrisma();

        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("User Delete Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
    }
}
