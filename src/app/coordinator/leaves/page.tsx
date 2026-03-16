"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_LEAVES } from "@/lib/demo-data";
import { CalendarClock, CheckCircle, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CoordinatorLeavesPage() {
    const [requests, setRequests] = useState(DEMO_LEAVES.filter(l => l.status === "pending"));
    const [search, setSearch] = useState("");

    const handleAction = (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        // In a real application, update Firebase and perhaps send an email notification.
    };

    const filtered = requests.filter(r =>
        r.applicant.toLowerCase().includes(search.toLowerCase()) ||
        r.reason.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout role="coordinator" title="Master Leave Approvals">
            <div className="page-header">Campus Leave Approvals</div>
            <p className="page-subheader">Review and triage staff and student absences</p>

            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search applicant or reason..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-4 fade-in">
                {filtered.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                        <p className="text-white font-medium text-lg">Queue Empty</p>
                        <p className="text-slate-400 mt-1">No pending leave requests found across the campus.</p>
                    </div>
                ) : (
                    filtered.map(r => (
                        <div key={r.id} className="glass-card p-5 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border font-bold text-lg
                                ${r.role === 'faculty' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                {r.applicant.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium">{r.applicant} <span className="text-slate-500 text-xs font-normal capitalize">· {r.role}</span></h4>
                                <p className="text-slate-300 text-sm mt-1 mb-1.5">&quot;{r.reason}&quot;</p>
                                <p className="text-slate-500 text-xs flex items-center gap-1.5">
                                    <CalendarClock className="w-3.5 h-3.5" />
                                    {formatDate(r.startDate)} {r.startDate !== r.endDate ? `to ${formatDate(r.endDate)}` : ''}
                                </p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => handleAction(r.id)} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 transition-colors">
                                    Decline
                                </button>
                                <button onClick={() => handleAction(r.id)} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl border border-emerald-500/20 transition-colors">
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
