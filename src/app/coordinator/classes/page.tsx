"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Filter, Clock, MapPin, Users, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";

export default function CoordinatorClassesPage() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [classes, setClasses] = useState([
        { time: "09:00 - 11:00", subject: "DBMS Lab", faculty: "Dr. Priya Mehta", room: "Lab-3", type: "Lab", status: "Ongoing" },
        { time: "11:15 - 12:15", subject: "Computer Networks", faculty: "Prof. Anita Desai", room: "Room 104", type: "Lecture", status: "Upcoming" },
        { time: "13:15 - 14:15", subject: "Software Engineering", faculty: "Prof. Kavita Nair", room: "Room 101", type: "Lecture", status: "Upcoming" },
        { time: "14:15 - 15:15", subject: "Algorithms", faculty: "Prof. Rajan Kumar", room: "Room 102", type: "Lecture", status: "Upcoming" },
    ]);

    const handleBulkUpload = (data: any[]) => {
        const newClasses = data.map(row => ({
            time: row.time || row.Time || "00:00 - 00:00",
            subject: row.subject || row.Subject || "Unknown",
            faculty: row.faculty || row.Faculty || "Unknown",
            room: row.room || row.Room || "Unknown",
            type: row.type || row.Type || "Lecture",
            status: "Upcoming"
        }));
        setClasses([...newClasses, ...classes]);
    };

    return (
        <DashboardLayout role="coordinator" title="Classes & Timetables">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleBulkUpload}
                title="Upload Class Schedules"
                description="Upload a CSV or Excel file containing the class schedules."
                sampleData="Time,Subject,Faculty,Room,Type\n09:00 - 10:00,Physics,Dr. Sharma,Room 101,Lecture\n10:15 - 12:15,Chemistry Lab,Prof. Raj,Lab 2,Lab"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Class Schedules</h1>
                    <p className="text-slate-400 text-sm">Review timetables and allocate lecture halls.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
                    >
                        <Upload className="w-4 h-4" /> Import Schedule
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Schedule
                    </button>
                </div>
            </div>

            <div className="glass-card p-6 mb-8 fade-in" style={{ animationDelay: "100ms" }}>
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Today&apos;s Active Classes</h2>
                    <div className="flex gap-2">
                        <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50">
                            <option>All Departments</option>
                            <option>Computer Science</option>
                            <option>Electronics</option>
                            <option>Mechanical</option>
                        </select>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[
                        { time: "09:00 - 11:00", subject: "DBMS Lab", faculty: "Dr. Priya Mehta", room: "Lab-3", type: "Lab", status: "Ongoing" },
                        { time: "11:15 - 12:15", subject: "Computer Networks", faculty: "Prof. Anita Desai", room: "Room 104", type: "Lecture", status: "Upcoming" },
                        { time: "13:15 - 14:15", subject: "Software Engineering", faculty: "Prof. Kavita Nair", room: "Room 101", type: "Lecture", status: "Upcoming" },
                        { time: "14:15 - 15:15", subject: "Algorithms", faculty: "Prof. Rajan Kumar", room: "Room 102", type: "Lecture", status: "Upcoming" },
                    ].map((cls, i) => (
                        <div key={i} className={`p-5 rounded-2xl border transition-all duration-300 ${cls.status === 'Ongoing' ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className={`w-4 h-4 ${cls.status === 'Ongoing' ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
                                        <span className={`text-sm font-bold ${cls.status === 'Ongoing' ? 'text-blue-400' : 'text-slate-300'}`}>{cls.time}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{cls.subject}</h3>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cls.type === 'Lab' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {cls.type}
                                </span>
                            </div>

                            <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Users className="w-4 h-4" />
                                    <span>{cls.faculty}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <MapPin className="w-4 h-4" />
                                    <span>{cls.room}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
