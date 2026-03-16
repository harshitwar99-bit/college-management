import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const prisma = getPrisma();
    try {
        const users = await req.json();

        if (!Array.isArray(users)) {
            return NextResponse.json(
                { error: "Invalid data format. Expected an array of users." },
                { status: 400 }
            );
        }

        if (users.length === 0) {
            return NextResponse.json({ message: "No users provided.", added: 0, skipped: 0, failed: 0 });
        }

        // Limit bulk upload size per request to avoid timeouts
        if (users.length > 500) {
            return NextResponse.json(
                { error: "Bulk upload limit is 500 users per request. Please split your file." },
                { status: 413 }
            );
        }

        const validRoles = ["STUDENT", "FACULTY", "COORDINATOR", "ADMIN", "HOD"] as const;
        type ValidRole = typeof validRoles[number];

        // Step 1: Validate and collect all emails in one pass
        const validUsers: { name: string; email: string; role: ValidRole; phone: string | null; departmentId: string | null }[] = [];
        let failedCount = 0;
        const emails: string[] = [];

        for (const userData of users) {
            const { name, email, role, phone, departmentId } = userData;
            if (!name || !email) {
                failedCount++;
                continue;
            }
            const normalizedRole = role && validRoles.includes(role.toUpperCase() as ValidRole)
                ? (role.toUpperCase() as ValidRole)
                : "STUDENT";

            validUsers.push({
                name,
                email: email.toLowerCase().trim(),
                role: normalizedRole,
                phone: phone || null,
                departmentId: departmentId || null,
            });
            emails.push(email.toLowerCase().trim());
        }

        // Step 2: Fetch ALL existing users in a SINGLE query (not N queries)
        const existingUsers = await prisma.user.findMany({
            where: { email: { in: emails } },
            select: { email: true },
        });
        const existingEmails = new Set(existingUsers.map((u) => u.email));

        // Step 3: Filter out duplicates
        const newUsers = validUsers.filter((u) => !existingEmails.has(u.email));
        const duplicateCount = validUsers.length - newUsers.length;

        // Step 4: Batch insert all new users in ONE query
        let addedCount = 0;
        if (newUsers.length > 0) {
            const result = await prisma.user.createMany({
                data: newUsers,
                skipDuplicates: true,
            });
            addedCount = result.count;
        }

        return NextResponse.json({
            message: "Bulk upload completed",
            added: addedCount,
            skipped: duplicateCount,
            failed: failedCount,
        });

    } catch (error) {
        console.error("Bulk upload FATAL error:", error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: "Failed to process bulk upload" },
            { status: 500 }
        );
    }
}
