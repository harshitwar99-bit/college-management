"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getDemoData } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { MapPin, Hash, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SeatingPlanPage() {
    const { userProfile } = useAuth();
    const [seating, setSeating] = useState(getDemoData(undefined).seating);
    const [selected, setSelected] = useState(seating[0]);

    // Re-sync when branch loads from async auth
    useEffect(() => {
        const s = getDemoData(userProfile?.branch).seating;
        setSeating(s);
        setSelected(s[0]);
    }, [userProfile?.branch]);

    return (
        <DashboardLayout role="student" title="Seating Plan">
            <div className="page-header">Exam Seating Plan</div>
            <p className="page-subheader">Your assigned hall and seat for each examination</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Exam list */}
                <div className="lg:col-span-1 space-y-2 fade-in">
                    {seating.map((seat) => (
                        <button
                            key={seat.examId}
                            onClick={() => setSelected(seat)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${selected.examId === seat.examId
                                    ? "bg-blue-600/20 border-blue-500/30 text-blue-300"
                                    : "glass-card hover:border-white/20"
                                }`}
                        >
                            <p className="text-white text-sm font-medium">{seat.subject}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{formatDate(seat.date)}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                <span>{seat.hall}</span>
                                <span>·</span>
                                <span>Row {seat.row} · Seat {seat.seat}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Seat detail card */}
                <div className="lg:col-span-2 fade-in">
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{selected.subject}</h3>
                                <p className="text-slate-400 text-sm">{formatDate(selected.date)}</p>
                            </div>
                        </div>

                        {/* Hall visual */}
                        <div className="bg-white/3 rounded-2xl p-8 mb-6 relative">
                            {/* Blackboard */}
                            <div className="w-full h-8 bg-slate-700 rounded-lg mb-8 flex items-center justify-center">
                                <span className="text-slate-400 text-xs">📋 Blackboard / Front</span>
                            </div>

                            {/* Seat grid visual */}
                            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                                {["A", "B", "C", "D", "E"].map(row =>
                                    [1, 2, 3, 4, 5, 6].map(seatNum => {
                                        const isYours = row === selected.row && String(seatNum).padStart(2, "0") === selected.seat;
                                        return (
                                            <div
                                                key={`${row}${seatNum}`}
                                                className={`h-7 rounded-md flex items-center justify-center text-xs font-mono transition-all ${isYours
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-110 z-10"
                                                        : "bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                                                    }`}
                                            >
                                                {isYours ? "YOU" : `${row}${seatNum}`}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <p className="text-center text-slate-600 text-xs">* Simplified seat grid for illustration</p>
                        </div>

                        {/* Your seat info */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <Building2 className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs mb-1">Exam Hall</p>
                                <p className="text-white font-bold">{selected.hall}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <span className="text-blue-400 text-xl font-bold block mb-1">{selected.row}</span>
                                <p className="text-slate-400 text-xs mb-1">Row</p>
                                <p className="text-white font-bold">Row {selected.row}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <Hash className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs mb-1">Seat No.</p>
                                <p className="text-white font-bold">{selected.seat}</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <p className="text-emerald-400 text-sm font-medium">
                                🎫 Roll Number: <span className="font-bold">{selected.rollNumber}</span>
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">Carry your Hall Ticket and College ID</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
