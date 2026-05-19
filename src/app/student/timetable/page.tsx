"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTimetable } from "@/lib/useTimetable";
import { useAuth } from "@/lib/auth-context";
import { DAYS, getCurrentDay, cn } from "@/lib/utils";
import { Wifi, Clock, Zap } from "lucide-react";

const SUBJECT_COLORS: Record<string, string> = {
    "CET-Theory":        "bg-cyan-600/20 border-cyan-500/30 text-cyan-300",
    "CGMA-Theory":       "bg-teal-600/20 border-teal-500/30 text-teal-300",
    "CGMA-Lab":          "bg-emerald-600/20 border-emerald-500/30 text-emerald-300",
    "OS-Theory":         "bg-purple-600/20 border-purple-500/30 text-purple-300",
    "OT-Theory":         "bg-amber-600/20 border-amber-500/30 text-amber-300",
    "SE-Theory":         "bg-pink-600/20 border-pink-500/30 text-pink-300",
    "Mathematics - III": "bg-blue-600/20 border-blue-500/30 text-blue-300",
    "Data Structures":   "bg-indigo-600/20 border-indigo-500/30 text-indigo-300",
    "Algorithms":        "bg-violet-600/20 border-violet-500/30 text-violet-300",
    "DBMS":              "bg-rose-600/20 border-rose-500/30 text-rose-300",
};
const getColor = (subject: string) =>
    SUBJECT_COLORS[subject] || "bg-indigo-600/20 border-indigo-500/30 text-indigo-300";

export default function TimetablePage() {
    const { userProfile } = useAuth();
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());
    const { timetable, lastUpdated } = useTimetable(userProfile?.branch);

    const classes = (timetable[selectedDay] || []).sort((a, b) => {
        const ta = parseInt(a.time.replace(":", ""), 10);
        const tb = parseInt(b.time.replace(":", ""), 10);
        return ta - tb;
    });

    return (
        <DashboardLayout role="student" title="Timetable">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                <div>
                    <div className="page-header mb-0">Weekly Timetable</div>
                    <p className="page-subheader">{userProfile?.branch || "BCA"} · {userProfile?.semester || "4th Semester"} · Section A</p>
                </div>
                {/* Live sync indicator */}
                <div className="flex items-center gap-1.5 text-xs">
                    {lastUpdated ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="relative flex w-2 h-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            Live
                            <span className="text-slate-500 font-normal">&nbsp;· {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                    ) : (
                        <span className="text-slate-500 flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5" /> Connecting…
                        </span>
                    )}
                </div>
            </div>

            {/* Day selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 fade-in">
                {DAYS.map(day => {
                    const count = (timetable[day] || []).length;
                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                                "flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                                selectedDay === day
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {day.slice(0, 3)}
                            {count > 0 && (
                                <span className={cn(
                                    "text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold",
                                    selectedDay === day ? "bg-white/20" : "bg-blue-500/20 text-blue-400"
                                )}>{count}</span>
                            )}
                        </button>
                    );
                })}
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
                        <div
                            key={cls.id || i}
                            className={cn(
                                "border rounded-2xl p-4 flex items-start gap-4 fade-in relative overflow-hidden",
                                getColor(cls.subject)
                            )}
                        >
                            {/* Time column */}
                            <div className="flex-shrink-0 text-center min-w-[52px]">
                                <p className="text-xs font-semibold opacity-80">{cls.time}</p>
                                <div className="w-0.5 h-4 bg-current opacity-20 mx-auto my-1" />
                                <p className="text-xs opacity-60">{cls.end}</p>
                            </div>

                            {/* Divider */}
                            <div className="w-0.5 bg-current opacity-20 self-stretch rounded-full flex-shrink-0" />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <p className="font-semibold text-sm text-white">{cls.subject}</p>
                                    {cls.type === "lab" && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">Lab</span>
                                    )}
                                </div>
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

                            {/* Period badge */}
                            <span className="text-xs opacity-40 flex-shrink-0 self-center">P{i + 1}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Real-time notice */}
            <div className="mt-6 p-3 rounded-xl border border-blue-500/10 bg-blue-500/5 flex items-center gap-2 text-xs text-slate-500 fade-in">
                <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                This timetable updates automatically when the coordinator makes changes — no refresh needed.
            </div>
        </DashboardLayout>
    );
}
