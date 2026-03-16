"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { Download, Award, ExternalLink, Info } from "lucide-react";

// Course codes accepted by result.ccsuniversity.ac.in
const CCSU_COURSES = [
    { value: "bca",     label: "BCA (Bachelor of Computer Applications)" },
    { value: "bba",     label: "BBA (Bachelor of Business Administration)" },
    { value: "bcom",    label: "B.COM (Regular)" },
    { value: "ba",      label: "B.A. (Regular)" },
    { value: "bsc",     label: "B.Sc. (Regular)" },
    { value: "btech",   label: "B.Tech" },
    { value: "bed",     label: "B.Ed." },
    { value: "bpharma", label: "B.Pharma" },
    { value: "llb",     label: "LLB" },
    { value: "bped",    label: "B.P.Ed" },
    { value: "blib",    label: "B.Lib" },
    { value: "mca",     label: "MCA" },
    { value: "mba",     label: "MBA" },
    { value: "mcom",    label: "M.COM" },
    { value: "ma",      label: "M.A." },
    { value: "msc",     label: "M.Sc." },
    { value: "mtech",   label: "M.Tech" },
    { value: "med",     label: "M.Ed." },
    { value: "llm",     label: "LLM" },
    { value: "pba",     label: "B.A. (Private)" },
    { value: "pbcom",   label: "B.COM (Private)" },
];

export default function ResultsPage() {
    const { userProfile }                     = useAuth();
    const [selectedSem, setSelectedSem]       = useState("1");
    const [selectedCourse, setSelectedCourse] = useState("bca");

    const openPortal = () => {
        // Open the CCSU result portal directly — the student fills in details themselves
        window.open("https://result.ccsuniversity.ac.in/regpvt2013.php", "_blank", "noopener,noreferrer");
    };

    return (
        <DashboardLayout role="student" title="Exam Results & Marksheet">

            {/* Controls bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold t-heading mb-1">University Results</h1>
                    <p className="t-muted text-sm font-medium flex items-center gap-1.5">
                        Official marksheets directly from&nbsp;
                        <a
                            href="https://result.ccsuniversity.ac.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                        >
                            result.ccsuniversity.ac.in <ExternalLink className="w-3 h-3" />
                        </a>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                    {/* Course selector (informational — shown for context) */}
                    <select
                        className="bg-[var(--bg-item)] border border-[var(--border-item)] text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 font-medium t-heading"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        {CCSU_COURSES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>

                    {/* Semester selector (informational) */}
                    <select
                        className="bg-[var(--bg-item)] border border-[var(--border-item)] text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 font-medium t-heading"
                        value={selectedSem}
                        onChange={(e) => setSelectedSem(e.target.value)}
                    >
                        {[1,2,3,4,5,6,7,8,9,10].map(s => (
                            <option key={s} value={s.toString()}>Semester {s}</option>
                        ))}
                    </select>

                    <button
                        onClick={openPortal}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open CCSU Portal
                    </button>
                </div>
            </div>

            {/* Info card */}
            <div className="glass-card p-5 mb-6 flex items-start gap-4 border-l-4 border-l-emerald-500">
                <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold t-heading mb-1">How to view your marksheet</p>
                    <ol className="t-muted space-y-1 list-decimal pl-4">
                        <li>Click <strong className="t-heading">&quot;Open CCSU Portal&quot;</strong> — the official result portal opens in a new tab.</li>
                        <li>Select your <strong className="t-heading">Course</strong> from the dropdown (e.g. BCA, BBA, B.COM).</li>
                        <li>Select your <strong className="t-heading">Year / Semester</strong> (I, II, III …).</li>
                        <li>Enter your <strong className="t-heading">University Roll Number</strong>
                            {userProfile?.universityRollNo && (
                                <span className="ml-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">
                                    {userProfile.universityRollNo}
                                </span>
                            )}.
                        </li>
                        <li>Click <strong className="t-heading">Submit</strong> to view and print your marksheet.</li>
                    </ol>
                </div>
            </div>

            {/* Placeholder */}
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center fade-in">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                    <Award className="w-10 h-10 text-emerald-500/60" />
                </div>
                <h3 className="text-xl font-bold t-heading mb-2">View Your Official Marksheet</h3>
                <p className="t-muted max-w-md text-sm mb-6">
                    Click the button below to open the CCSU result portal. Enter your roll number there to
                    view, download, or print your provisional marksheet.
                </p>
                <button
                    onClick={openPortal}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:scale-105"
                >
                    <Download className="w-5 h-5" />
                    Open CCSU Result Portal
                </button>
                <p className="text-xs t-muted mt-4 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    result.ccsuniversity.ac.in
                </p>
            </div>
        </DashboardLayout>
    );
}
