"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_EXAMS, DEMO_SEATING } from "@/lib/demo-data";
import { formatDate, getDaysUntil } from "@/lib/utils";
import { Plus, MapPin, Calendar, Clock } from "lucide-react";

export default function FacultyExamsPage() {
    const [activeTab, setActiveTab] = useState<"schedule" | "seating">("schedule");
    const [showForm, setShowForm] = useState(false);

    return (
        <DashboardLayout role="faculty" title="Exams">
            <div className="page-header">Exam Management</div>
            <p className="page-subheader">Manage exam schedules and seating arrangements</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 fade-in">
                {[{ key: "schedule", label: "📅 Exam Schedule" }, { key: "seating", label: "🗺️ Seating Plan" }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as "schedule" | "seating")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                                : "bg-white/5 text-slate-400 hover:text-white"
                            }`}>
                        {tab.label}
                    </button>
                ))}
                <button onClick={() => setShowForm(!showForm)}
                    className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-600/30 transition-colors">
                    <Plus className="w-4 h-4" /> Add Exam
                </button>
            </div>

            {/* Add exam form */}
            {showForm && (
                <div className="glass-card p-5 mb-5 fade-in border-emerald-500/20">
                    <h3 className="text-white font-semibold mb-4">New Exam Entry</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { label: "Subject", placeholder: "e.g. Data Structures", type: "text" },
                            { label: "Date", placeholder: "", type: "date" },
                            { label: "Time", placeholder: "", type: "time" },
                            { label: "Duration", placeholder: "e.g. 3 hours", type: "text" },
                            { label: "Hall", placeholder: "e.g. Hall A", type: "text" },
                            { label: "Type", placeholder: "Mid-Semester / End-Semester", type: "text" },
                        ].map(f => (
                            <div key={f.label}>
                                <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button className="btn-primary text-sm px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25">
                            Save Exam
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "schedule" ? (
                <div className="space-y-3 fade-in">
                    {DEMO_EXAMS.map(exam => {
                        const days = getDaysUntil(exam.date);
                        return (
                            <div key={exam.id} className="glass-card p-4 flex items-center gap-4 hover:border-white/20 transition-all">
                                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white
                  ${days < 0 ? "bg-slate-700" : days <= 3 ? "bg-red-700" : "bg-purple-700"}`}>
                                    <span className="text-xs font-medium">{new Date(exam.date).toLocaleDateString("en-IN", { month: "short" })}</span>
                                    <span className="text-xl font-bold leading-none">{new Date(exam.date).getDate()}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold">{exam.subject}</p>
                                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.time}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{exam.duration}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exam.type}</span>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${days < 0 ? "text-slate-500" : days <= 3 ? "text-red-400" : "text-purple-400"}`}>
                                    {days < 0 ? "Done" : `${days}d`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card overflow-hidden fade-in">
                    <div className="p-4 border-b border-white/5"><p className="text-white font-semibold">Seating Assignments — CS-4A</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {["Subject", "Date", "Hall", "Row", "Seat", "Roll No."].map(h => (
                                        <th key={h} className="text-left text-slate-400 text-xs font-medium px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {DEMO_SEATING.map(seat => (
                                    <tr key={seat.examId} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                                        <td className="text-white px-4 py-3 font-medium">{seat.subject}</td>
                                        <td className="text-slate-400 px-4 py-3">{formatDate(seat.date)}</td>
                                        <td className="text-slate-300 px-4 py-3">{seat.hall}</td>
                                        <td className="text-slate-300 px-4 py-3">Row {seat.row}</td>
                                        <td className="text-slate-300 px-4 py-3">{seat.seat}</td>
                                        <td className="text-slate-400 px-4 py-3 font-mono text-xs">{seat.rollNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
