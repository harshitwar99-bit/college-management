import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const firebaseId = searchParams.get('firebaseId');

        if (!firebaseId) {
            return NextResponse.json({ success: false, error: 'Missing firebaseId' }, { status: 400 });
        }

        const prisma = getPrisma();
        
        const user = await prisma.user.findUnique({
            where: { firebaseId },
            include: { department: true }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Fetch all exams, ordering by date
        const exams = await prisma.exam.findMany({
            include: {
                subject: {
                    include: { course: true }
                },
                seats: true
            },
            orderBy: { date: 'asc' }
        });

        // Add logic to filter if user is a student? For now return all exams so the UI can filter them.
        return NextResponse.json({ success: true, data: exams }, { status: 200 });

    } catch (error) {
        console.error("Fetch Exams Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch exams" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, subjectId, date, time, duration, type } = body;

        if (!firebaseId || !subjectId || !date || !time) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });
        
        if (!user || (user.role !== 'COORDINATOR' && user.role !== 'ADMIN' && user.role !== 'HOD' && user.role !== 'FACULTY')) {
            return NextResponse.json({ success: false, error: 'Unauthorized to schedule exams' }, { status: 403 });
        }

        // Find subject by ID or Name
        const subjectRecord = await prisma.subject.findFirst({
            where: {
                OR: [
                    { id: subjectId },
                    { name: { equals: subjectId, mode: 'insensitive' } }
                ]
            }
        });
        
        if (!subjectRecord) {
            return NextResponse.json({ success: false, error: 'Subject not found. Please provide a valid exact Subject name or ID.' }, { status: 404 });
        }

        const exam = await prisma.exam.create({
            data: {
                subjectId: subjectRecord.id,
                date: new Date(date),
                time,
                duration: duration || '3 Hours',
                type: type || 'Mid-Semester'
            },
            include: {
                subject: {
                    include: { course: true }
                }
            }
        });

        return NextResponse.json({ success: true, data: exam }, { status: 201 });

    } catch (error) {
        console.error("Create Exam Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create exam" }, { status: 500 });
    }
}
