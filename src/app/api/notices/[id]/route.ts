import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { firebaseId, title, body: noticeBody, type } = body;

        if (!firebaseId || !id) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });

        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const updated = await prisma.notice.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(noticeBody && { body: noticeBody }),
                ...(type && { type: type.toUpperCase() })
            }
        });

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error("Notice Update Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update notice" }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { searchParams } = new URL(request.url);
        const firebaseId = searchParams.get('firebaseId');

        if (!firebaseId || !id) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });

        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.notice.delete({ where: { id } });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Notice Delete Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete notice" }, { status: 500 });
    }
}
