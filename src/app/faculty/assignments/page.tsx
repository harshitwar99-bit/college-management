"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_ASSIGNMENTS } from "@/lib/demo-data";
import { BookOpen, Plus, Search, Clock, UploadCloud } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";

export default function FacultyAssignmentsPage() {
    const [assignments, setAssignments] = useState(DEMO_ASSIGNMENTS);
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("Data Structures");
    const [date, setDate] = useState("");
    const [search, setSearch] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date) return;

        const newAssignment = {
            id: `a-${Date.now()}`,
            title,
            subject,
            dueDate: date,
            status: "pending",
            faculty: "Dr. Priya Mehta"
        };

        setAssignments(prev => [newAssignment, ...prev]);
        setTitle("");
        setDate("");
    };

    const handleBulkUpload = (data: any[]) => {
        const newAssignments = data.map((row, i) => ({
            id: `a-${Date.now()}-${i}`,
            title: row.title || row.Title || "Untitled Assignment",
            subject: row.subject || row.Subject || "Unknown",
            dueDate: row.dueDate || row.DueDate || row.Date || new Date().toISOString().split('T')[0],
            status: "pending",
            faculty: "Dr. Priya Mehta"
        }));
        setAssignments(prev => [...newAssignments, ...prev]);
    };

    const filtered = assignments.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout role="faculty" title="Assignments">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleBulkUpload}
                title="Upload Assignments"
                description="Upload a CSV or Excel file to batch create assignments."
                sampleData="Title,Subject,DueDate\nGraph Traversal,Data Structures,2026-04-15\nSQL Queries,DBMS,2026-04-18"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
                <div>
                    <div className="page-header mb-0">Assignment Management</div>
                    <p className="page-subheader">Create and track student assignments</p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
                >
                    <UploadCloud className="w-4 h-4" /> Import Assignments
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="glass-card p-5 sticky top-24">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-400" />
                            New Assignment
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Graph Traversal..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Subject</label>
                                <select value={subject} onChange={e => setSubject(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                                    <option value="Data Structures" className="bg-slate-900">Data Structures</option>
                                    <option value="Algorithms" className="bg-slate-900">Algorithms</option>
                                    <option value="DBMS" className="bg-slate-900">DBMS</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                            </div>
                            <button type="submit" className="w-full btn-primary py-2.5 text-sm">
                                Create Assignment
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filtered.length === 0 ? (
                            <div className="glass-card p-10 text-center">
                                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No assignments found</p>
                            </div>
                        ) : (
                            filtered.map(a => (
                                <div key={a.id} className="glass-card p-4 hover:border-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                                        <BookOpen className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-base truncate">{a.title}</p>
                                        <p className="text-slate-400 text-sm">{a.subject}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs">
                                            <span className="flex items-center gap-1 text-slate-500">
                                                <Clock className="w-3.5 h-3.5" /> Due {formatDate(a.dueDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                        <button className="flex-1 md:flex-none px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg border border-white/10 transition-colors">
                                            Edit
                                        </button>
                                        <button className="flex-1 md:flex-none px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium rounded-lg border border-blue-500/20 transition-colors">
                                            View Submissions
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
