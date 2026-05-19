"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Search, Plus, Filter, Upload, AlertCircle, CheckCircle2, X, Download, FileSpreadsheet } from "lucide-react";
import React, { useState, useEffect } from "react";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";
import { exportData } from "@/lib/utils";
import { DEMO_ALL_STUDENTS, DEMO_FACULTY_USERS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type RoleTab = "All" | "Student" | "Faculty" | "Coordinator";

function Avatar({ name, role }: { name: string; role: string }) {
    const colors: Record<string, string> = {
        Student: "from-blue-600 to-cyan-600",
        Faculty: "from-purple-600 to-indigo-600",
        Coordinator: "from-emerald-600 to-teal-600",
    };
    return (
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[role] || "from-slate-600 to-slate-700"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {name.charAt(0)}
        </div>
    );
}

const STUDENT_SAMPLE = `Name,Email,RollNumber,Branch,Semester,Phone
Ravi Kumar,ravi.kumar@its.edu.in,240934106140,BCA,IInd Year - IVth Semester,+91 9876543210
Pooja Sharma,pooja.sharma@its.edu.in,240934106141,BCA,Ist Year - Ist Semester,+91 9765432109
Rahul Singh,rahul.singh@its.edu.in,240934200105,BBA,IInd Year - IIIrd Semester,+91 9654321098
Ankita Rao,ankita.rao@its.edu.in,240934200106,BBA,IIIrd Year - VIth Semester,+91 9543210987`;

const FACULTY_SAMPLE = `Name,Email,Department,Phone,Subjects
Dr. Rajesh Gupta,rajesh.gupta@its.edu.in,Computer Science,+91 9811223344,"Python, AI & Machine Learning"
Prof. Sunita Verma,sunita.verma@its.edu.in,Management,+91 9922334455,"Marketing Management, Consumer Behavior"`;

export default function ManageUsersPage() {
    const [activeTab, setActiveTab] = useState<RoleTab>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const defaultUsers = [
        ...DEMO_ALL_STUDENTS.map(s => ({ id: s.id, name: s.name, email: s.email, role: "Student", status: s.status, dept: s.branch, rollNumber: s.rollNumber })),
        ...DEMO_FACULTY_USERS.map(f => ({ id: f.id, name: f.name, email: f.email, role: "Faculty", status: f.status, dept: f.department, rollNumber: "" })),
        { id: "coord1", name: "Mr. Anil Kapoor", email: "coordinator@college.edu", role: "Coordinator", status: "Active", dept: "Administration", rollNumber: "" },
    ];

    const [users, setUsers] = useState<any[]>(defaultUsers);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);

    // Upload dialogs
    const [uploadType, setUploadType] = useState<"student" | "faculty" | null>(null);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

    // Add coordinator form
    const [showAddCoord, setShowAddCoord] = useState(false);
    const [coordForm, setCoordForm] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        fetch("/api/users").then(r => r.json()).then(json => {
            if (json.success && json.data.length > 0) {
                const mapped = json.data.map((u: any) => ({
                    id: u.id, name: u.name, email: u.email,
                    role: u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase() : "Student",
                    status: "Active", dept: u.department?.name || u.collegeRollNo || "—", rollNumber: u.collegeRollNo || ""
                }));
                setUsers(mapped);
            }
        }).catch(() => {});
    }, []);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchTab = activeTab === "All" || u.role === activeTab;
        const matchStatus = statusFilter === "All" || u.status === statusFilter;
        return matchSearch && matchTab && matchStatus;
    });

    const counts = { All: users.length, Student: users.filter(u => u.role === "Student").length, Faculty: users.filter(u => u.role === "Faculty").length, Coordinator: users.filter(u => u.role === "Coordinator").length };

    const handleBulkUpload = async (data: any[], role: "STUDENT" | "FACULTY") => {
        const newUsers: any[] = [];
        for (const row of data) {
            const name = row.Name || row.name || "";
            const email = row.Email || row.email || `${Date.now()}@its.edu.in`;
            const dept = row.Department || row.department || row.Branch || row.branch || "General";
            const roll = row.RollNumber || row.rollNumber || row.RollNo || "";
            const phone = row.Phone || row.phone || "";
            const subjects = row.Subjects || row.subjects || "";

            try {
                await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, role, phone, collegeRollNo: roll }),
                });
            } catch { /* offline — add locally */ }

            newUsers.push({
                id: `local_${Date.now()}_${Math.random()}`,
                name, email, dept, rollNumber: roll, phone,
                role: role === "STUDENT" ? "Student" : "Faculty",
                status: "Active",
                subjects: subjects ? subjects.split(",").map((s: string) => s.trim()) : []
            });
        }
        setUsers(prev => [...newUsers, ...prev]);
        setUploadResult({ success: true, message: `${newUsers.length} ${role === "STUDENT" ? "student" : "faculty"} record(s) added successfully!`, count: newUsers.length });
        setTimeout(() => setUploadResult(null), 5000);
    };

    const handleAddCoordinator = () => {
        if (!coordForm.name || !coordForm.email) return;
        const newCoord = { id: `coord_${Date.now()}`, ...coordForm, role: "Coordinator", status: "Active", dept: "Administration", rollNumber: "" };
        // Save to localStorage for login
        const existing = JSON.parse(localStorage.getItem("registered_coordinators") || "[]");
        existing.push({ uid: newCoord.id, email: coordForm.email, password: "coord@123", role: "coordinator", name: coordForm.name, phone: coordForm.phone });
        localStorage.setItem("registered_coordinators", JSON.stringify(existing));
        setUsers(prev => [newCoord, ...prev]);
        setCoordForm({ name: "", email: "", phone: "" });
        setShowAddCoord(false);
        setUploadResult({ success: true, message: `Coordinator "${newCoord.name}" added! Default password: coord@123`, count: 1 });
        setTimeout(() => setUploadResult(null), 6000);
    };

    const handleDelete = (id: string) => {
        fetch(`/api/users/${id}`, { method: "DELETE" }).catch(() => {});
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors";

    return (
        <DashboardLayout role="coordinator" title="Manage Users">
            {/* Bulk Upload Dialogs */}
            <BulkUploadDialog
                isOpen={uploadType === "student"}
                onClose={() => setUploadType(null)}
                onUpload={data => { handleBulkUpload(data, "STUDENT"); setUploadType(null); }}
                title="Import Students via CSV / Excel"
                description="Upload a file with columns: Name, Email, RollNumber, Branch, Semester, Phone"
                sampleData={STUDENT_SAMPLE}
            />
            <BulkUploadDialog
                isOpen={uploadType === "faculty"}
                onClose={() => setUploadType(null)}
                onUpload={data => { handleBulkUpload(data, "FACULTY"); setUploadType(null); }}
                title="Import Faculty via CSV / Excel"
                description="Upload a file with columns: Name, Email, Department, Phone, Subjects"
                sampleData={FACULTY_SAMPLE}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
                    <p className="text-slate-400 text-sm">Add, import, and manage all users in the system.</p>
                </div>
                <button onClick={() => exportData(users, "users_export")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">
                    <Download className="w-4 h-4" /> Export All
                </button>
            </div>

            {/* Upload result toast */}
            {uploadResult && (
                <div className={cn("mb-5 p-4 rounded-xl border flex items-start gap-3 fade-in", uploadResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400")}>
                    {uploadResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                    <p className="text-sm font-medium">{uploadResult.message}</p>
                    <button onClick={() => setUploadResult(null)} className="ml-auto"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Action cards — 3 quick-register options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Register Students via CSV */}
                <div className="glass-card p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><FileSpreadsheet className="w-5 h-5 text-blue-400" /></div>
                        <div><p className="text-white font-semibold text-sm">Register Students</p><p className="text-slate-500 text-xs">Bulk via CSV / Excel</p></div>
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Upload a spreadsheet with student details. Required: Name, Email, RollNumber, Branch.</p>
                    <button onClick={() => setUploadType("student")} className="w-full py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" /> Upload File
                    </button>
                </div>

                {/* Register Faculty via CSV */}
                <div className="glass-card p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Users className="w-5 h-5 text-purple-400" /></div>
                        <div><p className="text-white font-semibold text-sm">Register Faculty</p><p className="text-slate-500 text-xs">Individual or Bulk CSV</p></div>
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Import faculty with Name, Email, Department, Phone and Subject assignments.</p>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditingUser({ id: "", name: "", email: "", role: "Faculty", status: "Active", dept: "Computer Science" }); setIsNewUser(true); }}
                            className="flex-1 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-medium hover:bg-purple-600/30 transition-colors flex items-center justify-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add One
                        </button>
                        <button onClick={() => setUploadType("faculty")}
                            className="flex-1 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-medium hover:bg-purple-600/30 transition-colors flex items-center justify-center gap-1">
                            <Upload className="w-3.5 h-3.5" /> CSV
                        </button>
                    </div>
                </div>

                {/* Add Coordinator */}
                <div className="glass-card p-5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Plus className="w-5 h-5 text-emerald-400" /></div>
                        <div><p className="text-white font-semibold text-sm">Add Coordinator</p><p className="text-slate-500 text-xs">Admin-level account</p></div>
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Create a new coordinator account with full platform management rights.</p>
                    <button onClick={() => setShowAddCoord(true)} className="w-full py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> New Coordinator
                    </button>
                </div>
            </div>

            {/* User table */}
            <div className="glass-card p-6 fade-in">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
                    {/* Role tabs */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit flex-wrap gap-1">
                        {(["All", "Student", "Faculty", "Coordinator"] as RoleTab[]).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                    activeTab === tab ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:text-white hover:bg-white/5")}>
                                {tab} <span className="text-xs opacity-60">({counts[tab]})</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-56 transition-all" />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-400 text-sm focus:outline-none">
                            {["All", "Active", "Inactive", "On Leave"].map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">Role</th>
                                <th className="p-3 font-medium">Dept / Branch</th>
                                <th className="p-3 font-medium">Roll / ID</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                            {filtered.map(user => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={user.name} role={user.role} />
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-slate-500 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border",
                                            user.role === "Student" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                            user.role === "Faculty" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-300 text-sm">{user.dept}</td>
                                    <td className="p-3 text-slate-400 text-xs font-mono">{user.rollNumber || "—"}</td>
                                    <td className="p-3">
                                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                                            user.status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                                            user.status === "On Leave" ? "bg-amber-500/10 text-amber-400" :
                                            "bg-red-500/10 text-red-400")}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleDelete(user.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="py-12 text-center text-slate-400">No users found.</div>}
                </div>
            </div>

            {/* Add single user modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">{isNewUser ? `Add ${editingUser.role}` : "Edit User"}</h3>
                            <button onClick={() => setEditingUser(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={e => {
                            e.preventDefault();
                            const nu = { ...editingUser, id: `local_${Date.now()}` };
                            fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nu.name, email: nu.email, role: nu.role.toUpperCase(), phone: nu.phone || "" }) }).catch(() => {});
                            setUsers(prev => [nu, ...prev]);
                            setEditingUser(null);
                            setIsNewUser(false);
                        }} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                                <input required value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Email</label>
                                <input required type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Role</label>
                                    <select value={editingUser.role} onChange={e => {
                                        const newRole = e.target.value;
                                        setEditingUser({ 
                                            ...editingUser, 
                                            role: newRole,
                                            dept: newRole === 'Student' ? 'BCA' : 'Computer Science' 
                                        });
                                    }} className={inputCls}>
                                        <option className="bg-slate-900">Student</option>
                                        <option className="bg-slate-900">Faculty</option>
                                        <option className="bg-slate-900">Coordinator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">{editingUser.role === 'Student' ? 'Branch' : 'Department'}</label>
                                    {editingUser.role === 'Student' ? (
                                        <select value={editingUser.dept} onChange={e => setEditingUser({ ...editingUser, dept: e.target.value })} className={inputCls}>
                                            {["BCA", "BBA"].map(b => <option key={b} className="bg-slate-900">{b}</option>)}
                                        </select>
                                    ) : (
                                        <input value={editingUser.dept} onChange={e => setEditingUser({ ...editingUser, dept: e.target.value })} className={inputCls} />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                                <button type="submit" className="btn-primary py-2 px-6">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Coordinator modal */}
            {showAddCoord && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Add New Coordinator</h3>
                            <button onClick={() => setShowAddCoord(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs mb-4">
                            ⚠️ Default login password will be <span className="font-mono font-bold">coord@123</span> — advise the coordinator to change it after first login.
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                                <input value={coordForm.name} onChange={e => setCoordForm({ ...coordForm, name: e.target.value })} placeholder="Dr. First Last" className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Email</label>
                                <input type="email" value={coordForm.email} onChange={e => setCoordForm({ ...coordForm, email: e.target.value })} placeholder="coord@its.edu.in" className={inputCls} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Phone (optional)</label>
                                <input value={coordForm.phone} onChange={e => setCoordForm({ ...coordForm, phone: e.target.value })} placeholder="+91 9876543210" className={inputCls} />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowAddCoord(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                                <button onClick={handleAddCoordinator} disabled={!coordForm.name || !coordForm.email}
                                    className="btn-primary !from-emerald-600 !to-teal-600 py-2 px-6 disabled:opacity-50">
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
