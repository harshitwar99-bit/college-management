"use client";

import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, BookOpen, AlertCircle, FileText, Zap } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CoordinatorDashboard() {
    const { userProfile } = useAuth();

    const stats = [
        { title: "Total Students", value: "1,245", trend: "+12", trendUp: true, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
        { title: "Active Faculty", value: "84", trend: "+2", trendUp: true, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
        { title: "Upcoming Exams", value: "6", trend: "Next Week", trendUp: true, icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
        { title: "Pending Requests", value: "15", trend: "Urgent", trendUp: false, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
    ];

    return (
        <DashboardLayout role="coordinator" title="Overview">
            {/* Greeting */}
            <div className="mb-8 fade-in">
                <h1 className="text-3xl font-bold t-heading mb-2">Welcome, {
                    (() => {
                        const name = userProfile?.name || "";
                        const honorifics = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
                        const parts = name.split(" ");
                        const withoutHonorific = honorifics.includes(parts[0]) ? parts.slice(1).join(" ") : name;
                        return withoutHonorific || name;
                    })()
                }! 👋</h1>
                <p className="t-muted">Here&apos;s the institution overview for today.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-2xl font-bold t-heading mb-1">{stat.value}</p>
                        <p className="text-sm font-medium t-muted">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Analytics Chart */}
                <div className="glass-card p-6 fade-in lg:col-span-2" style={{ animationDelay: "300ms" }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold t-heading">Attendance Trends (Last 7 Days)</h2>
                        <select className="bg-[var(--bg-item)] border border-[var(--border-item)] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                            <option>All Departments</option>
                            <option>Computer Science</option>
                            <option>Business Admin</option>
                        </select>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { name: 'Mon', attendance: 82 },
                                { name: 'Tue', attendance: 85 },
                                { name: 'Wed', attendance: 81 },
                                { name: 'Thu', attendance: 89 },
                                { name: 'Fri', attendance: 86 },
                                { name: 'Sat', attendance: 75 },
                                { name: 'Sun', attendance: 0 },
                            ]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'var(--text-muted)' }}
                                />
                                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="glass-card p-6 fade-in lg:col-span-1 flex flex-col" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold t-heading">Recent Logs</h2>
                        <button className="text-emerald-500 text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {[
                            { title: "Exam Schedule Published", time: "2 hours ago", type: "exam" },
                            { title: "New Faculty Onboarded: Dr. Smith", time: "5 hours ago", type: "faculty" },
                            { title: "System Maintenance Completed", time: "1 day ago", type: "system" },
                            { title: "Leave Approved for Prof. Kumar", time: "1 day ago", type: "leave" },
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] transition-colors border border-[var(--border-item)]">
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-item-hover)] flex items-center justify-center flex-shrink-0 t-muted">
                                    {activity.type === 'exam' ? '📝' : activity.type === 'faculty' ? '👥' : activity.type === 'leave' ? '✅' : '⚙️'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium t-heading">{activity.title}</p>
                                    <p className="text-xs t-muted mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 fade-in mt-6 lg:mt-0" style={{ animationDelay: "500ms" }}>
                <h2 className="text-lg font-bold t-heading mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Quick Actions
                </h2>
                <div className="flex overflow-x-auto gap-3 lg:gap-4 pb-2 hidden-scrollbar snap-x">
                    {[
                        { href: "/coordinator/users", label: "Manage Users", icon: "👥", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-blue-500/30" },
                        { href: "/coordinator/notices", label: "Publish Notice", icon: "📢", glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:border-amber-500/30" },
                        { href: "/coordinator/leaves", label: "Approve Leaves", icon: "✅", glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/30" },
                        { href: "/coordinator/exams", label: "Schedule Exam", icon: "📝", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:border-purple-500/30" },
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
