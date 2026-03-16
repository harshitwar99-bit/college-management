"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Search, Calendar, MapPin, Clock, Upload } from "lucide-react";
import { DEMO_EXAMS } from "@/lib/demo-data";
import { useState } from "react";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";

export default function CoordinatorExamsPage() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [exams, setExams] = useState(DEMO_EXAMS);

    const handleBulkUpload = (data: any[]) => {
        const newExams = data.map((row, i) => ({
            id: String(Date.now() + i),
            subject: row.subject || row.Subject || "Unknown Subject",
            date: row.date || row.Date || new Date().toISOString().split('T')[0],
            time: row.time || row.Time || "00:00 - 00:00",
            duration: row.duration || row.Duration || "2 Hours",
            type: row.type || row.Type || "Mid-Term",
            status: "Scheduled"
        }));
        setExams([...newExams, ...exams]);
    };

    return (
        <DashboardLayout role="coordinator" title="Exam Coordination">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleBulkUpload}
                title="Upload Exam Datesheet"
                description="Upload a CSV or Excel file containing the exam schedule."
                sampleData="Subject,Date,Time,Duration,Type\nData Structures,2026-04-15,10:00 - 13:00,3 Hours,Final\nComputer Networks,2026-04-18,10:00 - 12:00,2 Hours,Mid-Term"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Exam Schedules</h1>
                    <p className="text-slate-400 text-sm">Manage examination dates and invigilation duties.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
                    >
                        <Upload className="w-4 h-4" /> Import Datesheet
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Schedule New Exam
                    </button>
                </div>
            </div>

            <div className="glass-card p-6 fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Upcoming Examinations</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search exams..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-full sm:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map((exam) => (
                        <div key={exam.id} className="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1 text-sm bg-blue-500/10 text-blue-400 w-fit px-2.5 py-1 rounded-full border border-blue-500/20 font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">{exam.subject}</h3>
                                </div>
                                <span className="bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10">
                                    {exam.type}
                                </span>
                            </div>

                            <div className="space-y-2 mt-4 pt-4 border-t border-white/10 text-sm text-slate-400">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{exam.time}</span>
                                    </div>
                                    <span className="font-medium text-slate-500">{exam.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Main Block Halls</span>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                                    Assign Duty
                                </button>
                                <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
