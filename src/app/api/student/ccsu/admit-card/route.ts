import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Admit Card API
 *
 * The primary CCSU admit card portal (ccsuniversityweb.in) is protected by
 * Cloudflare Turnstile and cannot be scraped server-side. This endpoint
 * returns the direct portal URLs and instructions so the student can
 * open the page themselves.
 *
 * If/when a scrape-able admit card endpoint becomes available, replace
 * the URL construction below with real fetch + cheerio parsing.
 */
export async function POST(request: Request) {
    try {
        const { universityRollNo } = await request.json();

        if (!universityRollNo) {
            return NextResponse.json(
                { error: "University Roll Number is required." },
                { status: 400 }
            );
        }

        const roll = universityRollNo.toString().trim();

        // Direct links for CCSU admit card portals
        const portalLinks = [
            {
                label: "CCSU Admit Card Portal (Primary)",
                url: `https://ccsuniversityweb.in/`,
                hint: "Go to 'Admit Card' section and enter your Roll Number",
            },
            {
                label: "CCSU Examination Portal",
                url: `https://www.ccsuniversity.ac.in/exam-form-and-admit-card`,
                hint: "Check under 'Exam Form & Admit Card' for links released by the university",
            },
        ];

        return NextResponse.json({
            message: "Admit card portal links retrieved",
            data: {
                rollNo: roll,
                status: "redirect", // tells the frontend to show the redirect UI
                portalLinks,
                instructions: [
                    "Open one of the official CCSU portal links below.",
                    "Navigate to the 'Admit Card' / 'AdmitCard' section.",
                    "Enter your University Roll Number and any other required details.",
                    "Download and print your admit card.",
                    "Carry a valid photo ID (Aadhar/Voter ID) along with the admit card to the exam hall.",
                ],
                note: "The CCSU admit card portal requires human verification (Cloudflare) and cannot be accessed automatically. Please use the links above to download your admit card directly.",
            },
        });

    } catch (error: unknown) {
        console.error("Error in admit card route:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
