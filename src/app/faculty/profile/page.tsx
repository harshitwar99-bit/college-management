"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { Mail, Phone, BookOpen, LayoutGrid, LogOut, Edit2, Save } from "lucide-react";


export default function FacultyProfilePage() {
    const { userProfile, logout, loadUserProfile } = useAuth();
    const name = userProfile?.name || "Dr. Priya Mehta";

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: userProfile?.name || "Dr. Priya Mehta",
        phone: userProfile?.phone || "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || "Dr. Priya Mehta",
                phone: userProfile.phone || "",
            });
        }
    }, [userProfile]);

    const handleSave = async () => {
        if (!userProfile?.id) return;
        setIsSaving(true);
        try {
            const userId = userProfile.id as string;

            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseId: userId,
                    name: formData.name,
                    phone: formData.phone
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update faculty profile via API");
            }

            await loadUserProfile(userId);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout role="faculty" title="Profile">
            <div className="flex items-center justify-between mb-2">
                <div className="page-header !mb-0">My Profile</div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                )}
            </div>
            <p className="page-subheader">Faculty information and department details</p>

            {/* Profile card */}
            <div className="glass-card p-6 mb-4 fade-in">
                <div className="flex items-start gap-5 flex-wrap">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-3xl font-bold shadow-xl shadow-purple-500/20">
                        {(formData.name || name).replace("Dr. ", "").replace("Prof. ", "").charAt(0)}
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-2xl font-bold bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white w-full max-w-sm mb-0.5 focus:outline-none focus:border-purple-500/50"
                                placeholder="Full Name"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-white">{name}</h2>
                        )}
                        <p className="text-purple-400 font-medium mt-0.5">
                            {userProfile?.department || "Computer Science Department"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/20 text-purple-300 text-xs font-medium">Faculty</span>
                            <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/20 text-blue-300 text-xs font-medium">Ph.D.</span>
                            <span className="px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium">Senior Professor</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3 mb-4 fade-in">
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">3</p>
                    <p className="text-slate-400 text-xs mt-1">Subjects</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">2</p>
                    <p className="text-slate-400 text-xs mt-1">Classes</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">12</p>
                    <p className="text-slate-400 text-xs mt-1">Yrs. Exp.</p>
                </div>
            </div>

            {/* Personal info */}
            <div className="glass-card p-5 mb-4 fade-in">
                <h3 className="text-white font-semibold mb-4">Contact Details</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Email</span>
                        <span className="text-white text-sm font-medium">{userProfile?.email || "faculty@college.edu"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Phone</span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                placeholder="+91 91234 56789"
                            />
                        ) : (
                            <span className="text-white text-sm font-medium">{userProfile?.phone || "+91 91234 56789"}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Department</span>
                        <span className="text-white text-sm font-medium">{userProfile?.department || "Computer Science"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5 border-0">
                        <LayoutGrid className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Subjects</span>
                        <span className="text-white text-sm font-medium truncate">Data Structures, Algorithms, DBMS</span>
                    </div>
                </div>
            </div>

            {/* Automated Gmail Sync */}
            <div className="glass-card p-5 mb-4 fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">Automated Gmail Sync</h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-bold rounded uppercase tracking-wider">Background</span>
                </div>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    Connect your official <span className="text-white font-medium">@edu.in</span> college Gmail account to instantly sync Notices and Timetable updates to the system the moment you receive them.
                </p>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <Mail className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Google Workspace</p>
                                <p className="text-[11px] text-slate-400">Not Connected</p>
                            </div>
                        </div>
                        <button className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">
                            Link Account
                        </button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Webhook latency: &lt; 15 seconds
                </p>
            </div>

            {/* College info */}
            <div className="glass-card p-5 mb-4 fade-in">
                <h3 className="text-white font-semibold mb-3">Institution</h3>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        ITS
                    </div>
                    <div>
                        <p className="text-white font-semibold leading-tight">ITS - Institute of Technology and Science</p>
                        <p className="text-slate-400 text-sm mt-0.5">Mohan Nagar, Ghaziabad (UP) · Est. 1995</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold uppercase tracking-wider">A+ Grade by NAAC</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold uppercase tracking-wider">AICTE Approved</span>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 font-medium fade-in">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </DashboardLayout>
    );
}
