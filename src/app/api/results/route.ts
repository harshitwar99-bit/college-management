import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const firebaseId = searchParams.get('firebaseId');
        const subjectName = searchParams.get('subject');

        if (!firebaseId || !subjectName) {
            return NextResponse.json({ success: false, error: 'Missing firebaseId or subject' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });
        
        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: 'Unauthorized to view class results' }, { status: 403 });
        }

        // Find subject
        const subject = await prisma.subject.findFirst({
            where: { name: { equals: subjectName, mode: 'insensitive' } }
        });

        if (!subject) {
            return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 });
        }

        // Fetch students
        const students = await prisma.user.findMany({
            where: { role: 'STUDENT' }, // Realistically filter by course, but this is a simplified demo
            orderBy: { name: 'asc' }
        });

        // Fetch existing results for this subject
        const existingResults = await prisma.result.findMany({
            where: { subjectId: subject.id }
        });

        return NextResponse.json({ success: true, data: { students, existingResults } }, { status: 200 });

    } catch (error) {
        console.error("Fetch Results Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch results" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, subjectName, marks } = body;

        if (!firebaseId || !subjectName || !marks) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });
        
        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: 'Unauthorized to post results' }, { status: 403 });
        }

        const subject = await prisma.subject.findFirst({
            where: { name: { equals: subjectName, mode: 'insensitive' } }
        });

        if (!subject) {
            return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 });
        }

        // Process marks
        const promises = Object.entries(marks as Record<string, { internal: number, external: number, grade: string, total: number }>).map(async ([studentId, data]) => {
            // See if result exists
            const existing = await prisma.result.findFirst({
                where: { userId: studentId, subjectId: subject.id }
            });

            if (existing) {
                return prisma.result.update({
                    where: { id: existing.id },
                    data: {
                        internal: data.internal,
                        external: data.external,
                        total: data.total,
                        max: 150,
                        grade: data.grade
                    }
                });
            } else {
                return prisma.result.create({
                    data: {
                        userId: studentId,
                        subjectId: subject.id,
                        internal: data.internal,
                        external: data.external,
                        total: data.total,
                        max: 150,
                        grade: data.grade
                    }
                });
            }
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error("Create Results Error:", error);
        return NextResponse.json({ success: false, error: "Failed to save results" }, { status: 500 });
    }
}
