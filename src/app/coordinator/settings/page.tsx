"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell, GraduationCap, Shield, School, Save, CheckCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "relative flex-shrink-0 w-12 h-6 rounded-full border transition-all duration-300",
                enabled
                    ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/25"
                    : "bg-white/10 border-white/10"
            )}
        >
            <div className={cn(
                "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300",
                enabled ? "left-[calc(100%-22px)]" : "left-0.5"
            )} />
        </button>
    );
}

function SettingSection({ icon: Icon, title, color, children }: {
    icon: any; title: string; color: string; children: React.ReactNode;
}) {
    return (
        <div className="glass-card overflow-hidden fade-in">
            <div className={cn("flex items-center gap-3 px-6 py-4 border-b border-white/5", color)}>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-white font-bold">{title}</h2>
            </div>
            <div className="divide-y divide-white/5">{children}</div>
        </div>
    );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-6 px-6 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="min-w-0">
                <p className="text-white text-sm font-medium">{label}</p>
                {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

export default function CoordinatorSettingsPage() {
    // Notification settings
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [leaveNotify, setLeaveNotify] = useState(true);
    const [examReminders, setExamReminders] = useState(false);
    const [smsAlerts, setSmsAlerts] = useState(false);

    // Academic settings
    const [semester, setSemester] = useState("Even Semester 2026");
    const [attendanceThreshold, setAttendanceThreshold] = useState("75");
    const [gradingScheme, setGradingScheme] = useState("10-point");
    const [maxLeavedays, setMaxLeavedays] = useState("10");

    // Security
    const [twoFactor, setTwoFactor] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState("60");

    // College Profile
    const [collegeName, setCollegeName] = useState("Institute of Technology and Science");
    const [collegeCode, setCollegeCode] = useState("ITS-GZB");
    const [principalName, setPrincipalName] = useState("Dr. Rajiv Sharma");

    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const selectClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer";
    const inputClass = "bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors w-full sm:w-56";

    return (
        <DashboardLayout role="coordinator" title="System Settings">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">System Settings</h1>
                    <p className="text-slate-400 text-sm">Configure global preferences for the ITS platform</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all",
                        saved
                            ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:opacity-90",
                        saving && "opacity-60 cursor-wait"
                    )}
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saved ? (
                        <><CheckCircle className="w-4 h-4" /> Saved!</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save All Changes</>
                    )}
                </button>
            </div>

            <div className="space-y-5">
                {/* Notification Settings */}
                <SettingSection icon={Bell} title="Notification Settings" color="bg-blue-600/10">
                    <SettingRow label="Email Alerts" description="Send email when a faculty member registers or submits a leave">
                        <Toggle enabled={emailAlerts} onToggle={() => setEmailAlerts(v => !v)} />
                    </SettingRow>
                    <SettingRow label="Leave Request Notifications" description="Get notified instantly when students or faculty apply for leave">
                        <Toggle enabled={leaveNotify} onToggle={() => setLeaveNotify(v => !v)} />
                    </SettingRow>
                    <SettingRow label="Exam Reminders" description="Automated reminders 3 days before each exam date">
                        <Toggle enabled={examReminders} onToggle={() => setExamReminders(v => !v)} />
                    </SettingRow>
                    <SettingRow label="SMS Alerts" description="Send SMS notifications to registered mobile numbers">
                        <Toggle enabled={smsAlerts} onToggle={() => setSmsAlerts(v => !v)} />
                    </SettingRow>
                </SettingSection>

                {/* Academic Settings */}
                <SettingSection icon={GraduationCap} title="Academic Configuration" color="bg-emerald-600/10">
                    <SettingRow label="Current Active Semester" description="The default semester shown across all portals">
                        <div className="relative w-full sm:w-56">
                            <select
                                value={semester}
                                onChange={e => setSemester(e.target.value)}
                                className={selectClass}
                            >
                                <option className="bg-slate-900">Even Semester 2026</option>
                                <option className="bg-slate-900">Odd Semester 2026</option>
                                <option className="bg-slate-900">Even Semester 2027</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </SettingRow>
                    <SettingRow label="Attendance Threshold (%)" description="Students below this percentage receive a warning flag">
                        <div className="relative w-full sm:w-56">
                            <select
                                value={attendanceThreshold}
                                onChange={e => setAttendanceThreshold(e.target.value)}
                                className={selectClass}
                            >
                                <option className="bg-slate-900">60</option>
                                <option className="bg-slate-900">65</option>
                                <option className="bg-slate-900">70</option>
                                <option className="bg-slate-900">75</option>
                                <option className="bg-slate-900">80</option>
                                <option className="bg-slate-900">85</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </SettingRow>
                    <SettingRow label="Grading Scheme" description="Choose the grading scale used across all result entries">
                        <div className="relative w-full sm:w-56">
                            <select
                                value={gradingScheme}
                                onChange={e => setGradingScheme(e.target.value)}
                                className={selectClass}
                            >
                                <option value="10-point" className="bg-slate-900">10-Point (A+ to F)</option>
                                <option value="4-point" className="bg-slate-900">4-Point GPA Scale</option>
                                <option value="percentage" className="bg-slate-900">Percentage Only</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </SettingRow>
                    <SettingRow label="Max Leave Days / Semester" description="Maximum number of leaves a student can apply for per semester">
                        <div className="relative w-full sm:w-56">
                            <select
                                value={maxLeavedays}
                                onChange={e => setMaxLeavedays(e.target.value)}
                                className={selectClass}
                            >
                                {["5", "7", "10", "12", "15"].map(v => (
                                    <option key={v} value={v} className="bg-slate-900">{v} days</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </SettingRow>
                </SettingSection>

                {/* College Profile */}
                <SettingSection icon={School} title="College Profile" color="bg-purple-600/10">
                    <SettingRow label="Institution Name" description="Official name displayed on documents and certificates">
                        <input
                            value={collegeName}
                            onChange={e => setCollegeName(e.target.value)}
                            className={inputClass}
                        />
                    </SettingRow>
                    <SettingRow label="College Code" description="Short identifier used in roll numbers and system IDs">
                        <input
                            value={collegeCode}
                            onChange={e => setCollegeCode(e.target.value)}
                            className={inputClass}
                        />
                    </SettingRow>
                    <SettingRow label="Principal / Director Name" description="Displayed on official letters and notices">
                        <input
                            value={principalName}
                            onChange={e => setPrincipalName(e.target.value)}
                            className={inputClass}
                        />
                    </SettingRow>
                </SettingSection>

                {/* Security */}
                <SettingSection icon={Shield} title="Security & Sessions" color="bg-amber-600/10">
                    <SettingRow label="Two-Factor Authentication" description="Require OTP on login for all coordinator accounts">
                        <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(v => !v)} />
                    </SettingRow>
                    <SettingRow label="Session Timeout (minutes)" description="Auto-logout inactive sessions after this duration">
                        <div className="relative w-full sm:w-56">
                            <select
                                value={sessionTimeout}
                                onChange={e => setSessionTimeout(e.target.value)}
                                className={selectClass}
                            >
                                {["15", "30", "60", "120", "240"].map(v => (
                                    <option key={v} value={v} className="bg-slate-900">{v} min</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </SettingRow>
                </SettingSection>
            </div>
        </DashboardLayout>
    );
}
