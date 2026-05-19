"use client";

import { useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, ExternalLink, Info, Download, Printer } from "lucide-react";

const ADMIT_CARD_LINKS = [
    {
        label: "CCSU Admit Card Portal (Direct)",
        url:   "https://www.ccsuniversityweb.in/Admit%20Card/AdmitCardSearchStudent.aspx?STAT=COLL",
        hint:  "Enter your Roll Number to download the official CCSU admit card",
    },
    {
        label: "CCSU Examination Form",
        url:   "https://www.ccsuniversityweb.in/ExamForm/ExamFormLinks.aspx",
        hint:  "Fill and submit your examination form on the CCSU portal",
    },
];

export default function AdmitCardPage() {
    const { userProfile } = useAuth();
    const printRef = useRef<HTMLDivElement>(null);

    const openPortal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

    const handlePrint = () => {
        if (!printRef.current) return;
        const printContent = printRef.current.innerHTML;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
            <html><head><title>Admit Card – ${userProfile?.name || "Student"}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; color: #000; }
                .card { border: 2px solid #000; padding: 20px; max-width: 600px; margin: auto; }
                .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
                .logo { font-size: 22px; font-weight: bold; }
                .subtitle { font-size: 12px; color: #333; }
                .field { display: flex; justify-content: space-between; margin: 8px 0; font-size: 13px; }
                .field-label { font-weight: bold; color: #333; }
                .notice { margin-top: 18px; padding: 10px; border: 1px dashed #666; font-size: 11px; color: #555; }
                .photo { width: 90px; height: 110px; border: 1px solid #000; display: inline-block; text-align: center; line-height: 110px; font-size: 11px; color: #777; }
            </style></head><body>
            <div class="card">
                <div class="header">
                    <div class="logo">INSTITUTE OF TECHNOLOGY AND SCIENCE</div>
                    <div class="subtitle">Ghaziabad, Uttar Pradesh | Affiliated to CCSU</div>
                    <div style="font-size:14px;font-weight:bold;margin-top:8px;text-transform:uppercase;">Examination Admit Card — Even Semester 2026</div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div style="flex:1">
                        <div class="field"><span class="field-label">Student Name:</span><span>${userProfile?.name || "—"}</span></div>
                        <div class="field"><span class="field-label">University Roll No:</span><span>${userProfile?.universityRollNo || "Pending"}</span></div>
                        <div class="field"><span class="field-label">College Roll No:</span><span>${userProfile?.rollNumber || "—"}</span></div>
                        <div class="field"><span class="field-label">Programme:</span><span>${userProfile?.branch || "B.Tech / BCA / MCA"}</span></div>
                        <div class="field"><span class="field-label">Semester:</span><span>${userProfile?.semester || "IV (Even) 2026"}</span></div>
                        <div class="field"><span class="field-label">Examination Date:</span><span>May – June 2026</span></div>
                        <div class="field"><span class="field-label">Exam Centre:</span><span>ITS Ghaziabad</span></div>
                    </div>
                    <div class="photo">Photo</div>
                </div>
                <div class="notice">
                    <b>Instructions:</b> Carry this admit card along with a valid government photo ID (Aadhar / Voter ID) to the examination hall. 
                    Mobile phones and electronic devices are strictly prohibited. Reporting time: 30 minutes before the exam.
                </div>
                <div style="text-align:right;margin-top:20px;font-size:11px;color:#555;">
                    Controller of Examinations<br/>ITS Ghaziabad
                </div>
            </div></body></html>`);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    return (
        <DashboardLayout role="student" title="Admit Card">
            <div className="max-w-3xl mx-auto space-y-5">

                {/* Header */}
                <div className="glass-card p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Exam Admit Card</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Even Semester 2026 · ITS Ghaziabad
                            </p>
                            {userProfile?.universityRollNo && (
                                <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono">
                                    Roll No: {userProfile.universityRollNo}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* In-app Admit Card Preview */}
                <div ref={printRef} className="glass-card p-6 border border-white/10 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-bold text-lg">📋 Admit Card Preview</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-colors"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </button>
                        </div>
                    </div>

                    {/* Card body */}
                    <div className="border border-white/20 rounded-xl overflow-hidden">
                        {/* Institute header */}
                        <div className="bg-gradient-to-r from-blue-700/30 to-indigo-700/30 border-b border-white/10 p-4 text-center">
                            <p className="text-white font-bold text-lg tracking-wide">INSTITUTE OF TECHNOLOGY AND SCIENCE</p>
                            <p className="text-slate-300 text-xs mt-0.5">Ghaziabad, U.P. | Affiliated to CCSU | AICTE Approved</p>
                            <p className="text-blue-300 font-semibold text-sm mt-2 uppercase tracking-wide">Examination Admit Card — Even Semester 2026</p>
                        </div>

                        {/* Student info + photo */}
                        <div className="p-5 flex gap-5 items-start">
                            <div className="flex-1 space-y-2 text-sm">
                                {[
                                    ["Student Name", userProfile?.name || "—"],
                                    ["University Roll No", userProfile?.universityRollNo || "Pending from University"],
                                    ["College Roll No", userProfile?.rollNumber || "—"],
                                    ["Programme", userProfile?.branch || "BCA"],
                                    ["Semester", userProfile?.semester || "IV (Even) 2026"],
                                    ["Examination Period", "May – June 2026"],
                                    ["Exam Centre", "ITS Ghaziabad"],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex gap-3">
                                        <span className="text-slate-400 w-36 flex-shrink-0">{label}:</span>
                                        <span className="text-white font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-20 h-24 border border-white/20 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-white font-bold text-lg mb-1">
                                        {userProfile?.name?.charAt(0) || "?"}
                                    </div>
                                    <p className="text-[9px] text-slate-500">Photo</p>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="mx-5 mb-5 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300">
                            <strong>Instructions:</strong> Carry this admit card along with a valid government photo ID (Aadhar / Voter ID). Mobile phones and electronic devices are strictly prohibited. Reporting time: 30 minutes before the examination.
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 text-center">
                        For official university admit card, visit the CCSU portal below ↓
                    </p>
                </div>

                {/* Instructions */}
                <div className="glass-card p-5 flex items-start gap-4 border-l-4 border-l-blue-500">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold text-white mb-2">How to get the official CCSU admit card</p>
                        <ol className="text-slate-400 space-y-1.5 list-decimal pl-4">
                            <li>Click one of the portal links below — it opens in a new tab.</li>
                            <li>Find the <strong className="text-white">Admit Card</strong> section on the portal.</li>
                            <li>
                                Enter your <strong className="text-white">University Roll Number</strong>
                                {userProfile?.universityRollNo && (
                                    <span className="ml-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs">
                                        {userProfile.universityRollNo}
                                    </span>
                                )} and other required details.
                            </li>
                            <li>Download and print your admit card.</li>
                        </ol>
                    </div>
                </div>

                {/* Portal links */}
                <div className="space-y-3">
                    {ADMIT_CARD_LINKS.map((link) => (
                        <button
                            key={link.url}
                            onClick={() => openPortal(link.url)}
                            className="w-full flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-500/40 transition-all group text-left"
                        >
                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                <ExternalLink className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">{link.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">{link.url}</p>
                                <p className="text-xs text-blue-400/70 mt-1">{link.hint}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <div className="glass-card p-8 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <Download className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Get Official Admit Card</h3>
                    <p className="text-slate-400 text-sm max-w-sm mb-5">
                        Visit the CCSU portal and enter your university roll number to download the official admit card.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => openPortal("https://www.ccsuniversityweb.in/Admit%20Card/AdmitCardSearchStudent.aspx?STAT=COLL")}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:scale-105"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Download Admit Card
                        </button>
                        <button
                            onClick={() => openPortal("https://www.ccsuniversityweb.in/ExamForm/ExamFormLinks.aspx")}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:scale-105"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Fill Exam Form
                        </button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
