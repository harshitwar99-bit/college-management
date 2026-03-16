import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { mappings } = await request.json();

        if (!Array.isArray(mappings)) {
            return NextResponse.json(
                { error: "Invalid data format. Expected an array of mappings." },
                { status: 400 }
            );
        }

        if (mappings.length === 0) {
            return NextResponse.json({ message: "No mappings provided.", updatedCount: 0 });
        }

        if (mappings.length > 1000) {
            return NextResponse.json(
                { error: "Limit is 1000 mappings per request. Please split your file." },
                { status: 413 }
            );
        }

        const errors: string[] = [];
        let updatedCount = 0;

        // Validate all entries first
        const validMappings: { collegeRollNo: string; universityRollNo: string; dob?: Date }[] = [];
        for (const mapping of mappings) {
            const { collegeRollNo, universityRollNo, dob } = mapping;
            if (!collegeRollNo || !universityRollNo) {
                errors.push(`Missing collegeRollNo or universityRollNo for an entry.`);
                continue;
            }
            const entry: { collegeRollNo: string; universityRollNo: string; dob?: Date } = {
                collegeRollNo: collegeRollNo.toString().trim(),
                universityRollNo: universityRollNo.toString().trim(),
            };
            if (dob) {
                const parsedDob = new Date(dob);
                if (!isNaN(parsedDob.getTime())) entry.dob = parsedDob;
            }
            validMappings.push(entry);
        }

        // Step 1: Fetch ALL matching users in ONE query
        const collegeRollNos = validMappings.map((m) => m.collegeRollNo);
        const existingUsers = await prisma.user.findMany({
            where: { collegeRollNo: { in: collegeRollNos } },
            select: { id: true, collegeRollNo: true },
        });
        const userMap = new Map(existingUsers.map((u) => [u.collegeRollNo!, u.id]));

        // Step 2: Run updates in parallel (Promise.allSettled won't block on individual failures)
        const updatePromises = validMappings.map(async (mapping) => {
            const userId = userMap.get(mapping.collegeRollNo);
            if (!userId) {
                errors.push(`No user found with College Roll No: ${mapping.collegeRollNo}`);
                return;
            }
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        universityRollNo: mapping.universityRollNo,
                        ...(mapping.dob && { dob: mapping.dob }),
                    },
                });
                updatedCount++;
            } catch (err: unknown) {
                const prismaErr = err as { code?: string; message?: string };
                if (prismaErr.code === "P2002") {
                    errors.push(`University Roll No ${mapping.universityRollNo} already exists for another user.`);
                } else {
                    errors.push(`Failed to update ${mapping.collegeRollNo}: ${prismaErr.message}`);
                }
            }
        });

        await Promise.allSettled(updatePromises);

        return NextResponse.json({
            message: `Successfully updated ${updatedCount} records.`,
            updatedCount,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error: unknown) {
        console.error("Error syncing roll numbers:", error);
        return NextResponse.json(
            { error: "Failed to sync roll numbers." },
            { status: 500 }
        );
    }
}
