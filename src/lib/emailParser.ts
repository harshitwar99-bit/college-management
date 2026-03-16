import { db } from "./firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export type ParsedEmailResult = {
    type: "notice" | "timetable" | "unknown";
    data: any;
    confidence: number;
};

// Keywords for classification
const NOTICE_KEYWORDS = ["notice", "announcement", "holiday", "event", "mandatory", "attention", "remind", "postponed", "cancelled"];
const TIMETABLE_KEYWORDS = ["reschedule", "rescheduled", "class shifted", "timetable update", "room change", "extra class"];

export async function parseEmailText(text: string): Promise<ParsedEmailResult> {
    const lowerText = text.toLowerCase();

    let noticeScore = 0;
    let timetableScore = 0;

    NOTICE_KEYWORDS.forEach(kw => { if (lowerText.includes(kw)) noticeScore++; });
    TIMETABLE_KEYWORDS.forEach(kw => { if (lowerText.includes(kw)) timetableScore++; });

    if (timetableScore > 0 && timetableScore >= noticeScore) {
        return parseTimetableEmail(text);
    } else if (noticeScore > 0) {
        return parseNoticeEmail(text);
    }

    return { type: "unknown", data: null, confidence: 0 };
}

function parseNoticeEmail(text: string): ParsedEmailResult {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    // Very simplistic heuristic: assume first line is subject/title
    const title = lines[0] || "New Notice";
    const body = lines.slice(1).join("\n") || text;

    let type = "general";
    const lowerText = text.toLowerCase();
    if (lowerText.includes("exam") || lowerText.includes("test")) type = "exam";
    else if (lowerText.includes("assignment") || lowerText.includes("submit")) type = "assignment";
    else if (lowerText.includes("event") || lowerText.includes("fest")) type = "event";
    else if (lowerText.includes("holiday") || lowerText.includes("leave")) type = "holiday";

    return {
        type: "notice",
        confidence: 0.85,
        data: {
            title,
            body: body.substring(0, 500) + (body.length > 500 ? "..." : ""), // Truncate very long emails
            type,
            author: "Auto-Synced Email",
            date: new Date().toISOString()
        }
    };
}

function parseTimetableEmail(text: string): ParsedEmailResult {
    // Regex to find things like: "Data Structures from 10:00 to 11:30 in Room 302"
    // or "Class rescheduled to Monday at 14:00"

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const lowerText = text.toLowerCase();

    // Try to find a day
    let targetDay = days.find(d => lowerText.includes(d.toLowerCase())) || days[new Date().getDay() - 1] || "Monday";

    // Basic Regex to find time (e.g. 10:00) and Room (e.g. Room 402)
    const timeRegex = /(\d{1,2}:\d{2})/g;
    const times = text.match(timeRegex);
    const startTime = times?.[0] || "10:00";
    const endTime = times?.[1] || "11:00";

    const roomRegex = /room\s+(\w+)/i;
    const roomMatch = text.match(roomRegex);
    const room = roomMatch ? roomMatch[1] : "TBA";

    // Attempt to extract subject (first capitalized words before the time)
    // Very simplistic fallback to whole text or fixed string
    const subjectMatch = text.match(/([A-Z][a-zA-Z\s]+)(?:is rescheduled|class|from|at)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : "Rescheduled Class";

    return {
        type: "timetable",
        confidence: 0.75,
        data: {
            day: targetDay,
            update: {
                subject: subject,
                time: startTime,
                end: endTime,
                room: room,
                faculty: "Auto-Synced Update",
                type: "rescheduled"
            }
        }
    };
}

export async function syncEmailDataToFirebase(parsedResult: ParsedEmailResult) {
    if (parsedResult.type === "notice") {
        // Add to notices collection
        const docRef = await addDoc(collection(db, "notices"), parsedResult.data);
        return docRef.id;
    } else if (parsedResult.type === "timetable") {
        // Timetable is a bit trickier, we'll store overrides in 'timetable_updates'
        const overridesRef = collection(db, "timetable_updates");
        const docRef = await addDoc(overridesRef, {
            ...parsedResult.data,
            syncedAt: new Date().toISOString()
        });
        return docRef.id;
    }
    throw new Error("Unknown data type to sync");
}
