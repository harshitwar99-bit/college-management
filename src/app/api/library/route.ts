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

        // Fetch all books (the catalog)
        const books = await prisma.libraryBook.findMany({
            orderBy: { title: 'asc' }
        });

        // Fetch the user's active/past transactions
        const transactions = await prisma.bookBorrow.findMany({
            where: { userId: user.id },
            include: { book: true },
            orderBy: { borrowDate: 'desc' }
        });

        return NextResponse.json({ success: true, data: { books, transactions } }, { status: 200 });

    } catch (error) {
        console.error("Fetch Library Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch library data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // action can be 'seed_books' or 'issue_book'
        const { firebaseId, action, booksToSeed, issueData } = body;

        if (!firebaseId) {
            return NextResponse.json({ success: false, error: 'Missing firebaseId' }, { status: 400 });
        }

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({ where: { firebaseId } });

        if (!user || user.role === 'STUDENT') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        if (action === 'seed_books' && booksToSeed) {
            const created = await Promise.all(
                booksToSeed.map((book: any) => 
                    prisma.libraryBook.upsert({
                        where: { isbn: book.isbn },
                        update: { available: book.available, quantity: book.total },
                        create: {
                            title: book.title,
                            author: book.author,
                            isbn: book.isbn,
                            available: book.available,
                            quantity: book.total
                        }
                    })
                )
            );
            return NextResponse.json({ success: true, data: created }, { status: 201 });
        }

        if (action === 'issue_book' && issueData) {
            const { studentId, bookId, dueDate } = issueData;
            
            // Validate availability
            const book = await prisma.libraryBook.findUnique({ where: { id: bookId } });
            if (!book || book.available <= 0) {
                return NextResponse.json({ success: false, error: 'Book not available' }, { status: 400 });
            }

            const trans = await prisma.$transaction(async (tx) => {
                await tx.libraryBook.update({
                    where: { id: bookId },
                    data: { available: { decrement: 1 } }
                });

                return tx.bookBorrow.create({
                    data: {
                        userId: studentId,
                        bookId: bookId,
                        dueDate: new Date(dueDate),
                        status: 'Borrowed'
                    }
                });
            });

            return NextResponse.json({ success: true, data: trans }, { status: 201 });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error("Post Library Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process library logic" }, { status: 500 });
    }
}
