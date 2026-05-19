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
        
        // Find the user
        const user = await prisma.user.findUnique({
            where: { firebaseId }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Fetch attendance records for this user
        const attendanceRecords = await prisma.attendance.findMany({
            where: { userId: user.id },
            include: { subject: true }
        });

        // If no records, return empty array (frontend handles fallback)
        if (attendanceRecords.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        // Aggregate by subject
        const tally: Record<string, { present: number; total: number }> = {};
        
        attendanceRecords.forEach(record => {
            const subjectName = record.subject.name;
            if (!tally[subjectName]) {
                tally[subjectName] = { present: 0, total: 0 };
            }
            
            tally[subjectName].total++;
            if (record.status === 'PRESENT') {
                tally[subjectName].present++;
            }
        });

        const aggregatedResponse = Object.keys(tally).map(sub => {
            const t = tally[sub];
            return {
                subject: sub,
                present: t.present,
                total: t.total,
                percent: t.total > 0 ? Math.round((t.present / t.total) * 100) : 0
            };
        });

        return NextResponse.json({ success: true, data: aggregatedResponse }, { status: 200 });
        
    } catch (error) {
        console.error("Attendance Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch attendance" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { records } = body as { records: { rollNumber: string, subject: string, status: string, dateString: string }[] };

        if (!records || records.length === 0) {
            return NextResponse.json({ success: false, error: "No records provided" }, { status: 400 });
        }

        const prisma = getPrisma();

        // Group by subject to optimize Subject lookups
        const uniqueSubjectNames = [...new Set(records.map(r => r.subject))];
        const subjects = await prisma.subject.findMany({
            where: { name: { in: uniqueSubjectNames } }
        });
        const subjectMap = new Map(subjects.map(s => [s.name, s.id]));

        // Get uniquely involved users by collegeRollNo
        const uniqueRolls = [...new Set(records.map(r => r.rollNumber))];
        const users = await prisma.user.findMany({
            where: { collegeRollNo: { in: uniqueRolls } }
        });
        const userMap = new Map(users.map(u => [u.collegeRollNo, u.id]));

        const validRecordsToInsert = [];

        for (const record of records) {
            const subjectId = subjectMap.get(record.subject);
            const userId = userMap.get(record.rollNumber);
            
            if (!subjectId || !userId) {
                console.warn(`Skipping record for ${record.rollNumber} - ${record.subject} due to missing IDs.`);
                continue;
            }

            // Map status string to enum AttendanceStatus (PRESENT, ABSENT, LEAVE)
            let statusEnum: any = 'PRESENT';
            if (record.status.toLowerCase() === 'absent') statusEnum = 'ABSENT';
            if (record.status.toLowerCase() === 'leave') statusEnum = 'LEAVE';

            validRecordsToInsert.push({
                date: new Date(record.dateString),
                status: statusEnum,
                userId: userId,
                subjectId: subjectId
            });
        }

        if (validRecordsToInsert.length === 0) {
            return NextResponse.json({ success: false, error: "No valid records could be processed (missing users or subjects in DB)." }, { status: 400 });
        }

        // Insert using transaction or createMany
        const result = await prisma.attendance.createMany({
            data: validRecordsToInsert,
            skipDuplicates: true
        });

        return NextResponse.json({ success: true, count: result.count }, { status: 200 });
    } catch (error) {
        console.error("Attendance Update Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update attendance" }, { status: 500 });
    }
}
