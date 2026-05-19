"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { useTimetable } from "@/lib/useTimetable";
import { getCurrentDay, formatTime, cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function TodaySchedulePage() {
    const { userProfile } = useAuth();
    const [now, setNow] = useState(new Date());
    const today = getCurrentDay();
    const { timetable } = useTimetable(userProfile?.branch);
    const classes = (timetable[today] || []).sort((a, b) => {
        const ta = parseInt(a.time.replace(":", ""), 10);
        const tb = parseInt(b.time.replace(":", ""), 10);
        return ta - tb;
    });

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getStatus = (startTime: string, endTime: string) => {
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        if (nowMins < startMins) return "upcoming";
        if (nowMins >= startMins && nowMins < endMins) return "ongoing";
        return "done";
    };

    const getCountdown = (startTime: string) => {
        const [h, m] = startTime.split(":").map(Number);
        const startMins = h * 60 + m;
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const diff = startMins - nowMins;
        if (diff <= 0) return null;
        const hrs = Math.floor(diff / 60);
        const mins = diff % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
    };

    const getTimeLeft = (endTime: string) => {
        const [h, m] = endTime.split(":").map(Number);
        const endMins = h * 60 + m;
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const diff = endMins - nowMins;
        const hrs = Math.floor(diff / 60);
        const mins = diff % 60;
        return hrs > 0 ? `${hrs}h ${mins}m left` : `${mins} min left`;
    };

    // Demo-friendly: if all classes are "done" (e.g., opened in the evening),
    // show a preview mode that treats the schedule as upcoming
    const allDone = classes.length > 0 && classes.every(c => getStatus(c.time, c.end) === "done");
    const [previewMode, setPreviewMode] = useState(false);

    const resolveStatus = (startTime: string, endTime: string) => {
        if (previewMode) return "upcoming";
        return getStatus(startTime, endTime);
    };

    return (
        <DashboardLayout role="student" title="Today's Schedule">
            <div className="page-header">Today&apos;s Schedule</div>
            <p className="page-subheader">{today} · {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>

            {/* Live clock */}
            <div className="glass-card p-4 mb-6 flex items-center gap-4 fade-in">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">🕐</span>
                </div>
                <div>
                    <p className="text-white text-2xl font-bold tabular-nums">
                        {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-slate-400 text-xs">{now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-white font-semibold">{classes.length} Classes</p>
                    <p className="text-slate-400 text-xs">Scheduled today</p>
                </div>
            </div>

            {/* Demo-mode banner when all classes are over */}
            {allDone && !previewMode && (
                <div className="mb-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between gap-3 fade-in">
                    <div className="flex items-center gap-2 text-amber-400 text-sm">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        All classes for today have ended. Viewing completed schedule.
                    </div>
                    <button
                        onClick={() => setPreviewMode(true)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-colors flex-shrink-0"
                    >
                        Preview as Upcoming
                    </button>
                </div>
            )}
            {previewMode && (
                <div className="mb-4 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between gap-3 fade-in">
                    <span className="text-blue-400 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        Preview mode — showing schedule as if classes are upcoming
                    </span>
                    <button
                        onClick={() => setPreviewMode(false)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                    >
                        Exit Preview
                    </button>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-3 fade-in">
                {classes.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                        <p className="text-4xl mb-3">🏖️</p>
                        <p className="text-white font-semibold">No classes today!</p>
                        <p className="text-slate-400 text-sm mt-1">Enjoy your day off. Check the timetable for the rest of the week.</p>
                    </div>
                ) : (
                    classes.map((cls, i) => {
                        const status = resolveStatus(cls.time, cls.end);
                        const countdown = previewMode ? null : getCountdown(cls.time);
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "border rounded-2xl p-4 transition-all duration-300 fade-in relative overflow-hidden",
                                    status === "ongoing"
                                        ? "bg-blue-600/15 border-blue-500/30"
                                        : status === "done"
                                            ? "bg-white/2 border-white/5 opacity-55"
                                            : "glass-card"
                                )}
                            >
                                {status === "ongoing" && (
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
                                )}
                                <div className="flex items-start gap-4">
                                    {/* Status indicator */}
                                    <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full",
                                            status === "ongoing" ? "bg-blue-400 pulse-glow" :
                                                status === "done" ? "bg-slate-600" : "bg-slate-700 border-2 border-slate-500"
                                        )} />
                                        {i < classes.length - 1 && <div className="w-0.5 h-8 bg-white/5" />}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-white font-semibold text-sm">{cls.subject}</span>
                                                    {status === "ongoing" && (
                                                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">LIVE</span>
                                                    )}
                                                    {previewMode && (
                                                        <span className="text-xs bg-amber-600/30 text-amber-400 px-2 py-0.5 rounded-full font-medium">Preview</span>
                                                    )}
                                                </div>
                                                <p className="text-slate-500 text-xs">{cls.faculty}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-white text-xs font-medium">{formatTime(cls.time)}</p>
                                                <p className="text-slate-500 text-xs">{formatTime(cls.end)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-slate-500">🏛️ Room {cls.room}</span>
                                            {status === "ongoing" && (
                                                <span className="text-xs text-blue-400 font-medium">{getTimeLeft(cls.end)}</span>
                                            )}
                                            {status === "upcoming" && countdown && (
                                                <span className="text-xs text-amber-400">Starts in {countdown}</span>
                                            )}
                                            {status === "upcoming" && previewMode && (
                                                <span className="text-xs text-amber-400/70">Upcoming</span>
                                            )}
                                            {status === "done" && !previewMode && (
                                                <span className="text-xs text-slate-600">Completed ✓</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </DashboardLayout>
    );
}
