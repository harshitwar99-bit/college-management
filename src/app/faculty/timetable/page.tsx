"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_TIMETABLE } from "@/lib/demo-data";
import { DAYS, cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";

export default function FacultyTimetablePage() {
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [timetable, setTimetable] = useState<any>(DEMO_TIMETABLE);

    const allClasses = timetable[selectedDay] || [];

    const handleBulkUpload = (data: any[]) => {
        const newClasses = data.map(row => ({
            time: row.time || row.Time || "09:00",
            end: row.end || row.End || "10:00",
            subject: row.subject || row.Subject || "Unknown",
            faculty: "Dr. Priya Mehta", // Default to self for faculty view
            room: row.room || row.Room || "TBD"
        }));

        setTimetable({
            ...timetable,
            [selectedDay]: [...newClasses, ...(timetable[selectedDay] || [])]
        });
    };

    return (
        <DashboardLayout role="faculty" title="Timetable">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleBulkUpload}
                title={`Upload Schedule for ${selectedDay}`}
                description={`Upload a CSV or Excel file to add classes to your ${selectedDay} timetable.`}
                sampleData="Time,End,Subject,Room\n09:00,10:00,Data Structures,Room 101"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <div className="page-header mb-0">Timetable Overview</div>
                    <p className="page-subheader">CS-4A Division · All periods</p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
                >
                    <UploadCloud className="w-4 h-4" /> Import {selectedDay}s
                </button>
            </div>

            {/* Day selector */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-2 fade-in">
                {DAYS.map(day => (
                    <button key={day} onClick={() => setSelectedDay(day)}
                        className={cn(
                            "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            selectedDay === day
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        )}>
                        {day.slice(0, 3)}
                    </button>
                ))}
            </div>

            {/* Classes */}
            <div className="space-y-3 fade-in">
                {allClasses.length === 0 ? (
                    <div className="glass-card p-10 text-center">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="text-white font-semibold">No classes on {selectedDay}</p>
                    </div>
                ) : (
                    allClasses.map((cls: any, i: number) => {
                        const isMyClass = cls.faculty === "Dr. Priya Mehta";
                        return (
                            <div key={i} className={cn(
                                "rounded-2xl p-4 flex items-center gap-4 border transition-all",
                                isMyClass
                                    ? "bg-purple-600/15 border-purple-500/30"
                                    : "glass-card opacity-60"
                            )}>
                                <div className="text-center min-w-[52px]">
                                    <p className={`text-xs font-semibold ${isMyClass ? "text-purple-300" : "text-slate-400"}`}>{cls.time}</p>
                                    <div className="w-0.5 h-4 bg-current opacity-20 mx-auto my-1" />
                                    <p className={`text-xs ${isMyClass ? "text-purple-400 opacity-70" : "text-slate-500"}`}>{cls.end}</p>
                                </div>
                                <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${isMyClass ? "bg-purple-400 opacity-30" : "bg-slate-600"}`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-white font-semibold text-sm">{cls.subject}</p>
                                        {isMyClass && <span className="text-xs bg-purple-600/40 text-purple-300 px-2 py-0.5 rounded-full">My Class</span>}
                                    </div>
                                    <p className={`text-xs ${isMyClass ? "text-purple-300 opacity-70" : "text-slate-500"}`}>{cls.faculty}</p>
                                    <p className="text-xs text-slate-500 mt-1">🏛️ Room {cls.room}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </DashboardLayout>
    );
}
