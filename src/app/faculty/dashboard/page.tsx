"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_TIMETABLE, DEMO_NOTICES, DEMO_STUDENTS } from "@/lib/demo-data";
import { getCurrentDay, getGreetingTime } from "@/lib/utils";
import { Users, Bell, ChevronRight, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FacultyDashboard() {
    const { userProfile } = useAuth();
    const now = new Date();
    const today = getCurrentDay();
    const todayClasses = DEMO_TIMETABLE[today] || [];
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        setTimeout(() => setGreeting(getGreetingTime()), 0);
        const timeInterval = setInterval(() => setGreeting(getGreetingTime()), 60000);
        return () => clearInterval(timeInterval);
    }, []);

    // Faculty's own classes
    const myClasses = todayClasses.filter(c => c.faculty === (userProfile?.name || "Dr. Priya Mehta"));
    const presentCount = DEMO_STUDENTS.filter(s => s.status === "present").length;
    const attendanceRate = Math.round((presentCount / DEMO_STUDENTS.length) * 100);

    return (
        <DashboardLayout role="faculty" title="Faculty Dashboard">
            {/* Welcome */}
            <div className="mb-6 fade-in">
                <h1 className="text-2xl lg:text-3xl font-bold t-heading">
                    Good {greeting || getGreetingTime()},{" "}
                    <span className="gradient-text">{userProfile?.name?.split(" ").slice(-1)[0] || "Professor"} 👩‍🏫</span>
                </h1>
                <p className="t-muted mt-1 text-sm">
                    {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8 fade-in">
                <Link href="/faculty/attendance">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">My Classes Today</span>
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-blue-400 my-1">{myClasses.length}</p>
                        <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate hover:text-blue-400 transition-colors">Take attendance ›</p>
                    </div>
                </Link>

                <div className="stat-card h-full">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs t-muted uppercase tracking-wider font-semibold">Today&apos;s Attend.</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-bold text-emerald-400 my-1">{attendanceRate}%</p>
                    <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate">{presentCount}/{DEMO_STUDENTS.length} present</p>
                </div>

                <Link href="/faculty/students">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">Total Students</span>
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-purple-400 my-1">{DEMO_STUDENTS.length}</p>
                        <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate">CS-4A division</p>
                    </div>
                </Link>

                <Link href="/faculty/notices">
                    <div className="stat-card h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs t-muted uppercase tracking-wider font-semibold">Notices Posted</span>
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-amber-400" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-amber-400 my-1">{DEMO_NOTICES.length}</p>
                        <p className="text-xs t-muted mt-auto pt-2 border-t theme-divider truncate hover:text-amber-400 transition-colors">Post new ›</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8 items-stretch">
                {/* Today's classes */}
                <div className="glass-card p-6 fade-in flex flex-col h-full hidden-scrollbar">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="t-heading font-semibold text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            My Classes — {today}
                        </h3>
                        <Link href="/faculty/timetable" className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300">
                            Full timetable <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {myClasses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                                <Calendar className="w-10 h-10 text-slate-400 mb-3" />
                                <p className="t-muted font-medium">No classes assigned today</p>
                            </div>
                        ) : (
                            myClasses.map((cls, i) => (
                                <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] transition-colors border border-[var(--border-item)]">
                                    <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500 flex-shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="t-heading text-sm font-semibold truncate">{cls.subject}</p>
                                        <p className="t-muted text-xs mt-0.5 flex items-center gap-2">
                                            <span>{cls.time} – {cls.end}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                            <span>Room {cls.room}</span>
                                        </p>
                                    </div>
                                    <Link href="/faculty/attendance">
                                        <span className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-400 font-medium border border-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors">
                                            Mark
                                        </span>
                                    </Link>
                                </div>
                            ))
                        )}
                        {todayClasses.filter(c => c.faculty !== (userProfile?.name || "Dr. Priya Mehta")).slice(0, 2).map((cls, i) => (
                            <div key={`other-${i}`} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[var(--bg-item)] opacity-60">
                                <div className="w-1.5 h-10 rounded-full bg-slate-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="t-muted text-sm font-medium truncate">{cls.subject}</p>
                                    <p className="t-faint text-xs mt-0.5 flex items-center gap-2">
                                        <span>{cls.time} – {cls.end}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                        <span className="truncate">{cls.faculty}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick attendance summary */}
                <div className="glass-card p-6 fade-in flex flex-col h-full hidden-scrollbar mb-4 lg:mb-0">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="t-heading font-semibold text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-400" />
                            Attendance Today
                        </h3>
                        <Link href="/faculty/attendance" className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300">
                            Mark all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative w-24 h-24 flex-shrink-0 drop-shadow-lg">
                            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                                    strokeDasharray={`${attendanceRate || 0} ${100 - (attendanceRate || 0)}`} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center t-heading font-bold text-lg">{attendanceRate}%</span>
                        </div>
                        <div className="space-y-2 text-sm flex-1">
                            <p className="text-emerald-500 flex items-center gap-2 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {presentCount} Present
                            </p>
                            <p className="text-red-500 flex items-center gap-2 font-medium bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span> {DEMO_STUDENTS.length - presentCount} Absent
                            </p>
                            <p className="t-muted pl-4 text-xs mt-1">Total: {DEMO_STUDENTS.length} students</p>
                        </div>
                    </div>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                        {DEMO_STUDENTS.slice(0, 5).map(s => (
                            <div key={s.rollNumber} className="flex items-center gap-2 text-xs">
                                <span className={`w-1.5 h-1.5 rounded-full ${s.status === "present" ? "bg-emerald-400" : "bg-red-400"}`} />
                                <span className="t-muted font-mono">{s.rollNumber}</span>
                                <span className="t-heading">{s.name}</span>
                                <span className={`ml-auto ${s.status === "present" ? "text-emerald-500" : "text-red-500"}`}>
                                    {s.status === "present" ? "P" : "A"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4 items-stretch fade-in" style={{ animationDelay: "400ms" }}>
                {/* Weekly Analytics Chart */}
                <div className="glass-card p-6 lg:col-span-2 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="t-heading font-semibold text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Class Attendance Analytics
                        </h3>
                        <span className="text-xs bg-[var(--bg-item)] px-3 py-1 rounded-full t-muted font-medium border border-[var(--border-item)]">Current Week</span>
                    </div>
                    <div className="flex-1 min-h-[220px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { subject: 'Data Struct.', attendance: 85, fill: '#3b82f6' },
                                { subject: 'Algorithms', attendance: 92, fill: '#10b981' },
                                { subject: 'DBMS', attendance: 78, fill: '#f59e0b' },
                                { subject: 'Network', attendance: 88, fill: '#8b5cf6' },
                            ]} margin={{ top: 5, right: 0, bottom: 20, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="subject" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-item)', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    labelStyle={{ color: 'var(--text-muted)' }}
                                />
                                <Bar dataKey="attendance" radius={[6, 6, 0, 0]} barSize={40}>
                                    {
                                        // We map over the data to assign individual colors
                                        [
                                            { subject: 'Data Struct.', attendance: 85, fill: '#3b82f6' },
                                            { subject: 'Algorithms', attendance: 92, fill: '#10b981' },
                                            { subject: 'DBMS', attendance: 78, fill: '#f59e0b' },
                                            { subject: 'Network', attendance: 88, fill: '#8b5cf6' }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="glass-card p-6 flex flex-col">
                    <h3 className="t-heading font-semibold text-lg mb-5 flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        Quick Links
                    </h3>
                    <div className="flex flex-col gap-3 flex-1 justify-center">
                        {[
                            { href: "/faculty/attendance", label: "Mark Attendance", icon: "✅", glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/30" },
                            { href: "/faculty/results", label: "Upload Marks", icon: "🏆", glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/30" },
                            { href: "/faculty/notices", label: "Post Notice", icon: "📢", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/30" },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="group outline-none block w-full">
                                <div className={`flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-item)] border border-[var(--border-item)] transition-all duration-300 ${item.glow} hover:bg-[var(--bg-item-hover)]`}>
                                    <span className="text-xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{item.icon}</span>
                                    <span className="text-sm t-body font-medium">{item.label}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto t-muted group-hover:text-white transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
