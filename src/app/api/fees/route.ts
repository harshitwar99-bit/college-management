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
        const user = await prisma.user.findUnique({ where: { firebaseId } });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const transactions = await prisma.feeTransaction.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' }
        });

        // Calculate fees dynamically
        const totalTuition = 125000; // Fixed demo tuition amount
        const paid = transactions
            .filter(t => t.status === 'Paid' || t.status === 'Completed')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const pending = Math.max(0, totalTuition - paid);
        
        // Due date: Next month 15th (just for demo purposes)
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        d.setDate(15);
        const dueDate = d.toISOString();

        return NextResponse.json({
            success: true,
            data: {
                totalTuition,
                paid,
                pending,
                dueDate,
                transactions
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Fetch Fees Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch fees" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Utility to easily seed a fee transaction securely
    try {
        const body = await request.json();
        const { firebaseId, amount, method, status, semester, date } = body;

        if (!firebaseId || !amount) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });

        if (!user) {
             return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const txn = await prisma.feeTransaction.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                method: method || 'Online',
                status: status || 'Completed',
                semester: semester || 'Current Semester',
                date: date ? new Date(date) : new Date()
            }
        });

        return NextResponse.json({ success: true, data: txn }, { status: 201 });

    } catch (error) {
        console.error("Create Fee Transaction Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create transaction" }, { status: 500 });
    }
}
