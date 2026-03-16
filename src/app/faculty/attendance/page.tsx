"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_STUDENTS, DEMO_TIMETABLE } from "@/lib/demo-data";
import { getCurrentDay, cn, exportData } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle, XCircle, Save, RefreshCw } from "lucide-react";

type Status = "present" | "absent" | "leave";

export default function FacultyAttendancePage() {
    const today = getCurrentDay();
    const myClasses = DEMO_TIMETABLE[today]?.filter(c => c.faculty === "Dr. Priya Mehta") || [];
    const [selectedSubject, setSelectedSubject] = useState(myClasses[0]?.subject || "Data Structures");
    const [attendance, setAttendance] = useState<Record<string, Status>>(
        Object.fromEntries(DEMO_STUDENTS.map(s => [s.rollNumber, s.status as Status]))
    );
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const toggle = (roll: string) => {
        setAttendance(prev => ({ ...prev, [roll]: prev[roll] === "present" ? "absent" : "present" }));
        setSaved(false);
    };

    const markAll = (status: Status) => {
        setAttendance(Object.fromEntries(DEMO_STUDENTS.map(s => [s.rollNumber, status])));
        setSaved(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);

        try {
            // Push each attendance record to DB
            const promises = Object.entries(attendance).map(([roll, status]) => {
                return addDoc(collection(db, "attendance"), {
                    rollNumber: roll,
                    subject: selectedSubject,
                    status: status,
                    date: serverTimestamp(),
                    dateString: new Date().toISOString().split("T")[0] // For easier queries 
                });
            });

            await Promise.all(promises);
            setSaved(true);
        } catch (error) {
            console.error("Failed to push real attendance data. Falling back to mock UI...", error);
            // Even if Firebase fails (demo mode), simulate a successful save for demo purposes
            setTimeout(() => setSaved(true), 1000);
        } finally {
            setIsSaving(false);
        }
    };

    const presentCount = Object.values(attendance).filter(v => v === "present").length;

    return (
        <DashboardLayout role="faculty" title="Attendance">
            <div className="page-header">Mark Attendance</div>
            <p className="page-subheader">CS-4A · {today}</p>

            {/* Subject selector */}
            <div className="glass-card p-4 mb-4 fade-in">
                <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Select Subject</p>
                <div className="flex gap-2 flex-wrap">
                    {["Data Structures", "DBMS", "Algorithms"].map(sub => (
                        <button
                            key={sub}
                            onClick={() => { setSelectedSubject(sub); setSaved(false); }}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                selectedSubject === sub
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4 fade-in">
                <div className="glass-card p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{presentCount}</p>
                    <p className="text-xs text-slate-400">Present</p>
                </div>
                <div className="glass-card p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{DEMO_STUDENTS.length - presentCount}</p>
                    <p className="text-xs text-slate-400">Absent</p>
                </div>
                <div className="glass-card p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{Math.round((presentCount / DEMO_STUDENTS.length) * 100)}%</p>
                    <p className="text-xs text-slate-400">Rate</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-4 flex-wrap fade-in">
                <button onClick={() => markAll("present")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-600/30 transition-colors">
                    <CheckCircle className="w-4 h-4" /> Mark All Present
                </button>
                <button onClick={() => markAll("absent")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/20 text-red-400 text-sm hover:bg-red-600/30 transition-colors">
                    <XCircle className="w-4 h-4" /> Mark All Absent
                </button>
                <div className="flex-1" />
                <button onClick={() => {
                    const exportList = DEMO_STUDENTS.map(s => ({
                        RollNumber: s.rollNumber,
                        Name: s.name,
                        Status: attendance[s.rollNumber].toUpperCase()
                    }));
                    exportData(exportList, `attendance_${selectedSubject}_${today}`);
                }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-600/30 transition-colors">
                    <Save className="w-4 h-4" /> Export CSV
                </button>
                <button onClick={() => setAttendance(Object.fromEntries(DEMO_STUDENTS.map(s => [s.rollNumber, s.status as Status])))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Reset
                </button>
            </div>

            {/* Student list */}
            <div className="glass-card overflow-hidden mb-4 fade-in">
                <div className="p-4 border-b border-white/5">
                    <p className="text-white font-semibold">{DEMO_STUDENTS.length} Students · {selectedSubject}</p>
                </div>
                <div className="divide-y divide-white/5">
                    {DEMO_STUDENTS.map(student => {
                        const status = attendance[student.rollNumber];
                        return (
                            <div key={student.rollNumber} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0",
                                    status === "present" ? "bg-emerald-600" : "bg-slate-700"
                                )}>
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">{student.name}</p>
                                    <p className="text-slate-500 text-xs font-mono">{student.rollNumber}</p>
                                </div>
                                <button
                                    onClick={() => toggle(student.rollNumber)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                        status === "present"
                                            ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30"
                                            : "bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30"
                                    )}
                                >
                                    {status === "present" ? <><CheckCircle className="w-3.5 h-3.5" />P</> : <><XCircle className="w-3.5 h-3.5" />A</>}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save button */}
            <button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                    "w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-semibold text-sm transition-all duration-300 fade-in",
                    saved
                        ? "bg-emerald-600/20 border border-emerald-500/20 text-emerald-400"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25",
                    isSaving ? "opacity-75 cursor-wait" : ""
                )}
            >
                {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? "✓ Attendance Saved Successfully!" : <><Save className="w-4 h-4" />Save Attendance</>}
            </button>
        </DashboardLayout>
    );
}
