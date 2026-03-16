"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Mail, Phone, MapPin, Briefcase, Save, Edit2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";


export default function CoordinatorProfilePage() {
    const { userProfile, loadUserProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: userProfile?.name || "",
        phone: userProfile?.phone || "",
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || "",
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
                throw new Error("Failed to update coordinator profile via API");
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
        <DashboardLayout role="coordinator" title="Profile">
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
            <p className="page-subheader">Coordinator information and office details</p>

            {/* Profile card */}
            <div className="glass-card p-6 mb-4 fade-in">
                <div className="flex items-start gap-5 flex-wrap">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                        {(formData.name || userProfile?.name || "C").charAt(0)}
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
                            <h2 className="text-2xl font-bold text-white">{userProfile?.name || "Coordinator Name"}</h2>
                        )}
                        <div className="flex items-center gap-2 text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full w-fit mt-2">
                            <Briefcase className="w-4 h-4" />
                            <span>Academic Coordinator</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 fade-in">
                <div className="glass-card p-5">
                    <h3 className="text-white font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 py-2 border-b border-white/5">
                            <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-slate-400 text-sm w-28 flex-shrink-0">Email</span>
                            <span className="text-white text-sm font-medium">{userProfile?.email || "coordinator@college.edu"}</span>
                        </div>

                        <div className="flex items-center gap-3 py-2 border-b border-white/5 border-0">
                            <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <span className="text-slate-400 text-sm w-28 flex-shrink-0">Phone</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
                                    placeholder="+91 99887 76655"
                                />
                            ) : (
                                <span className="text-white text-sm font-medium">{userProfile?.phone || "+91 99887 76655"}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Automated Gmail Sync</h3>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded uppercase tracking-wider">Background</span>
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
                                    <p className="text-xs text-slate-400">Not Connected</p>
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
            </div>
        </DashboardLayout>
    );
}
