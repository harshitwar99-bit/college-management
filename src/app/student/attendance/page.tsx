"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getDemoData } from "@/lib/demo-data";
import { getAttendanceColor, getAttendanceBg } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type AggregatedAttendance = {
    subject: string;
    present: number;
    total: number;
    percent: number;
};

function AttendanceSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="glass-card p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="h-3 w-32 bg-white/10 rounded" />
                        <div className="h-12 w-24 bg-white/10 rounded" />
                        <div className="h-3 w-28 bg-white/10 rounded" />
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-4 w-32 bg-white/10 rounded" />)}
                    </div>
                </div>
            </div>
            <div className="glass-card p-5">
                <div className="h-4 w-40 bg-white/10 rounded mb-4" />
                <div className="h-48 bg-white/5 rounded-xl" />
            </div>
            {[1, 2, 3].map(i => (
                <div key={i} className="glass-card p-4">
                    <div className="flex justify-between mb-3">
                        <div className="h-4 w-36 bg-white/10 rounded" />
                        <div className="h-4 w-12 bg-white/10 rounded" />
                    </div>
                    <div className="h-2 bg-white/10 rounded-full mb-2" />
                    <div className="flex justify-between">
                        <div className="h-3 w-28 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/10 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AttendancePage() {
    const { userProfile } = useAuth();
    const [attendanceData, setAttendanceData] = useState<AggregatedAttendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userProfile?.id) return;

        const fetchAttendance = async () => {
            setIsLoading(true);
            const demoData = getDemoData(userProfile?.branch).attendance;
            try {
                const res = await fetch(`/api/attendance?firebaseId=${userProfile.id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                if (json.success && json.data.length > 0) {
                    setAttendanceData(json.data);
                } else {
                    setAttendanceData(demoData);
                }
            } catch (err) {
                console.warn("API connection failed, using demo fallback.", err);
                setAttendanceData(demoData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, [userProfile?.id, userProfile?.branch]);

    const avg = attendanceData.length > 0
        ? Math.round(attendanceData.reduce((s, a) => s + a.percent, 0) / attendanceData.length)
        : 0;

    const chartData = attendanceData.map(a => ({ name: a.subject.split(" ")[0], pct: a.percent }));

    return (
        <DashboardLayout role="student" title="Attendance">
            <div className="page-header">Attendance</div>
            <p className="page-subheader">Track your attendance across all subjects</p>

            {isLoading ? (
                <AttendanceSkeleton />
            ) : (
                <>
                    {/* Overall */}
                    <div className="glass-card p-5 mb-6 fade-in">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Overall Attendance</p>
                                <p className={`text-5xl font-bold ${getAttendanceColor(avg)}`}>{avg}%</p>
                                <p className="text-slate-500 text-xs mt-1">Across {attendanceData.length} subjects</p>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-slate-400">≥75% — Safe</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="text-slate-400">60–74% — Warning</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-slate-400">&lt;60% — Critical</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div className="glass-card p-5 mb-6 fade-in">
                        <h3 className="text-white font-semibold mb-4">Subject-wise Overview</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-item)" />
                                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-card)", borderRadius: 12 }}
                                    labelStyle={{ color: "var(--text-heading)" }}
                                    itemStyle={{ color: "var(--text-body)" }}
                                    formatter={(val: number | string | undefined) => [`${val}%`, "Attendance"]}
                                />
                                <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.pct >= 75 ? "#10b981" : entry.pct >= 60 ? "#f59e0b" : "#ef4444"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Subject list */}
                    <div className="space-y-3 fade-in">
                        {attendanceData.map((subject, i) => (
                            <div key={i} className="glass-card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {subject.percent >= 75 ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        ) : subject.percent >= 60 ? (
                                            <Info className="w-4 h-4 text-amber-400" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                        )}
                                        <span className="text-white font-medium text-sm">{subject.subject}</span>
                                    </div>
                                    <span className={`text-lg font-bold ${getAttendanceColor(subject.percent)}`}>
                                        {subject.percent}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                                    <div
                                        className={`h-2 rounded-full ${getAttendanceBg(subject.percent)}`}
                                        style={{ width: `${subject.percent}%`, transition: 'width 0.8s ease-out' }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>{subject.present} classes attended</span>
                                    <span>{subject.total} total classes</span>
                                </div>
                                {subject.percent < 75 && (
                                    <div className="mt-2 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg">
                                        Need to attend {Math.ceil((0.75 * subject.total - subject.present) / (1 - 0.75))} more classes to reach 75%
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
