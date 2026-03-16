"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_TIMETABLE } from "@/lib/demo-data";
import { DAYS, getCurrentDay, cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function TimetablePage() {
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());
    const [overrides, setOverrides] = useState<Record<string, any[]>>({});

    useEffect(() => {
        try {
            const q = query(collection(db, "timetable_updates"), orderBy("syncedAt", "desc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newOverrides: Record<string, any[]> = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.day && data.update) {
                        if (!newOverrides[data.day]) newOverrides[data.day] = [];
                        newOverrides[data.day].push({ ...data.update, isOverride: true, key: doc.id });
                    }
                });
                setOverrides(newOverrides);
            }, (error) => {
                console.warn("Timetable overrides listener failed", error);
            });
            return () => unsubscribe();
        } catch {
            console.warn("Timetable overrides listener failed to attach.");
        }
    }, []);

    // Merge static demo classes with live overrides
    const staticClasses = DEMO_TIMETABLE[selectedDay] || [];
    const dayOverrides = overrides[selectedDay] || [];

    // We'll just append them at the end for simplicity, or we could sort by time
    const classes = [...staticClasses, ...dayOverrides].sort((a, b) => {
        const timeA = parseInt(a.time.replace(":", ""));
        const timeB = parseInt(b.time.replace(":", ""));
        return timeA - timeB;
    });

    const subjectColors: Record<string, string> = {
        "Data Structures": "bg-blue-600/20 border-blue-500/30 text-blue-300",
        "Algorithms": "bg-purple-600/20 border-purple-500/30 text-purple-300",
        "DBMS": "bg-emerald-600/20 border-emerald-500/30 text-emerald-300",
        "Computer Networks": "bg-amber-600/20 border-amber-500/30 text-amber-300",
        "Operating Systems": "bg-red-600/20 border-red-500/30 text-red-300",
        "Software Engineering": "bg-pink-600/20 border-pink-500/30 text-pink-300",
        "DS Lab": "bg-cyan-600/20 border-cyan-500/30 text-cyan-300",
        "Networks Lab": "bg-orange-600/20 border-orange-500/30 text-orange-300",
        "DBMS Lab": "bg-teal-600/20 border-teal-500/30 text-teal-300",
        "Seminar / Extra Class": "bg-slate-600/20 border-slate-500/30 text-slate-300",
    };

    const getColor = (subject: string) =>
        subjectColors[subject] || "bg-indigo-600/20 border-indigo-500/30 text-indigo-300";

    return (
        <DashboardLayout role="student" title="Timetable">
            <div className="page-header">Weekly Timetable</div>
            <p className="page-subheader">4th Semester · CS-A Division</p>

            {/* Day selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 fade-in">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                            "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                            selectedDay === day
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        )}
                    >
                        {day.slice(0, 3)}
                    </button>
                ))}
            </div>

            {/* Classes */}
            <div className="space-y-3 fade-in">
                {classes.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="text-white font-semibold">No classes on {selectedDay}</p>
                        <p className="text-slate-400 text-sm mt-1">Enjoy your free day!</p>
                    </div>
                ) : (
                    classes.map((cls, i) => (
                        <div key={cls.key || i} className={cn(
                            "border rounded-2xl p-4 flex items-start gap-4 fade-in relative overflow-hidden",
                            getColor(cls.subject),
                            cls.isOverride ? "ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/10" : ""
                        )}>
                            {cls.isOverride && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider shadow-sm">
                                    Rescheduled
                                </div>
                            )}

                            {/* Time column */}
                            <div className="flex-shrink-0 text-center min-w-[52px]">
                                <p className="text-xs font-semibold opacity-80">{cls.time}</p>
                                <div className="w-0.5 h-4 bg-current opacity-20 mx-auto my-1" />
                                <p className="text-xs opacity-60">{cls.end}</p>
                            </div>

                            {/* Divider */}
                            <div className="w-0.5 bg-current opacity-20 self-stretch rounded-full flex-shrink-0" />

                            {/* Content */}
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-white mb-0.5">{cls.subject}</p>
                                <p className="text-xs opacity-70">{cls.faculty}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs opacity-60">
                                    <span>🏛️ Room {cls.room}</span>
                                    <span>⏱️ {(() => {
                                        const [sh, sm] = cls.time.split(":").map(Number);
                                        const [eh, em] = cls.end.split(":").map(Number);
                                        const mins = (eh * 60 + em) - (sh * 60 + sm);
                                        return `${mins} min`;
                                    })()}</span>
                                </div>
                            </div>

                            {/* Period number */}
                            <span className="text-xs opacity-40 flex-shrink-0">{cls.isOverride ? 'EXTRA' : `P${i + 1}`}</span>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
