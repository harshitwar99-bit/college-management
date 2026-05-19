/**
 * Timetable Store — Real-Time Cross-Tab Synchronization
 *
 * Architecture:
 * - Master timetable is stored in localStorage under key "its_timetable_v2"
 * - Any component can call `useTimetable()` to subscribe to live updates
 * - When the coordinator saves changes, we write to localStorage AND emit a
 *   custom StorageEvent so all other open tabs/windows receive the update instantly
 * - Fallback: DEMO_TIMETABLE is used when no custom data exists
 */

import { getDemoData } from "@/lib/demo-data";

export const TIMETABLE_KEY = "its_timetable_v2";
export const TIMETABLE_VERSION_KEY = "its_timetable_version";

export type TimetableSlot = {
    id: string;
    time: string;
    end: string;
    subject: string;
    faculty: string;
    room: string;
    type?: "regular" | "lab" | "extra"; // for styling
};

export type WeeklyTimetable = Record<string, TimetableSlot[]>;

/** Read the master timetable from localStorage (or fall back to demo data) */
export function readTimetable(branch?: string): WeeklyTimetable {
    if (typeof window === "undefined") return normalizeDemoData(branch);
    try {
        const raw = localStorage.getItem(`${TIMETABLE_KEY}_${branch || 'BCA'}`);
        if (raw) return JSON.parse(raw) as WeeklyTimetable;
    } catch {
        /* ignore parse errors */
    }
    return normalizeDemoData(branch);
}

/** Write the master timetable to localStorage and notify all listeners */
export function writeTimetable(data: WeeklyTimetable, branch?: string): void {
    if (typeof window === "undefined") return;
    const json = JSON.stringify(data);
    const key = `${TIMETABLE_KEY}_${branch || 'BCA'}`;
    localStorage.setItem(key, json);
    // Bump version counter so other tabs pick up the change
    const prev = parseInt(localStorage.getItem(TIMETABLE_VERSION_KEY) || "0", 10);
    localStorage.setItem(TIMETABLE_VERSION_KEY, String(prev + 1));
    // Manually dispatch storage event so the SAME tab also updates
    window.dispatchEvent(new StorageEvent("storage", {
        key: key,
        newValue: json,
        storageArea: localStorage,
    }));
}

/** Reset to demo data */
export function resetTimetable(branch?: string): void {
    const key = `${TIMETABLE_KEY}_${branch || 'BCA'}`;
    localStorage.removeItem(key);
    localStorage.removeItem(TIMETABLE_VERSION_KEY);
    window.dispatchEvent(new StorageEvent("storage", {
        key: key,
        newValue: null,
        storageArea: localStorage,
    }));
}

/** Normalize DEMO_TIMETABLE to WeeklyTimetable (add ids) */
function normalizeDemoData(branch?: string): WeeklyTimetable {
    const result: WeeklyTimetable = {};
    const baseData = getDemoData(branch).timetable;
    for (const [day, slots] of Object.entries(baseData)) {
        result[day] = slots.map((s, i) => ({
            id: `${day}_${i}_${s.time.replace(":", "")}`,
            time: s.time,
            end: s.end,
            subject: s.subject,
            faculty: s.faculty,
            room: s.room,
            type: s.subject.toLowerCase().includes("lab") ? "lab" : "regular",
        }));
    }
    return result;
}

/** All available faculty names for dropdowns */
export const FACULTY_OPTIONS = [
    "Dr. Priya Mehta",
    "Mrs. Arpana Jain",
    "Dr. Abhay Pratap Singh",
    "Prof. Rajan Kumar",
    "Mr. Alok Kapil",
    "Mr. Prashant Tyagi",
];

/** All subjects for dropdowns */
export const SUBJECT_OPTIONS = [
    "CET-Theory",
    "CGMA-Theory",
    "CGMA-Lab",
    "OS-Theory",
    "OT-Theory",
    "SE-Theory",
    "Mathematics - III",
    "Data Structures",
    "Algorithms",
    "DBMS",
    "Seminar / Extra Class",
    "Library",
    "Sports / Physical Education",
];

/** Standard period time blocks */
export const PERIOD_TIMES = [
    { time: "09:15", end: "10:10" },
    { time: "10:10", end: "11:05" },
    { time: "11:15", end: "12:10" },
    { time: "12:10", end: "13:05" },
    { time: "13:45", end: "14:35" },
    { time: "14:35", end: "15:30" },
];
