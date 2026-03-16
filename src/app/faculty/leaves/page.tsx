"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_LEAVES } from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import { CalendarClock, CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function FacultyLeavesPage() {
    const { userProfile } = useAuth();

    // Split into faculty's own leaves vs student leaves requesting approval
    const [myLeaves, setMyLeaves] = useState(DEMO_LEAVES.filter(l => l.role === "faculty" && l.applicant === (userProfile?.name || "Dr. Priya Mehta")));
    const [studentRequests, setStudentRequests] = useState(DEMO_LEAVES.filter(l => l.role === "student" && l.status === "pending"));
    const [tab, setTab] = useState<"my-leaves" | "approvals">("approvals");

    // Form states
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) return;

        const newLeave = {
            id: `l-${Date.now()}`,
            applicant: userProfile?.name || "Dr. Priya Mehta",
            role: "faculty",
            startDate,
            endDate,
            reason,
            status: "pending"
        };

        setMyLeaves(prev => [newLeave, ...prev]);
        setStartDate("");
        setEndDate("");
        setReason("");
        setTab("my-leaves");
    };

    const handleAction = (id: string) => {
        setStudentRequests(prev => prev.filter(r => r.id !== id));
        // In reality, updates DB.
    };

    return (
        <DashboardLayout role="faculty" title="Leave Management">
            <div className="page-header">Leaves & Approvals</div>
            <p className="page-subheader">Manage student leaves and apply for your own</p>

            <div className="flex gap-2 mb-6 border-b border-white/10 pb-px">
                <button
                    onClick={() => setTab("approvals")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${tab === "approvals" ? "text-blue-400 border-blue-400" : "text-slate-400 border-transparent hover:text-white"}`}
                >
                    Student Approvals {studentRequests.length > 0 && <span className="ml-1.5 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{studentRequests.length}</span>}
                </button>
                <button
                    onClick={() => setTab("my-leaves")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${tab === "my-leaves" ? "text-purple-400 border-purple-400" : "text-slate-400 border-transparent hover:text-white"}`}
                >
                    My Leave History
                </button>
            </div>

            {tab === "approvals" && (
                <div className="space-y-4 fade-in">
                    {studentRequests.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                            <p className="text-white font-medium text-lg">All caught up!</p>
                            <p className="text-slate-400 mt-1">No pending student leave requests to approve.</p>
                        </div>
                    ) : (
                        studentRequests.map(r => (
                            <div key={r.id} className="glass-card p-5 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20 text-blue-400 font-bold text-lg">
                                    {r.applicant.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium">{r.applicant} <span className="text-slate-500 text-xs font-normal">· Student</span></h4>
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
            )}

            {tab === "my-leaves" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
                    <div className="lg:col-span-1">
                        <div className="glass-card p-5 sticky top-24">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-purple-400" />
                                Apply for Leave
                            </h3>
                            <form onSubmit={handleApply} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block">End Date</label>
                                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Reason & Adjustments</label>
                                    <textarea value={reason} onChange={e => setReason(e.target.value)}
                                        rows={4}
                                        placeholder="Reason and class adjustment details..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none" />
                                </div>
                                <button type="submit" className="w-full btn-primary !from-purple-600 !to-indigo-600 py-2.5 text-sm">
                                    Submit to Coordinator
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {myLeaves.length === 0 ? (
                            <div className="glass-card p-10 text-center">
                                <CalendarClock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No past leave history</p>
                            </div>
                        ) : (
                            myLeaves.map(l => (
                                <div key={l.id} className="glass-card p-5 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border 
                                        ${l.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20' :
                                            l.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                                'bg-red-500/10 border-red-500/20'}`}>
                                        {l.status === 'pending' ? <Clock className="w-5 h-5 text-amber-400" /> :
                                            l.status === 'approved' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                                                <XCircle className="w-5 h-5 text-red-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white font-medium text-base truncate">{l.reason}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold
                                                ${l.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                    l.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        'bg-red-500/20 text-red-400'}`}>
                                                {l.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm">
                                            {formatDate(l.startDate)} {l.startDate !== l.endDate ? `to ${formatDate(l.endDate)}` : ''}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
