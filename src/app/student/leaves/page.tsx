"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_LEAVES } from "@/lib/demo-data";
import { useAuth } from "@/lib/auth-context";
import { CalendarClock, CheckCircle, XCircle, Clock, Plus, Navigation } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentLeavesPage() {
    const { userProfile } = useAuth();
    const [leaves, setLeaves] = useState(DEMO_LEAVES.filter(l => l.role === "student" && l.applicant === (userProfile?.name || "Arjun Sharma")));

    // Form states
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [type, setType] = useState("Medical");

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) return;

        const newLeave = {
            id: `l-${Date.now()}`,
            applicant: userProfile?.name || "Arjun Sharma",
            role: "student",
            startDate,
            endDate,
            reason,
            status: "pending"
        };

        setLeaves(prev => [newLeave, ...prev]);
        setStartDate("");
        setEndDate("");
        setReason("");
    };

    return (
        <DashboardLayout role="student" title="Leave Requests">
            <div className="page-header">Leave Applications</div>
            <p className="page-subheader">Apply for leave and track approval status</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="glass-card p-5 sticky top-24">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-400" />
                            New Leave Request
                        </h3>
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Leave Type</label>
                                <select value={type} onChange={e => setType(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                                    <option value="Medical" className="bg-slate-900">Medical Leave</option>
                                    <option value="Personal" className="bg-slate-900">Personal Reason</option>
                                    <option value="Event" className="bg-slate-900">College Event/Duty</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">End Date</label>
                                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Reason</label>
                                <textarea value={reason} onChange={e => setReason(e.target.value)}
                                    rows={3}
                                    placeholder="Briefly explain your reason..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none" />
                            </div>
                            {type === "Medical" && (
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2 text-xs text-blue-300">
                                    <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>Medical certificates must be submitted to the department physically upon return.</p>
                                </div>
                            )}
                            <button type="submit" className="w-full btn-primary py-2.5 text-sm">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-white font-semibold">My Leave History</h3>

                    {leaves.length === 0 ? (
                        <div className="glass-card p-10 text-center">
                            <CalendarClock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No past leave history</p>
                        </div>
                    ) : (
                        leaves.map(l => (
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
                                {l.status === 'pending' && (
                                    <button onClick={() => setLeaves(prev => prev.filter(x => x.id !== l.id))} className="px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-medium rounded-lg transition-colors">
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
