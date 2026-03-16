"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Pin, Send, X } from "lucide-react";
import { DEMO_NOTICES } from "@/lib/demo-data";

export default function ManageNoticesPage() {
    const [notices, setNotices] = useState(DEMO_NOTICES);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [type, setType] = useState("general");

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !body) return;

        if (editingId) {
            setNotices(prev => prev.map(n => n.id === editingId ? { ...n, title, body, type } : n));
        } else {
            const newNotice = {
                id: `notice-${Date.now()}`,
                title,
                body,
                type,
                author: "Coordinator",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            setNotices(prev => [newNotice, ...prev]);
        }

        setShowForm(false);
        setEditingId(null);
        setTitle("");
        setBody("");
        setType("general");
    };

    const handleEdit = (notice: { id: string, title: string, body: string, type: string, author: string, date: string }) => {
        setTitle(notice.title);
        setBody(notice.body);
        setType(notice.type);
        setEditingId(notice.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        setNotices(prev => prev.filter(n => n.id !== id));
    };

    return (
        <DashboardLayout role="coordinator" title="Manage Notices">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Campus Notices</h1>
                    <p className="text-slate-400 text-sm">Publish and manage announcements for students and faculty.</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            setEditingId(null);
                            setTitle("");
                            setBody("");
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className={`flex items-center gap-2 btn-primary !px-4 ${showForm ? "!from-slate-700 !to-slate-600 !shadow-none" : ""}`}
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? "Cancel" : "Publish New Notice"}
                </button>
            </div>

            {showForm && (
                <div className="glass-card p-5 mb-8 fade-in">
                    <h3 className="text-white font-semibold mb-4">{editingId ? "Edit Notice" : "New Notice"}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Title</label>
                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="Notice title..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Category</label>
                                <select value={type} onChange={e => setType(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                                    <option value="general" className="bg-slate-900">General</option>
                                    <option value="exam" className="bg-slate-900">Exam</option>
                                    <option value="assignment" className="bg-slate-900">Assignment</option>
                                    <option value="event" className="bg-slate-900">Event</option>
                                    <option value="holiday" className="bg-slate-900">Holiday</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Content</label>
                            <textarea required value={body} onChange={e => setBody(e.target.value)}
                                placeholder="Notice content..." rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none" />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="submit" className="btn-primary flex items-center gap-2 py-2 px-6">
                                <Send className="w-4 h-4" /> {editingId ? "Save Changes" : "Publish"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 fade-in" style={{ animationDelay: "100ms" }}>
                {notices.map((notice, i) => (
                    <div key={notice.id} className="glass-card p-5 group transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 border-l-4" style={{
                        borderLeftColor:
                            notice.type === 'exam' ? '#ef4444' :
                                notice.type === 'assignment' ? '#f59e0b' :
                                    notice.type === 'event' ? '#8b5cf6' :
                                        '#3b82f6'
                    }}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        {i === 0 && <Pin className="w-4 h-4 text-blue-400" />}
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{notice.title}</h3>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${notice.type === 'exam' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        notice.type === 'assignment' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            notice.type === 'event' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        }`}>
                                        {notice.type}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{notice.body}</p>

                                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-2">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        <span>Published: {notice.date}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                    <span>By: {notice.author}</span>
                                </div>
                            </div>

                            <div className="flex sm:flex-col gap-2 justify-end sm:opacity-0 group-hover:opacity-100 transition-opacity mt-4 sm:mt-0">
                                <button onClick={() => handleEdit(notice)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors border border-transparent hover:border-emerald-500/20" title="Edit">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(notice.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
