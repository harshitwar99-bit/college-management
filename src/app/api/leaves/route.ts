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

        if (user.role === 'COORDINATOR' || user.role === 'ADMIN' || user.role === 'HOD' || user.role === 'FACULTY') {
            // Coordinator and Faculty can see relevant leaves.
            const allLeaves = await prisma.leave.findMany({
                include: { user: { select: { name: true, collegeRollNo: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json({ success: true, data: allLeaves }, { status: 200 });
        } else {
            // Students and Faculty see their own leaves
            const leaves = await prisma.leave.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json({ success: true, data: leaves }, { status: 200 });
        }
    } catch (error) {
        console.error("Leaves Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch leaves" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, startDate, endDate, reason } = body;

        if (!firebaseId || !startDate || !endDate || !reason) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const prisma = getPrisma();

        const user = await prisma.user.findUnique({ where: { firebaseId } });
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
        }

        const newLeave = await prisma.leave.create({
            data: {
                userId: user.id,
                role: user.role.toLowerCase(), // 'student' or 'faculty'
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, data: newLeave }, { status: 201 });
    } catch (error) {
        console.error("Leave Create Error:", error);
        return NextResponse.json({ success: false, error: "Failed to apply for leave" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, leaveId, status } = body;

        if (!firebaseId || !leaveId || !status) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const prisma = getPrisma();

        const user = await prisma.user.findUnique({ where: { firebaseId } });
        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: "Unauthorized. Must be Staff." }, { status: 403 });
        }

        const updated = await prisma.leave.update({
            where: { id: leaveId },
            data: { status }
        });

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error("Leave Update Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update leave" }, { status: 500 });
    }
}
