import { NextResponse } from "next/server";
// Moved prisma import inside handler
import {
    DEMO_USERS,
    DEMO_ATTENDANCE,
    DEMO_TIMETABLE,
    DEMO_EXAMS,
    DEMO_NOTICES,
    DEMO_RESULTS,
    DEMO_ASSIGNMENTS,
    DEMO_LEAVES,
    DEMO_FEES,
    DEMO_SEATING
} from "@/lib/demo-data";

export async function POST(request: Request) {
    const { prisma } = await import("@/lib/prisma");
    try {
        console.log("Seeding started...");

        // 1. Seed Users
        for (const u of DEMO_USERS) {
            await prisma.user.upsert({
                where: { email: u.email },
                update: {
                    name: u.name,
                    role: u.role.toUpperCase() as any,
                    phone: u.phone,
                    firebaseId: u.uid,
                    collegeRollNo: (u as any).rollNumber,
                    batch: (u as any).batch,
                    address: (u as any).address,
                    fatherName: (u as any).fatherName,
                },
                create: {
                    email: u.email,
                    name: u.name,
                    role: u.role.toUpperCase() as any,
                    phone: u.phone,
                    firebaseId: u.uid,
                    collegeRollNo: (u as any).rollNumber,
                    batch: (u as any).batch,
                    address: (u as any).address,
                    fatherName: (u as any).fatherName,
                },
            });
        }

        // 2. Seed Subjects and Map them
        const subjects = ["Data Structures", "Algorithms", "DBMS", "Computer Networks", "Operating Systems", "Software Engineering", "Mathematics - III", "CGMA-Theory", "OT-Theory", "CET-Theory", "SE-Theory", "CGMA-Lab"];
        const subjectMap: Record<string, string> = {};

        for (const subName of subjects) {
            const subject = await prisma.subject.upsert({
                where: { code: subName.replace(/\s+/g, '-').toLowerCase() },
                update: { name: subName },
                create: {
                    name: subName,
                    code: subName.replace(/\s+/g, '-').toLowerCase(),
                    credits: 4,
                    semester: 4,
                    course: {
                        connectOrCreate: {
                            where: { code: 'BCA' },
                            create: {
                                name: 'Bachelor of Computer Applications',
                                code: 'BCA',
                                department: {
                                    connectOrCreate: {
                                        where: { name: 'IT' },
                                        create: { name: 'IT', description: 'Information Technology' }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            subjectMap[subName] = subject.id;
        }

        // 3. Seed Attendance (Simplified mapping)
        const student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
        if (student) {
            for (const att of DEMO_ATTENDANCE) {
                const subId = subjectMap[att.subject] || subjectMap[Object.keys(subjectMap)[0]];
                await prisma.attendance.create({
                    data: {
                        date: new Date(),
                        status: 'PRESENT',
                        userId: student.id,
                        subjectId: subId
                    }
                });
            }
        }

        // 4. Seed Notices
        for (const notice of DEMO_NOTICES) {
            await prisma.notice.create({
                data: {
                    title: notice.title,
                    body: notice.body,
                    type: notice.type.toUpperCase() as any,
                    author: notice.author,
                    date: new Date(notice.date)
                }
            });
        }

        // 5. Seed Exams
        for (const exam of DEMO_EXAMS) {
            const subId = subjectMap[exam.subject] || subjectMap[Object.keys(subjectMap)[0]];
            await prisma.exam.create({
                data: {
                    date: new Date(exam.date),
                    time: exam.time,
                    duration: exam.duration,
                    type: exam.type,
                    subjectId: subId
                }
            });
        }

        console.log("Seeding completed successfully");
        return NextResponse.json({ success: true, message: "Database seeded successfully" });

    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
