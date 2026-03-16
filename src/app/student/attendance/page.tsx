"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_ATTENDANCE } from "@/lib/demo-data";
import { getAttendanceColor, getAttendanceBg } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type AggregatedAttendance = {
    subject: string;
    present: number;
    total: number;
    percent: number;
};

export default function AttendancePage() {
    const { userProfile } = useAuth();
    const [attendanceData, setAttendanceData] = useState<AggregatedAttendance[]>(DEMO_ATTENDANCE);

    useEffect(() => {
        if (!userProfile?.rollNumber) return;

        try {
            const q = query(
                collection(db, "attendance"),
                where("rollNumber", "==", userProfile.rollNumber)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                if (snapshot.empty) {
                    setAttendanceData(DEMO_ATTENDANCE);
                    return;
                }

                // Aggregate raw records by subject
                const tally: Record<string, { present: number; total: number }> = {};
                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    const sub = data.subject as string;
                    if (!tally[sub]) tally[sub] = { present: 0, total: 0 };

                    tally[sub].total++;
                    if (data.status === "present") tally[sub].present++;
                });

                const aggregated: AggregatedAttendance[] = Object.keys(tally).map((sub) => {
                    const t = tally[sub];
                    return {
                        subject: sub,
                        present: t.present,
                        total: t.total,
                        percent: t.total > 0 ? Math.round((t.present / t.total) * 100) : 0
                    };
                });

                if (aggregated.length > 0) {
                    setAttendanceData(aggregated);
                } else {
                    setAttendanceData(DEMO_ATTENDANCE);
                }
            }, (err) => {
                console.warn("Firestore listener failed, using demo fallback.", err);
                setTimeout(() => setAttendanceData(DEMO_ATTENDANCE), 0);
            });

            return () => unsubscribe();
        } catch {
            console.warn("Firestore connection failed.");
            setTimeout(() => setAttendanceData(DEMO_ATTENDANCE), 0);
        }
    }, [userProfile?.rollNumber]);

    const avg = attendanceData.length > 0
        ? Math.round(attendanceData.reduce((s, a) => s + a.percent, 0) / attendanceData.length)
        : 0;

    const chartData = attendanceData.map(a => ({ name: a.subject.split(" ")[0], pct: a.percent }));

    return (
        <DashboardLayout role="student" title="Attendance">
            <div className="page-header">Attendance</div>
            <p className="page-subheader">Track your attendance across all subjects</p>

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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                            labelStyle={{ color: "#fff" }}
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
                                className={`h-2 rounded-full progress-bar ${getAttendanceBg(subject.percent)}`}
                                style={{ width: `${subject.percent}%` }}
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
        </DashboardLayout>
    );
}
