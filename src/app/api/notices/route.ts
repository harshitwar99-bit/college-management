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

        // Fetch all notices descending by date
        const notices = await prisma.notice.findMany({
            orderBy: { date: 'desc' },
            take: 50
        });

        return NextResponse.json({ success: true, data: notices }, { status: 200 });
        
    } catch (error) {
        console.error("Notices Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch notices" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firebaseId, title, body: noticeBody, type, date } = body;

        if (!firebaseId || !title || !noticeBody || !type) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const prisma = getPrisma();

        const user = await prisma.user.findUnique({ where: { firebaseId } });
        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: "Unauthorized. Students cannot post notices." }, { status: 403 });
        }

        const newNotice = await prisma.notice.create({
            data: {
                title,
                body: noticeBody,
                type: type.toUpperCase(),
                author: user.name, // Use user's real name mapped from DB
                date: date ? new Date(date) : new Date()
            }
        });

        return NextResponse.json({ success: true, data: newNotice }, { status: 201 });
    } catch (error) {
        console.error("Notice Create Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create notice" }, { status: 500 });
    }
}
