"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_ASSIGNMENTS } from "@/lib/demo-data";
import { BookOpen, Search, Upload, CheckCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState(DEMO_ASSIGNMENTS);
    const [search, setSearch] = useState("");

    const handleSimulatedSubmit = (id: string) => {
        setAssignments(prev => prev.map(a =>
            a.id === id ? { ...a, status: "submitted" } : a
        ));
    };

    const filtered = assignments.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout role="student" title="Assignments">
            <div className="page-header">My Assignments</div>
            <p className="page-subheader">View and submit your coursework</p>

            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map(a => (
                    <div key={a.id} className="glass-card flex flex-col hover:border-white/20 transition-all overflow-hidden group">
                        <div className="p-5 flex-1 border-b border-white/5">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1.5 
                                    ${a.status === 'pending' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400' :
                                        a.status === 'graded' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' :
                                            'bg-blue-500/20 border border-blue-500/30 text-blue-400'}`}>
                                    {a.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                    <span className="capitalize">{a.status}</span>
                                </span>
                                {a.marks && (
                                    <span className="font-bold text-emerald-400 text-lg bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                        {a.marks}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-white font-semibold text-lg leading-snug">{a.title}</h3>
                            <p className="text-slate-400 text-sm mt-1">{a.subject} • {a.faculty}</p>
                        </div>
                        <div className="p-4 bg-white/[0.02] flex items-center justify-between">
                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Clock className="w-4 h-4" /> Due: {formatDate(a.dueDate)}
                            </span>
                            {a.status === 'pending' && (
                                <button
                                    onClick={() => handleSimulatedSubmit(a.id)}
                                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
                                >
                                    <Upload className="w-3.5 h-3.5" /> Submit File
                                </button>
                            )}
                            {a.status === 'submitted' && (
                                <span className="text-xs text-slate-400 italic">Awaiting grading...</span>
                            )}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="lg:col-span-2 glass-card p-12 text-center">
                        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-lg">No assignments match your search</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
