"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_STUDENTS, DEMO_ATTENDANCE } from "@/lib/demo-data";
import { getAttendanceColor, exportData } from "@/lib/utils";
import { Search, UploadCloud } from "lucide-react";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";

export default function FacultyStudentsPage() {
    const [q, setQ] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [students, setStudents] = useState<any[]>(DEMO_STUDENTS);

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(q.toLowerCase())
    );

    const handleBulkUpload = (data: any[]) => {
        const newStudents = data.map(row => ({
            name: row.name || row.Name || "Unknown",
            rollNumber: row.rollNumber || row.RollNumber || `22BCS${Math.floor(Math.random() * 1000)}`,
            status: "present"
        }));
        setStudents([...newStudents, ...students]);
    };

    return (
        <DashboardLayout role="faculty" title="Students">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleBulkUpload}
                title="Upload Class List"
                description="Upload a CSV or Excel file containing the student roster for this class."
                sampleData="Name,RollNumber\nJohn Doe,22BCS001\nJane Smith,22BCS002"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 fade-in">
                <div>
                    <div className="page-header mb-0">Students</div>
                    <p className="page-subheader">CS-4A · {students.length} enrolled students</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => exportData(students, "class_roster_cs4a")}
                        className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all h-fit"
                    >
                        <UploadCloud className="w-4 h-4 rotate-180" /> Export Class List
                    </button>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all h-fit"
                    >
                        <UploadCloud className="w-4 h-4" /> Import Class List
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-5 fade-in">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    value={q} onChange={e => setQ(e.target.value)}
                    placeholder="Search by name or roll number..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
            </div>

            {/* Students grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in">
                {filtered.map((student, i) => {
                    const att = DEMO_ATTENDANCE[i % DEMO_ATTENDANCE.length];
                    return (
                        <div key={student.rollNumber} className="glass-card p-4 flex items-center gap-3 hover:border-white/20 transition-all">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0
                ${student.status === "present" ? "bg-gradient-to-br from-blue-600 to-cyan-600" : "bg-slate-700"}`}>
                                {student.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{student.name}</p>
                                <p className="text-slate-500 text-xs font-mono">{student.rollNumber}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className={`text-sm font-bold ${getAttendanceColor(att.percent)}`}>{att.percent}%</p>
                                <p className="text-slate-600 text-xs">Attendance</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${student.status === "present" ? "bg-emerald-400" : "bg-red-400"}`} />
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-span-2 glass-card p-8 text-center">
                        <p className="text-slate-500">No students found for &quot;{q}&quot;</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
