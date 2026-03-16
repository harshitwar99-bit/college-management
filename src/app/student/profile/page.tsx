"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { DEMO_ATTENDANCE } from "@/lib/demo-data";
import { getAttendanceColor } from "@/lib/utils";
import { Phone, Mail, BookOpen, LayoutGrid, Hash, Calendar, LogOut, Edit2, Save } from "lucide-react";


export default function StudentProfilePage() {
    const { userProfile, logout, loadUserProfile } = useAuth();
    const name = userProfile?.name || "Arjun Sharma";
    const avg = Math.round(DEMO_ATTENDANCE.reduce((s, a) => s + a.percent, 0) / DEMO_ATTENDANCE.length);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: userProfile?.name || "Arjun Sharma",
        phone: userProfile?.phone || "",
    });
    const [isSaving, setIsSaving] = useState(false);

    // Keep form in sync if profile takes a second to load
    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || "Arjun Sharma",
                phone: userProfile.phone || "",
            });
        }
    }, [userProfile]);

    const handleSave = async () => {
        if (!userProfile?.id) return;
        setIsSaving(true);
        try {
            const userId = userProfile.id as string;

            // Call new Postgres REST API instead of Firestore
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
                throw new Error("Failed to update profile via API");
            }

            await loadUserProfile(userId); // Refresh local auth context
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout role="student" title="Profile">
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
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                )}
            </div>
            <p className="page-subheader">Your personal information and academic details</p>

            {/* Profile card */}
            <div className="glass-card p-6 mb-4 fade-in">
                <div className="flex items-start gap-5 flex-wrap">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                        {(formData.name || name).charAt(0)}
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-2xl font-bold bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white w-full max-w-sm mb-0.5 focus:outline-none focus:border-blue-500/50"
                                placeholder="Full Name"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-white">{name}</h2>
                        )}
                        <p className="text-blue-400 font-medium mt-0.5">
                            {userProfile?.rollNumber || "CS2024001"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/20 text-blue-300 text-xs font-medium">
                                {userProfile?.branch || "Computer Science Engineering"}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/20 text-purple-300 text-xs font-medium">
                                {userProfile?.semester || "4th Semester"}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                                Division {userProfile?.division || "A"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4 fade-in">
                <div className="glass-card p-4 text-center">
                    <p className={`text-2xl font-bold ${getAttendanceColor(avg)}`}>{avg}%</p>
                    <p className="text-slate-400 text-xs mt-1">Attendance</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">8.7</p>
                    <p className="text-slate-400 text-xs mt-1">CGPA</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">6</p>
                    <p className="text-slate-400 text-xs mt-1">Subjects</p>
                </div>
            </div>

            {/* Personal info */}
            <div className="glass-card p-5 mb-4 fade-in">
                <h3 className="text-white font-semibold mb-4">Personal Information</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Email</span>
                        <span className="text-white text-sm font-medium">{userProfile?.email || "student@college.edu"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Phone</span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
                                placeholder="+91 98765 43210"
                            />
                        ) : (
                            <span className="text-white text-sm font-medium">{userProfile?.phone || "+91 98765 43210"}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <Hash className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Roll Number</span>
                        <span className="text-white text-sm font-medium">{userProfile?.rollNumber || "CS2024001"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Branch</span>
                        <span className="text-white text-sm font-medium">{userProfile?.branch || "Computer Science Engineering"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5">
                        <LayoutGrid className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-28 flex-shrink-0">Semester</span>
                        <span className="text-white text-sm font-medium">{userProfile?.semester || "4th Semester"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5 border-0">
                        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-36 flex-shrink-0">Division</span>
                        <span className="text-white text-sm font-medium">Division {userProfile?.division || "A"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5 border-0">
                        <BookOpen className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-36 flex-shrink-0">Father's Name</span>
                        <span className="text-white text-sm font-medium">{userProfile?.fatherName || "—"}</span>
                    </div>

                    <div className="flex flex-col gap-1 py-2 border-b border-white/5 border-0 mt-2">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-slate-400 text-sm w-36 flex-shrink-0">Address</span>
                        </div>
                        <span className="text-white text-sm font-medium pl-7 leading-relaxed">{userProfile?.address || "—"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-b border-white/5 border-0">
                        <Hash className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-36 flex-shrink-0">Seat Type</span>
                        <span className="text-white text-sm font-medium">{userProfile?.seatType || "—"}</span>
                    </div>

                    <div className="flex items-center gap-3 py-2 border-0">
                        <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-400 text-sm w-36 flex-shrink-0">Batch</span>
                        <span className="text-white text-sm font-medium">{userProfile?.batch || "—"}</span>
                    </div>
                </div>
            </div>

            {/* College info */}
            <div className="glass-card p-5 mb-4 fade-in">
                <h3 className="text-white font-semibold mb-3">Institution</h3>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
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

            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 font-medium fade-in"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </DashboardLayout>
    );
}
