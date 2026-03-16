import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";
export const maxDuration = 25;

// Map from course name keywords to CCSU portal crsselect values
const COURSE_CODE_MAP: Record<string, string> = {
    // Under-Graduate
    "bca":       "bca",
    "bba":       "bba",
    "b.ca":      "bca",
    "b.b.a":     "bba",
    "b.com":     "bcom",
    "bcom":      "bcom",
    "b.sc":      "bsc",
    "bsc":       "bsc",
    "b.a":       "ba",
    "b.tech":    "btech",
    "btech":     "btech",
    "b.ed":      "bed",
    "bed":       "bed",
    "b.pharma":  "bpharma",
    "bpharma":   "bpharma",
    "llb":       "llb",
    "b.p.ed":    "bped",
    "bped":      "bped",
    // Post-Graduate
    "mca":       "mca",
    "mba":       "mba",
    "m.com":     "mcom",
    "mcom":      "mcom",
    "m.sc":      "msc",
    "msc":       "msc",
    "m.a":       "ma",
    "m.ed":      "med",
    "med":       "med",
    "m.tech":    "mtech",
    "mtech":     "mtech",
    "llm":       "llm",
};

/**
 * Derives the CCSU portal course code from the student's course name.
 * Falls back to "bca" if no match is found.
 */
function getCourseCode(courseName: string | undefined, explicitCourseCode?: string): string {
    if (explicitCourseCode) return explicitCourseCode;
    if (!courseName) return "bca";
    const lower = courseName.toLowerCase();
    for (const [key, val] of Object.entries(COURSE_CODE_MAP)) {
        if (lower.includes(key)) return val;
    }
    return "bca";
}

