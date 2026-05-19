/**
 * useTimetable — Real-time timetable hook
 *
 * Subscribes to localStorage changes (cross-tab via "storage" events)
 * so any React component always shows the latest timetable.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { readTimetable, writeTimetable, TIMETABLE_KEY, WeeklyTimetable } from "@/lib/timetable-store";

export function useTimetable(branch?: string) {
    const [timetable, setTimetable] = useState<WeeklyTimetable>({});
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const reload = useCallback(() => {
        setTimetable(readTimetable(branch));
        setLastUpdated(new Date());
    }, [branch]);

    useEffect(() => {
        // Initial load
        reload();

        // Listen for cross-tab updates via native storage event
        const handleStorage = (e: StorageEvent) => {
            if (e.key === `${TIMETABLE_KEY}_${branch || 'BCA'}`) {
                reload();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [reload, branch]);

    const save = useCallback((data: WeeklyTimetable) => {
        writeTimetable(data, branch);
        setTimetable(data);
        setLastUpdated(new Date());
    }, [branch]);

    return { timetable, save, lastUpdated, reload };
}
