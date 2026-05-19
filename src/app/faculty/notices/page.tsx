"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_NOTICES } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Send, Trash2 } from "lucide-react";

export default function FacultyNoticesPage() {
    const { userProfile } = useAuth();
    const [notices, setNotices] = useState<typeof DEMO_NOTICES>(DEMO_NOTICES);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [type, setType] = useState("general");
    const [target, setTarget] = useState("all");
    const [submitted, setSubmitted] = useState(false);
    const [isUsingFallback, setIsUsingFallback] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!userProfile?.id) return;
        const fetchNotices = async () => {
            try {
                const res = await fetch(`/api/notices?firebaseId=${userProfile.id}`);
                const json = await res.json();
                if (json.success) {
                    const mapped = json.data.map((n: any) => ({
                        ...n,
                        type: n.type.toLowerCase()
                    }));
                    setNotices(mapped);
                    setIsUsingFallback(false);
                } else {
                    setNotices(DEMO_NOTICES);
                    setIsUsingFallback(true);
                }
            } catch (error) {
                console.error("Failed to fetch notices", error);
                setNotices(DEMO_NOTICES);
                setIsUsingFallback(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotices();
    }, [userProfile?.id]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !body || !userProfile?.id) return;

        try {
            if (editingId && !editingId.startsWith("mock-")) {
                const res = await fetch(`/api/notices/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firebaseId: userProfile.id, title, body, type, target })
                });
                const json = await res.json();
                if (json.success) {
                    setNotices(prev => prev.map(n => n.id === editingId ? { ...n, title, body, type, target } : n));
                }
            } else if (!editingId) {
                const res = await fetch('/api/notices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firebaseId: userProfile.id, title, body, type, target })
                });
                const json = await res.json();
                if (json.success) {
                    const mappedNew = { ...json.data, type: json.data.type?.toLowerCase() || 'general' };
                    setNotices(prev => [mappedNew, ...prev]);
                }
            } else if (editingId && editingId.startsWith("mock-") && isUsingFallback) {
                setNotices(prev => prev.map(n => n.id === editingId ? { ...n, title, body, type, target } : n));
            }

            setSubmitted(true);
            setTimeout(() => { setTitle(""); setBody(""); setEditingId(null); setSubmitted(false); }, 3000);
        } catch (error) {
            console.error("Failed to post notice to DB:", error);
            if (isUsingFallback) {
                if (editingId) {
                    setNotices(prev => prev.map(n => n.id === editingId ? { ...n, title, body, type, target } : n));
                } else {
                    const newNotice = { id: `mock-${Date.now()}`, title, body, type, target, author: userProfile.name, date: new Date().toISOString() };
                    setNotices(prev => [newNotice, ...prev]);
                }
                setSubmitted(true);
                setTimeout(() => { setTitle(""); setBody(""); setEditingId(null); setSubmitted(false); }, 3000);
            }
        }
    };

    const handleEdit = (notice: { id: string, title: string, body: string, type?: string, target?: string, author: string, date: string }) => {
        setTitle(notice.title);
        setBody(notice.body);
        setType(notice.type || "general");
        setTarget(notice.target || "all");
        setEditingId(notice.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        try {
            if (!id.startsWith("mock-") && userProfile?.id) {
                await fetch(`/api/notices/${id}?firebaseId=${userProfile.id}`, { method: 'DELETE' });
                setNotices(prev => prev.filter(n => n.id !== id));
            } else {
                setNotices(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete from DB:", error);
        }
    };

    return (
        <DashboardLayout role="faculty" title="Notices">
            <div className="page-header">Post Notices</div>
            <p className="page-subheader">Broadcast announcements to students</p>

            {/* Post form */}
            <div className="glass-card p-5 mb-6 fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold">
                        {editingId ? "Edit Announcement" : "New Announcement"}
                    </h3>
                    {editingId && (
                        <button
                            onClick={() => { setTitle(""); setBody(""); setEditingId(null); }}
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handlePost} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Category</label>
                            <select value={type} onChange={e => setType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                                {["general", "exam", "assignment", "event", "holiday"].map(t => (
                                    <option key={t} value={t} className="bg-slate-900 capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Target Audience</label>
                            <select value={target} onChange={e => setTarget(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                                <option value="all" className="bg-slate-900">All Students</option>
                                <option value="CS-4A" className="bg-slate-900">CS-4A Only</option>
                                <option value="CS-4B" className="bg-slate-900">CS-4B Only</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Notice title..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Message</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)}
                            placeholder="Write your announcement here..."
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none" />
                    </div>

                    <button type="submit"
                        className={`flex items-center gap-2 btn-primary text-sm px-6 py-2.5 transition-all ${submitted ? "!from-emerald-600 !to-teal-600 !shadow-emerald-500/25" : ""
                            }`}>
                        {submitted ? "✓ Saved!" : <><Send className="w-4 h-4" />{editingId ? "Update Notice" : "Post Notice"}</>}
                    </button>
                </form>
            </div>

            {/* Previous notices */}
            <h3 className="text-white font-semibold mb-3 fade-in">Previous Notices</h3>
            <div className="space-y-3 fade-in">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="glass-card p-4 animate-pulse flex items-start gap-3">
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-1/3"></div>
                                <div className="h-3 bg-white/5 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))
                ) : notices.map(notice => (
                    <div key={notice.id} className="glass-card p-4 flex items-start gap-3 hover:border-white/20 transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white text-sm font-medium">{notice.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${notice.type === "exam" ? "bg-purple-600/20 text-purple-400" :
                                    notice.type === "assignment" ? "bg-blue-600/20 text-blue-400" :
                                        notice.type === "event" ? "bg-amber-600/20 text-amber-400" :
                                            notice.type === "holiday" ? "bg-emerald-600/20 text-emerald-400" :
                                                "bg-slate-700/50 text-slate-400"
                                    }`}>{notice.type}</span>
                            </div>
                            <p className="text-slate-400 text-xs mb-1 line-clamp-2">{notice.body}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span>{notice.author}</span>
                                <span>·</span>
                                <span>{formatDate(notice.date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 z-10 flex-shrink-0">
                            {notice.author === (userProfile?.name || "Faculty Member") && (
                                <button onClick={() => handleEdit(notice)} className="text-slate-600 hover:text-blue-400 transition-colors p-1 flex-shrink-0 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                </button>
                            )}
                            <button onClick={() => handleDelete(notice.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1 flex-shrink-0 cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
