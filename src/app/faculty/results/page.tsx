"use client";

import { useState, useCallback, memo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { DEMO_ALL_STUDENTS } from "@/lib/demo-data";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentRowProps {
    student: { id: string; name: string; collegeRollNo?: string };
    index: number;
    mark?: { internal: string; external: string };
    onUpdateMark: (id: string, type: 'internal' | 'external', value: string) => void;
    getGrade: (total: number, max?: number) => string;
}

const StudentRow = memo(({ student, index, mark, onUpdateMark, getGrade }: StudentRowProps) => {
    const internal = parseInt(mark?.internal || "0");
    const external = parseInt(mark?.external || "0");
    const total = internal + external;
    const grade = getGrade(total);

    return (
        <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-full bg-amber-600/30 flex items-center justify-center text-amber-300 text-xs font-bold flex-shrink-0">
                {index + 1}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{student.name}</p>
                <p className="text-slate-500 text-xs font-mono">{student.collegeRollNo || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <input
                    type="number" min="0" max="50"
                    value={mark?.internal || ""}
                    onChange={e => onUpdateMark(student.id, 'internal', e.target.value)}
                    placeholder="Int."
                    className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs text-center focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <input
                    type="number" min="0" max="100"
                    value={mark?.external || ""}
                    onChange={e => onUpdateMark(student.id, 'external', e.target.value)}
                    placeholder="Ext."
                    className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs text-center focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <div className={`w-10 text-center font-bold text-sm transition-colors ${total >= 105 ? "text-emerald-400" : total >= 75 ? "text-blue-400" : "text-red-400"}`}>
                    {grade}
                </div>
            </div>
        </div>
    );
});
StudentRow.displayName = "StudentRow";

function TableSkeleton() {
    return (
        <div className="divide-y divide-white/5 animate-pulse">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/10 rounded" />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-14 h-7 bg-white/10 rounded-lg" />
                        <div className="w-14 h-7 bg-white/10 rounded-lg" />
                        <div className="w-10 h-7 bg-white/10 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const FALLBACK_SUBJECTS = ["CET-Theory", "CGMA-Theory", "OS-Theory"];

export default function FacultyResultsPage() {
    const { userProfile } = useAuth();
    const [selectedSubject, setSelectedSubject] = useState("");
    const [students, setStudents] = useState<any[]>(DEMO_ALL_STUDENTS.slice(0, 5));
    const [marks, setMarks] = useState<Record<string, { internal: string; external: string }>>({});
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Use subjects from the user profile if available, else fallback
    const subjects: string[] = (userProfile?.subjects && userProfile.subjects.length > 0)
        ? userProfile.subjects
        : FALLBACK_SUBJECTS;

    // Auto-select first subject when subjects are available
    useEffect(() => {
        if (subjects.length > 0 && !selectedSubject) {
            setSelectedSubject(subjects[0]);
        }
    }, [subjects, selectedSubject]);

    useEffect(() => {
        if (!userProfile?.id || !selectedSubject) return;
        const fetchClassData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/results?firebaseId=${userProfile.id}&subject=${selectedSubject}`);
                const json = await res.json();
                if (json.success && json.data?.students?.length > 0) {
                    setStudents(json.data.students);
                    const newMarks: Record<string, { internal: string; external: string }> = {};
                    json.data.existingResults.forEach((r: any) => {
                        newMarks[r.userId] = { internal: String(r.internal), external: String(r.external) };
                    });
                    setMarks(newMarks);
                }
                // else it natively retains DEMO_ALL_STUDENTS
            } catch (err) {
                console.error(err);
                // retains DEMO_ALL_STUDENTS
            } finally {
                setIsLoading(false);
            }
        };
        fetchClassData();
    }, [userProfile?.id, selectedSubject]);

    const handleUpdateMark = useCallback((id: string, type: 'internal' | 'external', value: string) => {
        setMarks(prev => ({
            ...prev,
            [id]: { ...prev[id], [type]: value }
        }));
        setSaved(false);
    }, []);

    const getGrade = useCallback((total: number, max: number = 150) => {
        const pct = (total / max) * 100;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B+";
        if (pct >= 60) return "B";
        if (pct >= 50) return "C";
        return "F";
    }, []);

    const handleSave = async () => {
        if (!userProfile?.id) return;
        setIsSaving(true);
        setSaved(false);

        try {
            const formattedMarks: Record<string, any> = {};
            Object.entries(marks).forEach(([studentId, m]) => {
                const int = parseInt(m.internal || "0");
                const ext = parseInt(m.external || "0");
                const total = int + ext;
                formattedMarks[studentId] = {
                    internal: int,
                    external: ext,
                    total: total,
                    grade: getGrade(total, 150)
                };
            });

            const res = await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseId: userProfile.id,
                    subjectName: selectedSubject,
                    marks: formattedMarks
                })
            });

            if (res.ok) setSaved(true);
        } catch (error) {
            console.error("Failed to push results:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout role="faculty" title="Results">
            <div className="page-header">Marks &amp; Results</div>
            <p className="page-subheader">Upload internal and external marks for your subjects</p>

            {/* Subject selector */}
            <div className="glass-card p-4 mb-5 fade-in">
                <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Select Subject</p>
                <div className="flex gap-2 flex-wrap">
                    {subjects.map(sub => (
                        <button key={sub} onClick={() => { setSelectedSubject(sub); setSaved(false); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSubject === sub
                                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25"
                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                                }`}>
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Marks table */}
            <div className="glass-card overflow-hidden mb-4 fade-in">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <p className="text-white font-semibold">{selectedSubject || "—"}</p>
                    <p className="text-xs text-slate-500">Internal: /50 · External: /100 · Total: /150</p>
                </div>
                <div className="divide-y divide-white/5">
                    {isLoading ? (
                        <TableSkeleton />
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">No students found</div>
                    ) : (
                        students.map((student, i) => (
                            <StudentRow
                                key={student.id}
                                student={student}
                                index={i}
                                mark={marks[student.id]}
                                onUpdateMark={handleUpdateMark}
                                getGrade={getGrade}
                            />
                        ))
                    )}
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving || isLoading || students.length === 0}
                className={cn(
                    "w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-semibold text-sm transition-all duration-300 fade-in",
                    saved
                        ? "bg-emerald-600/20 border border-emerald-500/20 text-emerald-400"
                        : "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25",
                    (isSaving || isLoading || students.length === 0) ? "opacity-60 cursor-not-allowed" : ""
                )}
            >
                {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? "✓ Marks Saved Successfully!" : <><Save className="w-4 h-4" />Save Marks</>}
            </button>
        </DashboardLayout>
    );
}
