"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CoordinatorSettingsPage() {
    return (
        <DashboardLayout role="coordinator" title="System Settings">
            <div className="flex flex-col mb-8 fade-in">
                <h1 className="text-3xl font-bold text-white mb-1">System Preferences</h1>
                <p className="text-slate-400 text-sm">Configure global settings for the ITS platform.</p>
            </div>
            <div className="glass-card p-6 min-h-[400px] fade-in" style={{ animationDelay: "100ms" }}>
                <div className="space-y-6">
                    <div className="pb-6 border-b border-white/10">
                        <h2 className="text-lg font-bold text-white mb-2">Notification Settings</h2>
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                            <div>
                                <p className="font-medium text-white mb-1">Email Alerts</p>
                                <p className="text-xs text-slate-400">Receive an email when a new faculty member registers.</p>
                            </div>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer border border-blue-500">
                                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-white mb-2">Academic Year</h2>
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                            <div>
                                <p className="font-medium text-white mb-1">Current Semester</p>
                                <p className="text-xs text-slate-400">Set the default active semester across the college.</p>
                            </div>
                            <select className="bg-slate-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none">
                                <option>Even Semester 2026</option>
                                <option>Odd Semester 2026</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