export async function POST(request: Request) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
        const body = await request.json();
        const { universityRollNo, semester, courseName, courseCode } = body;

        if (!universityRollNo || !semester) {
            clearTimeout(timeout);
            return NextResponse.json(
                { error: "University Roll Number and Semester are required." },
                { status: 400 }
            );
        }

        const crsselect = getCourseCode(courseName, courseCode);
        const yrselect = semester.toString(); // 1-10 maps directly

        console.log(`[CCSU MARKSHEET] Roll: ${universityRollNo}, Sem: ${yrselect}, Course Code: ${crsselect}`);

        // Build form data exactly as the CCSU portal expects
        const formData = new URLSearchParams();
        formData.append("crsselect", crsselect);
        formData.append("yrselect", yrselect);
        formData.append("textrollnum", universityRollNo.toString().trim());
        formData.append("Submit2", "Submit");

        // Fetch the result page from CCSU (result.ccsuniversity.ac.in)
        const portalRes = await fetch("https://result.ccsuniversity.ac.in/displayms.php", {
            method: "POST",
            body: formData.toString(),
            signal: controller.signal,
            headers: {
                "Content-Type":  "application/x-www-form-urlencoded",
                "Referer":       "https://result.ccsuniversity.ac.in/regpvt2013.php",
                "Origin":        "https://result.ccsuniversity.ac.in",
                "User-Agent":    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept":        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
            },
        });

        clearTimeout(timeout);

        if (!portalRes.ok) {
            console.error(`[CCSU MARKSHEET] Portal returned HTTP ${portalRes.status}`);
            return NextResponse.json(
                { error: `University portal returned an error (HTTP ${portalRes.status}). Please try again later.` },
                { status: 502 }
            );
        }

        const html = await portalRes.text();
        console.log(`[CCSU MARKSHEET] Received ${html.length} bytes from CCSU portal`);

        const $ = cheerio.load(html);

        // --- Check for "no result" / error messages from CCSU ---
        const bodyText = $("body").text().toLowerCase();
        const noResultPhrases = [
            "no result", "not found", "invalid roll", "wrong roll",
            "result not available", "result not declared", "record not found",
            "rool no is wrong", "roll no is wrong", "please enter valid",
        ];
        for (const phrase of noResultPhrases) {
            if (bodyText.includes(phrase)) {
                return NextResponse.json(
                    {
                        error: "No results found for this Roll Number and Semester. Results may not have been declared yet, or the Roll Number / Course selection may be incorrect.",
                        notDeclared: true,
                    },
                    { status: 404 }
                );
            }
        }

        // --- Parse student info ---
        // The CCSU portal uses a table-based layout.
        // Student name is typically in a cell after a cell that says "CANDIDATE NAME"
        let studentName = "";
        let course = "";
        let institute = "";

        $("table tr").each((_, row) => {
            const cells = $(row).find("td");
            cells.each((idx, cell) => {
                const cellText = $(cell).text().trim().toUpperCase();
                if (cellText.includes("CANDIDATE NAME") || cellText.includes("NAME:")) {
                    studentName = $(cells[idx + 1]).text().trim();
                }
                if (cellText.includes("COLLEGE") || cellText.includes("INSTITUTE") || cellText.includes("INSTITUTION")) {
                    institute = $(cells[idx + 1]).text().trim();
                }
                if (cellText.includes("COURSE") || cellText.includes("PROGRAMME")) {
                    const val = $(cells[idx + 1]).text().trim();
                    if (val && val.length > 1) course = val;
                }
            });
        });

        // Fallback: look for standalone text patterns
        if (!studentName) {
            $("td, th, div, span, p").each((_, el) => {
                const text = $(el).text().trim();
                const match = text.match(/(?:NAME|NAMA)\s*[:\-]\s*(.+)/i);
                if (match && !studentName) studentName = match[1].trim();
            });
        }

        // --- Parse marks table ---
        // CCSU result tables typically have: Sl.No | Subject Code | Subject | Internal | External | Total | Grade | Result
        const results: {
            code: string;
            name: string;
            internal: number;
            external: number;
            total: number;
            grade: string;
        }[] = [];

        let finalStatus = "";
        let totalMarks = "";
        let sgpa = "";

        // Find the main marks table — it usually has 6+ columns
        $("table").each((_, table) => {
            const headerRow = $(table).find("tr").first();
            const headerText = headerRow.text().toUpperCase();

            const isMarksTable =
                (headerText.includes("SUBJECT") || headerText.includes("PAPER")) &&
                (headerText.includes("TOTAL") || headerText.includes("MARKS")) &&
                (headerText.includes("GRADE") || headerText.includes("RESULT") || headerText.includes("INTERNAL") || headerText.includes("EXTERNAL"));

            if (!isMarksTable) return;

            // Identify column indices dynamically
            const headers: string[] = [];
            headerRow.find("th, td").each((_, th) => {
                headers.push($(th).text().trim().toUpperCase());
            });

            const colIdx = {
                code:     headers.findIndex(h => h.includes("CODE") || h.includes("PAPER CODE") || h.includes("SUB CODE")),
                name:     headers.findIndex(h => h.includes("SUBJECT") || h.includes("PAPER NAME") || h.includes("PAPER") || h.includes("NAME")),
                internal: headers.findIndex(h => h.includes("INTERNAL") || h.includes("SESSIONAL") || h.includes("IA")),
                external: headers.findIndex(h => h.includes("EXTERNAL") || h.includes("THEORY") || h.includes("EA")),
                total:    headers.findIndex(h => h.includes("TOTAL") || h.includes("TOT")),
                grade:    headers.findIndex(h => h.includes("GRADE") || h.includes("LETTER GRADE")),
            };

            $(table).find("tr").slice(1).each((_, row) => {
                const cols = $(row).find("td");
                if (cols.length < 4) return;

                const getText = (idx: number) => idx >= 0 ? $(cols[idx]).text().trim() : "";
                const getNum  = (idx: number) => { const v = parseInt(getText(idx), 10); return isNaN(v) ? 0 : v; };

                // Skip summary/total rows (they often have "TOTAL" in first or second cell)
                const firstCellText = $(cols[0]).text().trim().toUpperCase();
                if (firstCellText.includes("TOTAL") || firstCellText.includes("GRAND") || firstCellText.includes("SGPA") || firstCellText.includes("CGPA")) return;

                // Capture SGPA/CGPA/total from footer rows
                if (firstCellText.includes("SGPA") || firstCellText.includes("CGPA")) {
                    sgpa = $(cols[1]).text().trim();
                    return;
                }

                // Find total marks and result in summary cells
                $(cols).each((_, col) => {
                    const t = $(col).text().trim().toUpperCase();
                    if (t.includes("PASS") && !finalStatus) finalStatus = "PASS";
                    if (t.includes("FAIL") && !finalStatus) finalStatus = "FAIL";
                });

                // Build subject entry — code and name at minimum are needed
                const code = getText(colIdx.code);
                const name = getText(colIdx.name);

                if (!code && !name) return; // skip empty rows

                results.push({
                    code:     code || "—",
                    name:     name || "—",
                    internal: getNum(colIdx.internal),
                    external: getNum(colIdx.external),
                    total:    getNum(colIdx.total),
                    grade:    getText(colIdx.grade) || "—",
                });
            });
        });

        // --- Attempt to extract total marks and SGPA from whole page ---
        $("table tr td, table tr th").each((_, el) => {
            const text = $(el).text().trim().toUpperCase();
            if ((text.includes("SGPA") || text.includes("S.G.P.A")) && !sgpa) {
                const sibling = $(el).next("td").text().trim();
                if (sibling) sgpa = sibling;
            }
            if ((text.includes("TOTAL MARKS") || text.includes("GRAND TOTAL")) && !totalMarks) {
                const sibling = $(el).next("td").text().trim();
                if (sibling) totalMarks = sibling;
            }
            if ((text === "PASS" || text === "FAIL" || text === "PROMOTED" || text === "DETAINED") && !finalStatus) {
                finalStatus = text;
            }
        });

        // If we couldn't parse any subjects, the HTML structure is unexpected
        if (results.length === 0) {
            console.error("[CCSU MARKSHEET] Could not parse any subjects from portal HTML.");
            console.error("[CCSU MARKSHEET] Page excerpt:", html.substring(0, 2000));
            return NextResponse.json(
                {
                    error: "Could not extract results from the university portal. The portal may have changed its format or results are not declared yet.",
                    notDeclared: true,
                },
                { status: 422 }
            );
        }

        // Compute totals if not extracted from page
        if (!totalMarks && results.length > 0) {
            const sum = results.reduce((acc, r) => acc + r.total, 0);
            const max = results.length * 100;
            totalMarks = `${sum}/${max}`;
        }

        const parsedMarksheet = {
            studentName: studentName || "N/A",
            rollNo:      universityRollNo,
            course:      course || courseName || crsselect.toUpperCase(),
            semester:    yrselect,
            status:      finalStatus || (results.some(r => r.grade === "F") ? "FAIL" : "PASS"),
            totalMarks:  totalMarks,
            cgpa:        sgpa || "—",
            subjects:    results,
            source:      "CCSU Portal (result.ccsuniversity.ac.in)",
        };

        console.log(`[CCSU MARKSHEET] Successfully parsed ${results.length} subjects for ${studentName}`);

        return NextResponse.json({
            message: "Marksheet extracted successfully from CCSU portal",
            data:    parsedMarksheet,
        });

    } catch (error: unknown) {
        clearTimeout(timeout);
        if (error instanceof Error && error.name === "AbortError") {
            return NextResponse.json(
                { error: "The university portal took too long to respond. Please try again in a few moments." },
                { status: 504 }
            );
        }
        console.error("[CCSU MARKSHEET] Error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while fetching results from the university portal." },
            { status: 500 }
        );
    }
}
