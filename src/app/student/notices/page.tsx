"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_NOTICES } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Bell, BookOpen, Calendar, Star, Sun, Info } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    exam: { icon: BookOpen, color: "text-purple-400", bg: "bg-purple-600/15 border-purple-500/20" },
    assignment: { icon: Star, color: "text-blue-400", bg: "bg-blue-600/15 border-blue-500/20" },
    event: { icon: Calendar, color: "text-amber-400", bg: "bg-amber-600/15 border-amber-500/20" },
    holiday: { icon: Sun, color: "text-emerald-400", bg: "bg-emerald-600/15 border-emerald-500/20" },
    general: { icon: Info, color: "text-slate-400", bg: "bg-slate-700/30 border-slate-600/20" },
};

export default function NoticesPage() {
    const [notices, setNotices] = useState<typeof DEMO_NOTICES>(DEMO_NOTICES);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [filter, setFilter] = useState("all");
    const filters = ["all", "exam", "assignment", "event", "holiday", "general"];

    useEffect(() => {
        try {
            const q = query(collection(db, "notices"), orderBy("date", "desc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedNotices = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate?.()?.toISOString() || new Date().toISOString()
                })) as typeof DEMO_NOTICES;
                if (fetchedNotices.length > 0) {
                    setNotices(fetchedNotices);
                } else {
                    setNotices(DEMO_NOTICES);
                }
            }, (error) => {
                console.warn("Firestore listener failed, using demo data fallback.", error);
                setTimeout(() => setNotices(DEMO_NOTICES), 0);
            });

            return () => unsubscribe();
        } catch {
            console.warn("Firestore connection failed.");
            setTimeout(() => setNotices(DEMO_NOTICES), 0);
        }
    }, []);

    const filtered = filter === "all" ? notices : notices.filter(n => n.type === filter);

    return (
        <DashboardLayout role="student" title="Notices">
            <div className="page-header">Notice Board</div>
            <p className="page-subheader">{notices.length} announcements from college & faculty</p>

            {/* Filter chips */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 fade-in">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 ${filter === f
                            ? "bg-blue-600 text-white"
                            : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        {f === "all" ? `All (${notices.length})` : f}
                    </button>
                ))}
            </div>

            {/* Notices */}
            <div className="space-y-3 fade-in">
                {filtered.map(notice => {
                    const config = TYPE_CONFIG[notice.type] || TYPE_CONFIG.general;
                    const isExpanded = expanded === notice.id;
                    return (
                        <div
                            key={notice.id}
                            className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${config.bg} hover:border-white/20`}
                            onClick={() => setExpanded(isExpanded ? null : notice.id)}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 ${config.color}`}>
                                    <config.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm leading-snug">{notice.title}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                        <span>{notice.author}</span>
                                        <span>·</span>
                                        <span>{formatDate(notice.date)}</span>
                                        <span className={`ml-auto capitalize ${config.color} font-medium`}>{notice.type}</span>
                                    </div>
                                    {isExpanded && (
                                        <p className="text-slate-300 text-sm mt-3 leading-relaxed border-t border-white/10 pt-3">
                                            {notice.body}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="glass-card p-10 text-center">
                        <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-500">No notices in this category</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
