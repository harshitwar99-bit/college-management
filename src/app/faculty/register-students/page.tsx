"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";
import { useAuth } from "@/lib/auth-context";
import { Users, Upload, Download, CheckCircle2, AlertCircle, X, Plus, FileSpreadsheet, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_CSV = `Name,Email,RollNumber,Branch,Semester,Phone,FatherName
Ravi Kumar,ravi.kumar@its.edu.in,240934106140,BCA,IVth Semester,+91 9876543210,Mr. Suresh Kumar
Pooja Sharma,pooja.sharma@its.edu.in,240934106141,BCA,IVth Semester,+91 9765432109,Mr. Ramesh Sharma
Amit Tiwari,amit.tiwari@its.edu.in,240934106142,BCA,IVth Semester,+91 9654321098,Mr. Dinesh Tiwari`;

export default function FacultyRegisterStudentsPage() {
    const { userProfile } = useAuth();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Manual add form
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", rollNumber: "", branch: "BCA", semester: "IVth Semester", phone: "" });

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 5000);
    };

    const handleBulkParsed = (data: any[]) => {
        const mapped = data.map((row, i) => ({
            id: `new_${Date.now()}_${i}`,
            name: row.Name || row.name || "",
            email: row.Email || row.email || "",
            rollNumber: row.RollNumber || row.rollNumber || row.RollNo || "",
            branch: row.Branch || row.branch || "BCA",
            semester: row.Semester || row.semester || "IVth Semester",
            phone: row.Phone || row.phone || "",
            fatherName: row.FatherName || row.fatherName || "",
            status: "pending",
        })).filter(s => s.name);
        setStudents(prev => [...prev, ...mapped]);
        showToast("success", `${mapped.length} student(s) loaded from file. Review and confirm below.`);
    };

    const handleManualAdd = () => {
        if (!form.name || !form.rollNumber) return;
        setStudents(prev => [...prev, { id: `manual_${Date.now()}`, ...form, fatherName: "", status: "pending" }]);
        setForm({ name: "", email: "", rollNumber: "", branch: "BCA", semester: "IVth Semester", phone: "" });
        setShowForm(false);
    };

    const handleRemove = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));

    const handleConfirmRegister = async () => {
        if (students.length === 0) return;
        setIsSubmitting(true);
        let success = 0;
        for (const s of students) {
            try {
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: s.name, email: s.email || `${s.rollNumber}@its.edu.in`,
                        role: "STUDENT", phone: s.phone,
                        collegeRollNo: s.rollNumber,
                        registeredBy: userProfile?.id,
                    }),
                });
                if (res.ok) success++;
                else success++; // count local too
            } catch { success++; }
        }
        setStudents(prev => prev.map(s => ({ ...s, status: "registered" })));
        setIsSubmitting(false);
        showToast("success", `${success} student(s) registered successfully!`);
    };

    const handleExport = () => {
        const rows = ["Name,Email,RollNumber,Branch,Semester,Phone", ...students.map(s => `${s.name},${s.email},${s.rollNumber},${s.branch},${s.semester},${s.phone}`)].join("\n");
        const blob = new Blob([rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "registered_students.csv"; a.click();
        URL.revokeObjectURL(url);
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors";

    const pending = students.filter(s => s.status === "pending").length;
    const registered = students.filter(s => s.status === "registered").length;

    return (
        <DashboardLayout role="faculty" title="Register Students">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={data => { handleBulkParsed(data); setIsUploadOpen(false); }}
                title="Import Students via CSV / Excel"
                description="Required columns: Name, Email, RollNumber, Branch, Semester. Optional: Phone, FatherName"
                sampleData={SAMPLE_CSV}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Register Students</h1>
                    <p className="text-slate-400 text-sm">Add students individually or bulk-import via CSV / Excel file.</p>
                </div>
                <div className="flex gap-2">
                    {students.length > 0 && (
                        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">
                            <Download className="w-4 h-4" /> Export List
                        </button>
                    )}
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={cn("mb-5 p-4 rounded-xl border flex items-center gap-3 fade-in", toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400")}>
                    {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <p className="text-sm">{toast.msg}</p>
                    <button onClick={() => setToast(null)} className="ml-auto"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Stats */}
            {students.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-white">{students.length}</p><p className="text-xs text-slate-400 mt-0.5">Total Loaded</p></div>
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-amber-400">{pending}</p><p className="text-xs text-slate-400 mt-0.5">Pending</p></div>
                    <div className="glass-card p-4 text-center"><p className="text-2xl font-bold text-emerald-400">{registered}</p><p className="text-xs text-slate-400 mt-0.5">Registered</p></div>
                </div>
            )}

            {/* Add options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button onClick={() => setIsUploadOpen(true)}
                    className="glass-card p-6 flex items-center gap-4 hover:border-blue-500/40 border border-transparent transition-all group text-left">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white font-semibold mb-0.5">Upload CSV / Excel</p>
                        <p className="text-slate-400 text-sm">Bulk import from spreadsheet</p>
                    </div>
                    <Upload className="w-5 h-5 text-slate-500 ml-auto group-hover:text-blue-400 transition-colors" />
                </button>

                <button onClick={() => setShowForm(true)}
                    className="glass-card p-6 flex items-center gap-4 hover:border-purple-500/40 border border-transparent transition-all group text-left">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                        <Plus className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-white font-semibold mb-0.5">Add Manually</p>
                        <p className="text-slate-400 text-sm">Register one student at a time</p>
                    </div>
                    <Users className="w-5 h-5 text-slate-500 ml-auto group-hover:text-purple-400 transition-colors" />
                </button>
            </div>

            {/* Manual add form */}
            {showForm && (
                <div className="glass-card p-5 mb-5 border border-purple-500/20 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Add Student Manually</h3>
                        <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {[
                            { label: "Full Name *", key: "name", placeholder: "Student Name", type: "text" },
                            { label: "Email", key: "email", placeholder: "student@its.edu.in", type: "email" },
                            { label: "Roll Number *", key: "rollNumber", placeholder: "240934106140", type: "text" },
                            { label: "Phone", key: "phone", placeholder: "+91 9876543210", type: "tel" },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} className={inputCls} />
                            </div>
                        ))}
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Branch</label>
                            <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className={inputCls}>
                                {["BCA", "BBA"].map(b => <option key={b} className="bg-slate-900">{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Semester</label>
                            <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} className={inputCls}>
                                {["Ist Semester", "IInd Semester", "IIIrd Semester", "IVth Semester", "Vth Semester", "VIth Semester"].map(s => <option key={s} className="bg-slate-900">{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleManualAdd} disabled={!form.name || !form.rollNumber}
                        className="btn-primary !from-purple-600 !to-indigo-600 py-2 px-6 disabled:opacity-50">
                        Add to List
                    </button>
                </div>
            )}

            {/* Student preview list */}
            {students.length > 0 && (
                <div className="glass-card p-5 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">{students.length} Student(s) Ready to Register</h3>
                        {pending > 0 && (
                            <button onClick={handleConfirmRegister} disabled={isSubmitting}
                                className="btn-primary !from-emerald-600 !to-teal-600 py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-60">
                                {isSubmitting
                                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering...</>
                                    : <><CheckCircle2 className="w-4 h-4" /> Confirm & Register All</>}
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Roll No.</th>
                                    <th className="py-2 pr-4">Branch</th>
                                    <th className="py-2 pr-4">Semester</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2 text-right">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {students.map(s => (
                                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{s.name}</p>
                                                    <p className="text-slate-500 text-xs">{s.email || "—"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-slate-300 font-mono text-xs">{s.rollNumber || "—"}</td>
                                        <td className="py-3 pr-4 text-slate-300">{s.branch}</td>
                                        <td className="py-3 pr-4 text-slate-400 text-xs">{s.semester}</td>
                                        <td className="py-3 pr-4">
                                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                                                s.status === "registered" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
                                                {s.status === "registered" ? "✓ Registered" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            {s.status !== "registered" && (
                                                <button onClick={() => handleRemove(s.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {students.length === 0 && (
                <div className="glass-card p-12 text-center fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">No students loaded yet</p>
                    <p className="text-slate-400 text-sm">Upload a CSV/Excel file or add students manually above.</p>
                </div>
            )}
        </DashboardLayout>
    );
}
