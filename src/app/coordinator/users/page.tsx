"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Search, Plus, Filter, Edit2, Trash2, Mail, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { BulkUploadDialog } from "@/components/ui/BulkUploadDialog";
import { exportData } from "@/lib/utils";

const DEMO_ALL_USERS = [
    { id: 1, name: "Arjun Sharma", role: "Student", dept: "CSE", status: "Active", email: "student@college.edu", joined: "Aug 2024" },
    { id: 2, name: "Priya Patel", role: "Student", dept: "CSE", status: "Active", email: "priya@college.edu", joined: "Aug 2024" },
    { id: 3, name: "Dr. Priya Mehta", role: "Faculty", dept: "CSE", status: "Active", email: "faculty@college.edu", joined: "Jan 2020" },
    { id: 4, name: "Prof. Rajan Kumar", role: "Faculty", dept: "ECE", status: "On Leave", email: "rajan@college.edu", joined: "Jul 2018" },
    { id: 5, name: "Rahul Verma", role: "Student", dept: "IT", status: "Suspended", email: "rahul@college.edu", joined: "Aug 2023" },
];

const UserRow = React.memo(({ user, onEdit, onDelete }: { user: typeof DEMO_ALL_USERS[0], onEdit: (user: typeof DEMO_ALL_USERS[0]) => void, onDelete: (id: number) => void }) => {
    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-1.5">
                    <Users className={`w-3.5 h-3.5 ${user.role === 'Student' ? 'text-blue-400' : 'text-purple-400'}`} />
                    <span className="text-slate-300">{user.role}</span>
                </div>
            </td>
            <td className="p-4 text-slate-300">{user.dept}</td>
            <td className="p-4">
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    user.status === 'On Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {user.status}
                </span>
            </td>
            <td className="p-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Message">
                        <Mail className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(user)} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(user.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
});
UserRow.displayName = "UserRow";

export default function ManageUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [users, setUsers] = useState(DEMO_ALL_USERS);
    const [editingUser, setEditingUser] = useState<typeof DEMO_ALL_USERS[0] | null>(null);

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; details?: { added: number } } | null>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "All" || user.role === activeTab;
        return matchesSearch && matchesTab;
    });

    const handleDelete = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setEditingUser(null);
    };

    const handleBulkUpload = (data: any[]) => {
        // Basic mapping for demo purposes
        const newUsers = data.map((row, i) => ({
            id: Date.now() + i,
            name: row.name || row.Name || "Unknown",
            role: row.role || row.Role || "Student",
            dept: row.dept || row.Department || "Unknown",
            status: row.status || row.Status || "Active",
            email: row.email || row.Email || "unknown@college.edu",
            joined: "Just now"
        }));

        setUsers([...newUsers, ...users]);
        setUploadResult({
            success: true,
            message: "Bulk Upload Successful!",
            details: { added: newUsers.length }
        });
    };

    return (
        <DashboardLayout role="coordinator" title="Manage Users">
            <BulkUploadDialog
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleBulkUpload}
                title="Upload Users"
                description="Upload a CSV or Excel file containing user details."
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
                    <p className="text-slate-400 text-sm">View, add, and manage all students and faculty in the system.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => exportData(users, "users_export")}
                        className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
                    >
                        <Upload className="w-4 h-4 rotate-180" /> Export Users
                    </button>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="btn-secondary flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all"
                    >
                        <Upload className="w-4 h-4" /> Import Users
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New User
                    </button>
                </div>
            </div>

            {/* Upload Notification */}
            {uploadResult && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 fade-in ${uploadResult.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}>
                    {uploadResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                    <div>
                        <h4 className="font-semibold">{uploadResult.message}</h4>
                        {uploadResult.details && (
                            <p className="text-sm mt-1 opacity-90">
                                {uploadResult.details.added} new users added to the directory.
                            </p>
                        )}
                    </div>
                    <button onClick={() => setUploadResult(null)} className="ml-auto text-current opacity-70 hover:opacity-100 p-1">
                        &times;
                    </button>
                </div>
            )}

            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Name</label>
                                <input required type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Email</label>
                                <input required type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Role</label>
                                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm">
                                        <option value="Student" className="bg-slate-900">Student</option>
                                        <option value="Faculty" className="bg-slate-900">Faculty</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Department</label>
                                    <input required type="text" value={editingUser.dept} onChange={e => setEditingUser({ ...editingUser, dept: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Status</label>
                                <select value={editingUser.status} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm">
                                    <option value="Active" className="bg-slate-900">Active</option>
                                    <option value="On Leave" className="bg-slate-900">On Leave</option>
                                    <option value="Suspended" className="bg-slate-900">Suspended</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors text-sm font-medium">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary py-2 px-6">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-card p-6 fade-in" style={{ animationDelay: "100ms" }}>
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
                        {["All", "Student", "Faculty"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab ? "bg-blue-600/20 text-blue-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-full md:w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Department</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredUsers.map((user) => (
                                <UserRow key={user.id} user={user} onEdit={setEditingUser} onDelete={handleDelete} />
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="py-12 text-center text-slate-400">
                            No users found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

