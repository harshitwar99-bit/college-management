import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const firebaseId = searchParams.get('firebaseId');

        if (!firebaseId) {
            return NextResponse.json({ success: false, error: 'Missing firebaseId' }, { status: 400 });
        }

        const prisma = getPrisma();
        
        const user = await prisma.user.findUnique({
            where: { firebaseId }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (user.role === 'STUDENT') {
            const assignments = await prisma.assignment.findMany({
                include: {
                    submissions: {
                        where: { userId: user.id }
                    }
                },
                orderBy: { dueDate: 'desc' }
            });

            return NextResponse.json({ success: true, data: assignments }, { status: 200 });
        } else if (user.role === 'FACULTY') {
            const assignments = await prisma.assignment.findMany({
                where: { facultyId: user.id },
                include: { _count: { select: { submissions: true } } },
                orderBy: { dueDate: 'desc' }
            });

            return NextResponse.json({ success: true, data: assignments }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, error: 'Unauthorized role' }, { status: 403 });
        }
        
    } catch (error) {
        console.error("Assignments Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch assignments" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, title, description, subject, dueDate } = body;

        if (!firebaseId || !title || !subject || !dueDate) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const prisma = getPrisma();

        const user = await prisma.user.findUnique({ where: { firebaseId } });
        if (!user || user.role !== 'FACULTY') {
            return NextResponse.json({ success: false, error: "Unauthorized. Must be Faculty." }, { status: 403 });
        }

        const subjectRecord = await prisma.subject.findFirst({
            where: { name: subject }
        });

        if (!subjectRecord) {
            return NextResponse.json({ success: false, error: "Subject not found" }, { status: 404 });
        }

        const newAssignment = await prisma.assignment.create({
            data: {
                title,
                description,
                subjectId: subjectRecord.id,
                dueDate: new Date(dueDate),
                facultyId: user.id
            }
        });

        return NextResponse.json({ success: true, data: newAssignment }, { status: 201 });
    } catch (error) {
        console.error("Assignment Create Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create assignment" }, { status: 500 });
    }
}
