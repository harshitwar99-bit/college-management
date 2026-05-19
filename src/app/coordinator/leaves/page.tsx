"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CalendarClock, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type LeaveStatus = "pending" | "approved" | "rejected";

const DEMO_ALL_LEAVES = [
    { id: "demo_L1", applicant: "Dr. Priya Mehta", role: "faculty", startDate: "2026-04-12", endDate: "2026-04-15", reason: "Attending International AI Conference in Bangalore", status: "pending" as LeaveStatus },
    { id: "demo_L2", applicant: "Divyanshi Sharma", role: "student", startDate: "2026-04-14", endDate: "2026-04-14", reason: "Medical leave - Dental surgery", status: "pending" as LeaveStatus },
    { id: "demo_L3", applicant: "Rahul Verma", role: "student", startDate: "2026-03-20", endDate: "2026-03-21", reason: "Family function - Sister's wedding", status: "approved" as LeaveStatus },
    { id: "demo_L4", applicant: "Prof. Anil Kumar", role: "faculty", startDate: "2026-03-10", endDate: "2026-03-10", reason: "Workshop on Modern Teaching Methodologies", status: "approved" as LeaveStatus },
    { id: "demo_L5", applicant: "Sneha Tiwari", role: "student", startDate: "2026-03-05", endDate: "2026-03-06", reason: "Personal emergency", status: "rejected" as LeaveStatus },
];

export default function CoordinatorLeavesPage() {
    const { userProfile } = useAuth();
    const [all, setAll] = useState<any[]>(DEMO_ALL_LEAVES);
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
    const [roleFilter, setRoleFilter] = useState<"all" | "student" | "faculty">("all");

    useEffect(() => {
        if (!userProfile?.id) return;
        const fetchLeaves = async () => {
            try {
                const res = await fetch(`/api/leaves?firebaseId=${userProfile.id}`);
                const json = await res.json();
                if (json.success && json.data.length > 0) {
                    const mapped = json.data.map((l: any) => ({
                        ...l,
                        applicant: l.user?.name || "Unknown",
                        role: l.role?.toLowerCase() || "student",
                        status: l.status.toLowerCase() as LeaveStatus
                    }));
                    setAll(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch leaves", err);
            }
        };
        fetchLeaves();
    }, [userProfile?.id]);

    const handleAction = async (id: string, newStatus: "approved" | "rejected") => {
        if (!userProfile?.id) return;
        try {
            const res = await fetch(`/api/leaves`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firebaseId: userProfile.id, leaveId: id, status: newStatus.toUpperCase() })
            });
            if (res.ok) {
                setAll(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            }
        } catch (error) {
            // Demo mode: update locally
            setAll(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        }
    };

    const filtered = all.filter(r => {
        const matchTab = r.status === tab;
        const matchRole = roleFilter === "all" || r.role === roleFilter;
        const matchSearch = r.applicant.toLowerCase().includes(search.toLowerCase()) ||
            r.reason.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchRole && matchSearch;
    });

    const counts = {
        pending: all.filter(r => r.status === "pending").length,
        approved: all.filter(r => r.status === "approved").length,
        rejected: all.filter(r => r.status === "rejected").length,
    };

    return (
        <DashboardLayout role="coordinator" title="Master Leave Approvals">
            <div className="page-header">Campus Leave Approvals</div>
            <p className="page-subheader">Review and manage all staff and student leave requests</p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">{counts.pending}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Pending</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{counts.approved}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Approved</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-red-400">{counts.rejected}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Rejected</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 border-b border-white/10 pb-px fade-in">
                {(["pending", "approved", "rejected"] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors border-b-2 capitalize flex items-center gap-1.5",
                            tab === t
                                ? t === "pending" ? "text-amber-400 border-amber-400"
                                    : t === "approved" ? "text-emerald-400 border-emerald-400"
                                        : "text-red-400 border-red-400"
                                : "text-slate-400 border-transparent hover:text-white"
                        )}
                    >
                        {t === "pending" && <Clock className="w-3.5 h-3.5" />}
                        {t === "approved" && <CheckCircle className="w-3.5 h-3.5" />}
                        {t === "rejected" && <XCircle className="w-3.5 h-3.5" />}
                        {t}
                        {counts[t] > 0 && (
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                t === "pending" ? "bg-amber-500/20 text-amber-400"
                                    : t === "approved" ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/20 text-red-400"
                            )}>
                                {counts[t]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5 fade-in">
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
                <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    {(["all", "student", "faculty"] as const).map(r => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all",
                                roleFilter === r
                                    ? "bg-blue-600/20 border-blue-500/30 text-blue-300"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 fade-in">
                {filtered.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        {tab === "pending" ? (
                            <>
                                <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                                <p className="text-white font-medium text-lg">Queue Empty</p>
                                <p className="text-slate-400 mt-1">No pending leave requests found.</p>
                            </>
                        ) : (
                            <>
                                <CalendarClock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-white font-medium">No {tab} requests</p>
                            </>
                        )}
                    </div>
                ) : (
                    filtered.map(r => (
                        <div key={r.id} className="glass-card p-5 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border font-bold text-lg
                                ${r.role === 'faculty' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                {r.applicant.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-white font-medium">{r.applicant}</h4>
                                    <span className="text-slate-500 text-xs capitalize">· {r.role}</span>
                                    {r.status !== "pending" && (
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold",
                                            r.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                        )}>
                                            {r.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-300 text-sm mb-1.5">&quot;{r.reason}&quot;</p>
                                <p className="text-slate-500 text-xs flex items-center gap-1.5">
                                    <CalendarClock className="w-3.5 h-3.5" />
                                    {formatDate(r.startDate)} {r.startDate !== r.endDate ? `to ${formatDate(r.endDate)}` : ''}
                                </p>
                            </div>
                            {tab === "pending" && (
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button onClick={() => handleAction(r.id, "rejected")} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 transition-colors">
                                        Decline
                                    </button>
                                    <button onClick={() => handleAction(r.id, "approved")} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl border border-emerald-500/20 transition-colors">
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
