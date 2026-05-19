"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { DEMO_RESULTS } from "@/lib/demo-data";
import { COURSES, COURSE_SEMESTERS, type CourseCode } from "@/lib/course-data";
import { Download, Award, ExternalLink, Info, BookOpen } from "lucide-react";

const GRADE_COLOR: Record<string, string> = {
    "A+": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    "A":  "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    "B+": "bg-sky-500/20 text-sky-400 border border-sky-500/30",
    "B":  "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    "C":  "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    "D":  "bg-red-500/20 text-red-400 border border-red-500/30",
    "F":  "bg-red-700/20 text-red-500 border border-red-500/30",
};

function gradeColor(g: string) {
    return GRADE_COLOR[g] || "bg-slate-500/20 text-slate-400 border border-slate-500/30";
}

// Helper: extract semester number from label like "IInd Year - IVth Semester"
function parseSemNumber(label?: string): number {
    if (!label) return 4;
    const map: Record<string, number> = { "Ist": 1, "IInd": 2, "IIIrd": 3, "IVth": 4, "Vth": 5, "VIth": 6 };
    const parts = label.split(" - ");
    const semPart = parts[1]?.split(" ")[0];
    return map[semPart] ?? 4;
}

export default function ResultsPage() {
    const { userProfile } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState<CourseCode>("BCA");
    const [selectedSem, setSelectedSem] = useState(4);

    // Sync from profile when auth loads (async — profile is null on first render)
    useEffect(() => {
        if (userProfile?.branch) {
            const branch = userProfile.branch as CourseCode;
            if (branch === "BCA" || branch === "BBA") {
                setSelectedCourse(branch);
                setSelectedSem(parseSemNumber(userProfile.semester));
            }
        }
    }, [userProfile?.branch, userProfile?.semester]);

    const semesters = COURSE_SEMESTERS[selectedCourse] ?? [];

    const openPortal = () => {
        window.open("https://result.ccsuniversityweb.in/", "_blank", "noopener,noreferrer");
    };

    // Generate demo results from the selected course's subjects for realism
    const currentSubjects = semesters.find(s => s.sem === selectedSem)?.subjects ?? DEMO_RESULTS.map(r => r.subject);
    const displayResults = selectedCourse === "BCA"
        ? DEMO_RESULTS  // real data for the default BCA student
        : currentSubjects.map((sub, i) => ({
            subject: sub,
            internal: [24, 26, 28, 22, 25, 27, 23, 20, 28][i % 9],
            external: [38, 40, 42, 35, 0, 0, 36, 30, 0][i % 9],
            total: [62, 66, 70, 57, 25, 27, 59, 50, 28][i % 9],
            max: [100, 100, 100, 100, 50, 50, 100, 100, 50][i % 9],
            grade: ["B", "B+", "A", "B", "A", "A+", "B", "B", "A"][i % 9],
        }));

    // Compute CGPA from displayed results
    const cgpa = (() => {
        const validResults = displayResults.filter(r => r.max > 0);
        if (validResults.length === 0) return 0;
        const totalPct = validResults.reduce((s, r) => s + (r.total / r.max) * 10, 0);
        return parseFloat((totalPct / validResults.length).toFixed(1));
    })();


    return (
        <DashboardLayout role="student" title="Exam Results & Marksheet">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold t-heading mb-1">Academic Performance</h1>
                    <p className="t-muted text-sm">Internal marks & university result portal</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 print:hidden">
                    {/* Course selector */}
                    <select
                        className="bg-[var(--bg-item)] border border-[var(--border-item)] text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 font-medium t-heading"
                        value={selectedCourse}
                        onChange={(e) => { setSelectedCourse(e.target.value as CourseCode); setSelectedSem(1); }}
                    >
                        {COURSES.map(c => (
                            <option key={c.code} value={c.code} className="bg-[var(--bg-card)] text-[var(--text-heading)]">{c.label}</option>
                        ))}
                    </select>
                    {/* Semester selector — shows full year+semester labels */}
                    <select
                        className="bg-[var(--bg-item)] border border-[var(--border-item)] text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 font-medium t-heading"
                        value={selectedSem}
                        onChange={(e) => setSelectedSem(Number(e.target.value))}
                    >
                        {semesters.map(s => (
                            <option key={s.sem} value={s.sem} className="bg-[var(--bg-card)] text-[var(--text-heading)]">{s.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={openPortal}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 text-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        CCSU Portal
                    </button>
                </div>
            </div>

            {/* Semester subjects preview */}
            {semesters.find(s => s.sem === selectedSem) && (
                <div className="glass-card p-4 mb-5 fade-in">
                    <p className="text-xs t-muted uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {semesters.find(s => s.sem === selectedSem)?.label} — Subjects
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {semesters.find(s => s.sem === selectedSem)?.subjects.map((sub, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 t-muted">{sub}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* CGPA Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 fade-in">
                <div className="glass-card p-5 flex flex-col items-center text-center border-b-2 border-blue-500">
                    <p className="text-xs t-muted uppercase tracking-wider font-semibold mb-1">CGPA</p>
                    <p className="text-4xl font-extrabold text-blue-400">{cgpa}</p>
                    <p className="text-xs t-muted mt-1">Overall · {selectedCourse}</p>
                </div>
                <div className="glass-card p-5 flex flex-col items-center text-center border-b-2 border-emerald-500">
                    <p className="text-xs t-muted uppercase tracking-wider font-semibold mb-1">Subjects</p>
                    <p className="text-4xl font-extrabold text-emerald-400">{displayResults.length}</p>
                    <p className="text-xs t-muted mt-1">Internal marks available</p>
                </div>
                <div className="glass-card p-5 flex flex-col items-center text-center border-b-2 border-amber-500">
                    <p className="text-xs t-muted uppercase tracking-wider font-semibold mb-1">Roll No.</p>
                    <p className="text-2xl font-extrabold text-amber-400 font-mono">{userProfile?.rollNumber || "240934106129"}</p>
                    <p className="text-xs t-muted mt-1">University Roll Number</p>
                </div>
            </div>

            {/* Internal Marks Table */}
            <div className="glass-card p-6 mb-6 fade-in">
                <div className="flex items-center gap-2 mb-5">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h3 className="t-heading font-semibold text-lg">Internal Examination Marks</h3>
                    <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">ECMS Portal Data</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border-item)]">
                                <th className="text-left py-3 px-2 t-muted font-semibold text-xs uppercase tracking-wider">Subject</th>
                                <th className="text-center py-3 px-2 t-muted font-semibold text-xs uppercase tracking-wider">Internal</th>
                                <th className="text-center py-3 px-2 t-muted font-semibold text-xs uppercase tracking-wider">External</th>
                                <th className="text-center py-3 px-2 t-muted font-semibold text-xs uppercase tracking-wider">Total</th>
                                <th className="text-center py-3 px-2 t-muted font-semibold text-xs uppercase tracking-wider">Grade</th>
                                <th className="text-center py-3 px-2 t-muted font-semibold text-xs uppercase tracking-wider">%</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-item)]">
                            {displayResults.map((r, i) => {
                                const pct = r.max > 0 ? Math.round((r.total / r.max) * 100) : 0;
                                return (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-3 px-2 t-heading font-medium">{r.subject}</td>
                                        <td className="py-3 px-2 text-center text-blue-400 font-semibold">{r.internal}</td>
                                        <td className="py-3 px-2 text-center t-muted">{r.external > 0 ? r.external : <span className="text-xs italic">—</span>}</td>
                                        <td className="py-3 px-2 text-center t-heading font-bold">{r.total}<span className="text-xs t-faint font-normal">/{r.max}</span></td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${gradeColor(r.grade)}`}>{r.grade}</span>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`font-semibold text-sm ${pct >= 75 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400"}`}>{pct}%</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs t-faint mt-4 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    External marks will be updated after end-semester examinations (May 2026). Some entries show internal assessment only.
                </p>
            </div>

            {/* CCSU Portal redirect card */}
            <div className="glass-card p-6 fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="t-heading font-semibold">University Marksheet (CCSU)</h3>
                        <p className="t-muted text-xs">result.ccsuniversityweb.in</p>
                    </div>
                    <button
                        onClick={openPortal}
                        className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Open CCSU Result Portal
                    </button>
                </div>
                <div className="bg-white/[0.02] border border-[var(--border-item)] rounded-xl p-4 text-sm t-muted">
                    <ol className="space-y-1 list-decimal pl-4">
                        <li>Click <strong className="t-heading">&quot;Open CCSU Portal&quot;</strong> — the official result portal opens in a new tab.</li>
                        <li>Select your <strong className="t-heading">Course</strong> from the dropdown (e.g. BCA).</li>
                        <li>Select your <strong className="t-heading">Year / Semester</strong> (I, II, III …).</li>
                        <li>Enter your <strong className="t-heading">University Roll Number</strong>
                            <span className="ml-2 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">{userProfile?.rollNumber || "240934106129"}</span>
                        </li>
                        <li>Click <strong className="t-heading">Submit</strong> to view and print your marksheet.</li>
                    </ol>
                </div>
            </div>
        </DashboardLayout>
    );
}
