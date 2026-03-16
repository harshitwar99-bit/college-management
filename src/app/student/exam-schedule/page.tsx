"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_EXAMS } from "@/lib/demo-data";
import { getDaysUntil, formatDate, formatTime } from "@/lib/utils";
import { CalendarDays, Clock, BookOpen } from "lucide-react";

export default function ExamSchedulePage() {
    const sorted = [...DEMO_EXAMS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <DashboardLayout role="student" title="Exam Schedule">
            <div className="page-header">Exam Schedule</div>
            <p className="page-subheader">Mid-Semester Examinations · March 2026</p>

            {/* Banner */}
            <div className="glass-card p-5 mb-6 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/20 fade-in">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">📝</div>
                    <div>
                        <p className="text-white font-semibold">Mid-Semester Examinations</p>
                        <p className="text-slate-400 text-sm">{sorted.length} exams · Starts {formatDate(sorted[0]?.date)}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-3xl font-bold text-purple-400">{getDaysUntil(sorted[0]?.date)}</p>
                        <p className="text-slate-400 text-xs">days to go</p>
                    </div>
                </div>
            </div>

            {/* Exam cards */}
            <div className="space-y-3 fade-in">
                {sorted.map((exam) => {
                    const days = getDaysUntil(exam.date);
                    const isPast = days < 0;
                    const isToday = days === 0;
                    return (
                        <div key={exam.id} className={`glass-card p-4 flex items-center gap-4 hover:border-white/20 transition-all ${isPast ? "opacity-50" : ""}`}>
                            {/* Date badge */}
                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white
                ${isToday ? "bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-500/30" :
                                    isPast ? "bg-slate-700" :
                                        days <= 3 ? "bg-gradient-to-br from-amber-600 to-orange-600" :
                                            "bg-gradient-to-br from-purple-700 to-indigo-700"}`}>
                                <span className="text-xs font-medium opacity-80 uppercase">
                                    {new Date(exam.date).toLocaleDateString("en-IN", { month: "short" })}
                                </span>
                                <span className="text-xl font-bold leading-none">
                                    {new Date(exam.date).getDate()}
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-semibold">{exam.subject}</span>
                                    {isToday && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">TODAY</span>}
                                    {isPast && <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">DONE</span>}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(exam.time)}</span>
                                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{exam.duration}</span>
                                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{exam.type}</span>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                {!isPast && (
                                    <>
                                        <p className={`text-2xl font-bold ${days <= 3 ? "text-red-400" : days <= 7 ? "text-amber-400" : "text-purple-400"}`}>{days}</p>
                                        <p className="text-slate-500 text-xs">days left</p>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Important instructions */}
            <div className="glass-card p-5 mt-6 fade-in border-amber-500/20 bg-amber-500/5">
                <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">⚠️ Exam Instructions</h3>
                <ul className="space-y-1.5 text-sm text-slate-400">
                    <li>• Report to the exam hall 15 minutes before start time</li>
                    <li>• Carry your Hall Ticket and College ID Card</li>
                    <li>• Mobile phones are strictly prohibited in the exam hall</li>
                    <li>• Refer to the Seating Plan section for your seat number</li>
                </ul>
            </div>
        </DashboardLayout>
    );
}
