import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, assignmentId, fileUrl } = body;

        if (!firebaseId || !assignmentId) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const prisma = getPrisma();

        const user = await prisma.user.findUnique({ where: { firebaseId } });
        if (!user || user.role !== 'STUDENT') {
            return NextResponse.json({ success: false, error: "Unauthorized. Must be Student." }, { status: 403 });
        }

        const submission = await prisma.assignmentSubmission.create({
            data: {
                assignmentId,
                userId: user.id,
                status: 'submitted',
                marks: null,
                fileUrl: fileUrl || null
            }
        });

        return NextResponse.json({ success: true, data: submission }, { status: 201 });
    } catch (error) {
        console.error("Submission Create Error:", error);
        return NextResponse.json({ success: false, error: "Failed to submit assignment" }, { status: 500 });
    }
}
