"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_ATTENDANCE, DEMO_TIMETABLE, DEMO_EXAMS, DEMO_NOTICES } from "@/lib/demo-data";
import { getCurrentDay, getAttendanceColor, getDaysUntil, formatDate, getGreetingTime } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Clock, TrendingUp, AlertTriangle, CalendarCheck, Bell, ChevronRight, Award } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { userProfile } = useAuth();
    const [noticeCount, setNoticeCount] = useState(DEMO_NOTICES.length);
    const [attendanceStats, setAttendanceStats] = useState({
        avg: Math.round(DEMO_ATTENDANCE.reduce((s, a) => s + a.percent, 0) / DEMO_ATTENDANCE.length),
        low: DEMO_ATTENDANCE.filter(a => a.percent < 75).length
    });
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        let unsubscribeNotices = () => { };
        let unsubscribeAttendance = () => { };

        setTimeout(() => setGreeting(getGreetingTime()), 0);
        const timeInterval = setInterval(() => setGreeting(getGreetingTime()), 60000);

        try {
            unsubscribeNotices = onSnapshot(collection(db, "notices"), (snapshot) => {
                if (!snapshot.empty) setNoticeCount(snapshot.docs.length);
            }, () => setNoticeCount(DEMO_NOTICES.length));

            if (userProfile?.rollNumber) {
                const q = query(
                    collection(db, "attendance"),
                    where("rollNumber", "==", userProfile.rollNumber)
                );
                unsubscribeAttendance = onSnapshot(q, (snapshot) => {
                    if (snapshot.empty) return;

                    const tally: Record<string, { present: number; total: number }> = {};
                    snapshot.docs.forEach((doc) => {
                        const data = doc.data();
                        const sub = data.subject as string;
                        if (!tally[sub]) tally[sub] = { present: 0, total: 0 };
                        tally[sub].total++;
                        if (data.status === "present") tally[sub].present++;
                    });

                    const aggregated = Object.values(tally).map(t =>
                        t.total > 0 ? Math.round((t.present / t.total) * 100) : 0
                    );

                    if (aggregated.length > 0) {
                        setAttendanceStats({
                            avg: Math.round(aggregated.reduce((s, p) => s + p, 0) / aggregated.length),
                            low: aggregated.filter(p => p < 75).length
                        });
                    }
                }, () => { });
            }

        } catch {
            // Attendance stats stay gracefully on DEMO defaults
        }

        return () => {
            unsubscribeNotices();
            unsubscribeAttendance();
            clearInterval(timeInterval);
        };
    }, [userProfile?.rollNumber]);

    const today = getCurrentDay();
    const todayClasses = DEMO_TIMETABLE[today] || [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const avgAttendance = attendanceStats.avg;
    const lowAttendance = attendanceStats.low;
    const upcomingExams = DEMO_EXAMS.filter(e => getDaysUntil(e.date) > 0).slice(0, 3);

    // Find current/next class
    let currentClass = null;
    let nextClass = null;
    for (let i = 0; i < todayClasses.length; i++) {
        const cls = todayClasses[i];
        const [sh, sm] = cls.time.split(":").map(Number);
        const [eh, em] = cls.end.split(":").map(Number);
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        const nowMins = currentHour * 60 + currentMin;
        if (nowMins >= startMins && nowMins < endMins) { currentClass = cls; break; }
        if (nowMins < startMins && !nextClass) { nextClass = cls; }
    }

    return (
        <DashboardLayout role="student" title="Dashboard">
            {/* Welcome */}
            <div className="mb-6 fade-in">
                <h1 className="text-2xl lg:text-3xl font-bold t-heading">
                    Good {greeting || getGreetingTime()},{" "}
                    <span className="gradient-text">{userProfile?.name?.split(" ")[0] || "Student"} 👋</span>
                </h1>
                <p className="t-muted mt-1 text-sm">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
            </div>

            {/* Current class banner */}
            {currentClass && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center gap-4 fade-in">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 pulse-glow">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-0.5">🔴 Now in Class</p>
                        <p className="t-heading font-semibold">{currentClass.subject}</p>
                        <p className="t-muted text-xs">{currentClass.faculty} · Room {currentClass.room} · until {currentClass.end}</p>
                    </div>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
                <Link href="/student/attendance">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">Avg Attendance</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>
                        <p className={`text-4xl font-bold ${getAttendanceColor(avgAttendance)} my-1`}>{avgAttendance}%</p>
                        {lowAttendance > 0 ? (
                            <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-auto pt-2 theme-divider border-t">
                                <AlertTriangle className="w-3.5 h-3.5" />{lowAttendance} subject{lowAttendance > 1 ? "s" : ""} low
                            </p>
                        ) : (
                            <p className="text-xs t-muted flex items-center gap-1.5 mt-auto pt-2 theme-divider border-t">
                                On track
                            </p>
                        )}
                    </div>
                </Link>

                <Link href="/student/today-schedule">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">Classes Today</span>
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-blue-400 my-1">{todayClasses.length}</p>
                        <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate">
                            {nextClass ? `Next: ${nextClass.time} (${nextClass.subject})` : "No more classes today"}
                        </p>
                    </div>
                </Link>

                <Link href="/student/exam-schedule">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">Upcoming Exams</span>
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <CalendarCheck className="w-4 h-4 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-purple-400 my-1">{DEMO_EXAMS.length}</p>
                        <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate">
                            {upcomingExams[0] ? `Next in ${getDaysUntil(upcomingExams[0].date)}d (${upcomingExams[0].subject})` : "No upcoming exams"}
                        </p>
                    </div>
                </Link>

                <Link href="/student/notices">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">New Notices</span>
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-amber-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-amber-400 my-1">{noticeCount}</p>
                        <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate">
                            Recent college announcements
                        </p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8 items-stretch">
                {/* Today's schedule summary */}
                <div className="glass-card p-6 fade-in flex flex-col h-full hidden-scrollbar">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="t-heading font-semibold text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Today&apos;s Schedule
                        </h3>
                        <Link href="/student/today-schedule" className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300">
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {todayClasses.slice(0, 4).map((cls, i) => {
                            const [sh, sm] = cls.time.split(":").map(Number);
                            const [eh, em] = cls.end.split(":").map(Number);
                            const startMins = sh * 60 + sm;
                            const endMins = eh * 60 + em;
                            const nowMins = currentHour * 60 + currentMin;
                            const isNow = nowMins >= startMins && nowMins < endMins;
                            const isDone = nowMins >= endMins;
                            return (
                                <div key={i} className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 border ${isNow ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] border-transparent"
                                    } ${isDone ? "opacity-50 grayscale" : ""}`}>
                                    <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${isNow ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" : isDone ? "bg-slate-400" : "bg-slate-400"
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isNow ? "text-blue-500" : "t-heading"}`}>{cls.subject}</p>
                                        <p className="t-muted text-xs mt-0.5 flex items-center gap-2">
                                            <span>{cls.time} – {cls.end}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                            <span>Room {cls.room}</span>
                                        </p>
                                    </div>
                                    {isNow && <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-500 font-medium border border-blue-500/20">Now</span>}
                                </div>
                            );
                        })}
                        {todayClasses.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                                <CalendarCheck className="w-10 h-10 text-slate-600 mb-3" />
                                <p className="text-slate-300 font-medium">No classes today 🎉</p>
                                <p className="text-slate-500 text-xs mt-1">Enjoy your free time!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div className="glass-card p-6 fade-in flex flex-col h-full hidden-scrollbar">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="t-heading font-semibold text-lg flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-purple-400" />
                            Upcoming Exams
                        </h3>
                        <Link href="/student/exam-schedule" className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300">
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {upcomingExams.map(exam => {
                            const days = getDaysUntil(exam.date);
                            return (
                                <div key={exam.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] transition-colors border border-[var(--border-item)]">
                                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-lg
                    ${days <= 3 ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20" : days <= 7 ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20" : "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20"}`}>
                                        <span className="text-lg font-bold leading-none">{days}</span>
                                        <span className="text-[9px] uppercase tracking-wider opacity-80 mt-0.5">days</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="t-heading text-sm font-semibold truncate">{exam.subject}</p>
                                        <p className="t-muted text-xs mt-0.5 flex items-center gap-2">
                                            <span>{formatDate(exam.date)}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                            <span>{exam.time}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {upcomingExams.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                                <Award className="w-10 h-10 text-slate-600 mb-3" />
                                <p className="text-slate-300 font-medium">No upcoming exams</p>
                                <p className="text-slate-500 text-xs mt-1">Keep up the good work!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick links */}
            <div className="glass-card p-6 fade-in mb-4">
                <h3 className="t-heading font-semibold text-lg mb-5 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Quick Actions
                </h3>
                <div className="flex overflow-x-auto gap-3 lg:gap-4 pb-2 hidden-scrollbar snap-x">
                    {[
                        { href: "/student/attendance", label: "Attendance", icon: "📊", glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/30" },
                        { href: "/student/timetable", label: "Timetable", icon: "📅", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-blue-500/30" },
                        { href: "/student/exam-schedule", label: "Exams", icon: "📝", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:border-purple-500/30" },
                        { href: "/student/seating-plan", label: "Seating", icon: "🗺️", glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:border-amber-500/30" },
                        { href: "/student/results", label: "Results", icon: "🏆", glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] group-hover:border-yellow-500/30" },
                        { href: "/student/notices", label: "Notices", icon: "🔔", glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:border-red-500/30" },
                    ].map(item => (
                        <Link key={item.href} href={item.href} className="group outline-none min-w-[140px] flex-shrink-0 snap-start flex-1">
                            <div className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-[var(--bg-item)] border border-[var(--border-item)] transition-all duration-300 ${item.glow} hover:bg-[var(--bg-item-hover)] h-full`}>
                                <span className="text-4xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-md">{item.icon}</span>
                                <span className="text-sm t-body font-medium text-center">{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
