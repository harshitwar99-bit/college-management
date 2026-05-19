"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { formatDate, getDaysUntil } from "@/lib/utils";
import { Plus, MapPin, Calendar, Clock } from "lucide-react";
import { DEMO_EXAMS, DEMO_SEATING } from "@/lib/demo-data";

export default function FacultyExamsPage() {
    const { userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<"schedule" | "seating">("schedule");
    const [showForm, setShowForm] = useState(false);
    
    const [exams, setExams] = useState<any[]>(DEMO_EXAMS);
    
    // Form states
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [hall, setHall] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (!userProfile?.id) return;
        const fetchExams = async () => {
            try {
                const res = await fetch(`/api/exams?firebaseId=${userProfile.id}`);
                const json = await res.json();
                if (json.success && json.data.length > 0) {
                    setExams(json.data.map((ex: any) => ({
                        id: ex.id,
                        subject: ex.subject?.name || "Unknown Subject",
                        date: ex.date,
                        time: ex.time,
                        duration: ex.duration,
                        type: ex.type
                    })));
                }
                // else keep DEMO_EXAMS
            } catch (err) {
                console.error(err);
            }
        };
        fetchExams();
    }, [userProfile?.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile?.id || !subject || !date || !time) return;

        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseId: userProfile.id,
                    subjectId: subject, // backend handles name lookup
                    date,
                    time,
                    duration,
                    type
                })
            });
            const json = await res.json();
            if (json.success) {
                const newEx = json.data;
                setExams(prev => [...prev, {
                    id: newEx.id,
                    subject: newEx.subject?.name || subject,
                    date: newEx.date,
                    time: newEx.time,
                    duration: newEx.duration,
                    type: newEx.type
                }].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                
                setShowForm(false);
                setSubject(""); setDate(""); setTime("");
                setDuration(""); setHall(""); setType("");
            } else {
                alert(json.error || "Failed to create exam");
            }
        } catch (error) {
            console.error("Save exam error", error);
        }
    };

    return (
        <DashboardLayout role="faculty" title="Exams">
            <div className="page-header">Exam Management</div>
            <p className="page-subheader">Manage exam schedules and seating arrangements</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 fade-in">
                {[{ key: "schedule", label: "📅 Exam Schedule" }, { key: "seating", label: "🗺️ Seating Plan" }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key as "schedule" | "seating")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                                : "bg-white/5 text-slate-400 hover:text-white"
                            }`}>
                        {tab.label}
                    </button>
                ))}
                <button onClick={() => setShowForm(!showForm)}
                    className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-600/30 transition-colors">
                    <Plus className="w-4 h-4" /> Add Exam
                </button>
            </div>

            {/* Add exam form */}
            {showForm && (
                <form onSubmit={handleSave} className="glass-card p-5 mb-5 fade-in border-emerald-500/20">
                    <h3 className="text-white font-semibold mb-4">New Exam Entry</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Subject Name</label>
                            <select value={subject} onChange={e => setSubject(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                                <option value="" disabled className="bg-slate-900">Select Subject</option>
                                {(userProfile?.subjects && userProfile.subjects.length > 0 ? userProfile.subjects : ["Data Structures", "DBMS", "Algorithms", "Computer Networks"]).map((sub: string) => (
                                    <option key={sub} value={sub} className="bg-slate-900">{sub}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Time</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Duration</label>
                            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3 Hours" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Hall</label>
                            <input type="text" value={hall} onChange={e => setHall(e.target.value)} placeholder="e.g. Hall A" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Type</label>
                            <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder="Mid-Semester / End-Semester" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn-primary text-sm px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25">
                            Save Exam
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {activeTab === "schedule" ? (
                <div className="space-y-3 fade-in">
                    {exams.map(exam => {
                        const days = getDaysUntil(exam.date);
                        return (
                            <div key={exam.id} className="glass-card p-4 flex items-center gap-4 hover:border-white/20 transition-all">
                                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-white
                  ${days < 0 ? "bg-slate-700" : days <= 3 ? "bg-red-700" : "bg-purple-700"}`}>
                                    <span className="text-xs font-medium">{new Date(exam.date).toLocaleDateString("en-IN", { month: "short" })}</span>
                                    <span className="text-xl font-bold leading-none">{new Date(exam.date).getDate()}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold">{exam.subject}</p>
                                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.time}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{exam.duration}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exam.type}</span>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${days < 0 ? "text-slate-500" : days <= 3 ? "text-red-400" : "text-purple-400"}`}>
                                    {days < 0 ? "Done" : `${days}d`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card overflow-hidden fade-in">
                    <div className="p-4 border-b border-white/5"><p className="text-white font-semibold">Seating Assignments — BCA-4A</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    {["Subject", "Date", "Hall", "Row", "Seat", "Roll No."].map(h => (
                                        <th key={h} className="text-left text-slate-400 text-xs font-medium px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {DEMO_SEATING.map(s => (
                                    <tr key={s.examId} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{s.subject}</td>
                                        <td className="px-4 py-3 text-slate-400">{new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                        <td className="px-4 py-3 text-slate-400">{s.hall}</td>
                                        <td className="px-4 py-3 text-slate-400">{s.row}</td>
                                        <td className="px-4 py-3 font-mono text-blue-400 font-semibold">{s.seat}</td>
                                        <td className="px-4 py-3 font-mono text-slate-300">{s.rollNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
