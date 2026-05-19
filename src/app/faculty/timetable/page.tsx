"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTimetable } from "@/lib/useTimetable";
import { DAYS, getCurrentDay, cn } from "@/lib/utils";
import { Wifi, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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

export default function FacultyTimetablePage() {
    const { userProfile } = useAuth();
    const { timetable, lastUpdated } = useTimetable();
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());
    const [showAll, setShowAll] = useState(false);

    const myName = userProfile?.name || "Dr. Priya Mehta";
    const allClasses = (timetable[selectedDay] || []).sort((a, b) => {
        const ta = parseInt(a.time.replace(":", ""), 10);
        const tb = parseInt(b.time.replace(":", ""), 10);
        return ta - tb;
    });
    const myClasses = allClasses.filter(c => c.faculty === myName);
    const displayClasses = showAll ? allClasses : myClasses;

    return (
        <DashboardLayout role="faculty" title="Timetable">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                <div>
                    <div className="page-header mb-0">My Timetable</div>
                    <p className="page-subheader">CS-4A Division · {myName}</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Live indicator */}
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <Wifi className="w-3.5 h-3.5" />
                        Live
                        {lastUpdated && (
                            <span className="text-slate-500 font-normal">&nbsp;· Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        )}
                    </span>
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            showAll
                                ? "bg-purple-600/20 border-purple-500/30 text-purple-300"
                                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                        )}
                    >
                        {showAll ? "My Classes Only" : "Show Full Schedule"}
                    </button>
                </div>
            </div>

            {/* Day selector */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-2 fade-in">
                {DAYS.map(day => {
                    const mine = (timetable[day] || []).filter(c => c.faculty === myName).length;
                    return (
                        <button key={day} onClick={() => setSelectedDay(day)}
                            className={cn(
                                "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                selectedDay === day
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            )}>
                            {day.slice(0, 3)}
                            {mine > 0 && (
                                <span className={cn(
                                    "ml-1.5 text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center font-bold",
                                    selectedDay === day ? "bg-white/20" : "bg-purple-500/30 text-purple-300"
                                )}>{mine}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Summary strip */}
            <div className="glass-card px-4 py-3 mb-5 flex items-center gap-6 fade-in flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-white font-medium">{myClasses.length}</span>
                    <span className="text-slate-400">my classes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-slate-600" />
                    <span className="text-white font-medium">{allClasses.length - myClasses.length}</span>
                    <span className="text-slate-400">other classes</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedDay}
                </div>
            </div>

            {/* Classes */}
            <div className="space-y-3 fade-in">
                {displayClasses.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="text-white font-semibold">
                            {showAll ? `No classes on ${selectedDay}` : `No classes assigned to you on ${selectedDay}`}
                        </p>
                        {!showAll && (
                            <button onClick={() => setShowAll(true)} className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                View full schedule →
                            </button>
                        )}
                    </div>
                ) : (
                    displayClasses.map((cls, i) => {
                        const isMyClass = cls.faculty === myName;
                        return (
                            <div key={cls.id || i} className={cn(
                                "rounded-2xl p-4 flex items-center gap-4 border transition-all",
                                isMyClass
                                    ? "bg-purple-600/15 border-purple-500/30"
                                    : cn("opacity-50", getColor(cls.subject))
                            )}>
                                {/* Time */}
                                <div className="text-center min-w-[52px] flex-shrink-0">
                                    <p className={`text-xs font-semibold ${isMyClass ? "text-purple-300" : "text-slate-400"}`}>{cls.time}</p>
                                    <div className="w-0.5 h-4 bg-current opacity-20 mx-auto my-1" />
                                    <p className={`text-xs ${isMyClass ? "text-purple-400 opacity-70" : "text-slate-500"}`}>{cls.end}</p>
                                </div>

                                {/* Divider */}
                                <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${isMyClass ? "bg-purple-400 opacity-30" : "bg-slate-600"}`} />

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-white font-semibold text-sm truncate">{cls.subject}</p>
                                        {isMyClass && <span className="text-xs bg-purple-600/40 text-purple-300 px-2 py-0.5 rounded-full flex-shrink-0">My Class</span>}
                                        {cls.type === "lab" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold flex-shrink-0">Lab</span>}
                                    </div>
                                    <p className={`text-xs ${isMyClass ? "text-purple-300 opacity-70" : "text-slate-500"}`}>{cls.faculty}</p>
                                    <p className="text-xs text-slate-500 mt-1">🏛️ Room {cls.room}</p>
                                </div>

                                {/* Duration */}
                                <span className="text-[11px] text-slate-600 flex-shrink-0">
                                    {(() => {
                                        const [sh, sm] = cls.time.split(":").map(Number);
                                        const [eh, em] = cls.end.split(":").map(Number);
                                        return `${(eh * 60 + em) - (sh * 60 + sm)} min`;
                                    })()}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </DashboardLayout>
    );
}
