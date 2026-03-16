"use client";

import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, ExternalLink, Info, Download } from "lucide-react";

const ADMIT_CARD_LINKS = [
    {
        label: "CCSU Admit Card Portal (Primary)",
        url:   "https://ccsuniversityweb.in/",
        hint:  "Navigate to the 'Admit Card' section and enter your Roll Number",
        color: "blue",
    },
    {
        label: "CCSU Exam Form & Admit Card",
        url:   "https://www.ccsuniversity.ac.in/exam-form-and-admit-card",
        hint:  "Official university page listing all available admit card links",
        color: "purple",
    },
];

export default function AdmitCardPage() {
    const { userProfile } = useAuth();

    const openPortal = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <DashboardLayout role="student" title="Admit Card">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="glass-card p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold t-heading">University Admit Card</h1>
                            <p className="t-muted text-sm mt-1">
                                Download your CCSU exam admit card from the official university portal.
                            </p>
                            {userProfile?.universityRollNo && (
                                <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono">
                                    Roll No: {userProfile.universityRollNo}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step-by-step instructions */}
                <div className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-blue-500">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold t-heading mb-2">How to download your admit card</p>
                        <ol className="t-muted space-y-1.5 list-decimal pl-4">
                            <li>Click one of the portal links below — it opens in a new tab.</li>
                            <li>Find the <strong className="t-heading">Admit Card</strong> section on the portal.</li>
                            <li>
                                Enter your <strong className="t-heading">University Roll Number</strong>
                                {userProfile?.universityRollNo && (
                                    <span className="ml-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs">
                                        {userProfile.universityRollNo}
                                    </span>
                                )} and any other required details.
                            </li>
                            <li>Download and print your admit card.</li>
                            <li>Carry a valid photo ID (Aadhar / Voter ID) along with the admit card.</li>
                        </ol>
                    </div>
                </div>

                {/* Portal links */}
                <div className="space-y-3">
                    {ADMIT_CARD_LINKS.map((link) => (
                        <button
                            key={link.url}
                            onClick={() => openPortal(link.url)}
                            className="w-full flex items-start gap-4 p-5 rounded-xl border border-[var(--border-item)] bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] hover:border-blue-500/40 transition-all group text-left"
                        >
                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                <ExternalLink className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold t-heading text-sm group-hover:text-blue-400 transition-colors">
                                    {link.label}
                                </p>
                                <p className="text-xs t-muted mt-0.5 truncate">{link.url}</p>
                                <p className="text-xs text-blue-400/70 mt-1">{link.hint}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 t-muted group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                        </button>
                    ))}
                </div>

                {/* Big CTA */}
                <div className="glass-card p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <Download className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold t-heading mb-2">Ready to download?</h3>
                    <p className="t-muted text-sm max-w-sm mb-5">
                        Open the primary CCSU admit card portal and enter your roll number to get your admit card.
                    </p>
                    <button
                        onClick={() => openPortal("https://ccsuniversityweb.in/")}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:scale-105"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Open CCSU Admit Card Portal
                    </button>
                    <p className="text-xs t-muted mt-3 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        ccsuniversityweb.in
                    </p>
                </div>

            </div>
        </DashboardLayout>
    );
}
