import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(request: Request) {
    try {
        const { universityRollNo, dob } = await request.json();

        if (!universityRollNo) {
            return NextResponse.json(
                { error: "University Roll Number is required" },
                { status: 400 }
            );
        }

        // --- MOCK IMPLEMENTATION ---
        // In a real scenario, use fetch() or cheerio to pull from the live university portal.
        // No artificial delay — this responds instantly under high concurrent load.

        const mockAdmitCard = {
            studentName: "John Doe",
            rollNo: universityRollNo,
            course: "BCA / BBA / MCA",
            semester: "6th",
            examCenter: "Institute of Technology and Science, Ghaziabad",
            subjects: [
                { code: "KCS601", name: "Software Engineering", date: "15-May-2026", time: "10:00 AM - 1:00 PM" },
                { code: "KCS602", name: "Web Technology", date: "18-May-2026", time: "10:00 AM - 1:00 PM" },
                { code: "KCS603", name: "Computer Networks", date: "21-May-2026", time: "10:00 AM - 1:00 PM" },
            ],
            instructions: [
                "Please bring a valid photo ID.",
                "Mobile phones are strictly prohibited.",
                "Reach the exam center 30 minutes before the scheduled time.",
            ],
            downloadUrl: "#",
        };

        return NextResponse.json({
            message: "Admit card extracted successfully (MOCKED)",
            data: mockAdmitCard,
        });

    } catch (error: unknown) {
        console.error("Error extracting admit card:", error);
        return NextResponse.json(
            { error: "Failed to extract admit card. Please try again later." },
            { status: 500 }
        );
    }
}
