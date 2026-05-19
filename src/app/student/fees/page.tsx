"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CreditCard, Download, ExternalLink, CheckCircle, X, Building2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { DEMO_FEES } from "@/lib/demo-data";

function FeesSkeleton() {
    return (
        <>
            {/* Top stats skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 fade-in">
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card p-6 flex flex-col justify-center items-center text-center animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-white/10 mb-3" />
                        <div className="h-3 w-24 bg-white/10 rounded mb-2" />
                        <div className="h-8 w-32 bg-white/10 rounded" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 animate-pulse">
                    <div className="h-4 w-32 bg-white/10 rounded mb-6" />
                    <div className="w-40 h-40 rounded-full bg-white/10 mx-auto mb-6" />
                    <div className="space-y-3">
                        <div className="h-3 w-full bg-white/10 rounded" />
                        <div className="h-3 w-full bg-white/10 rounded" />
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card p-5 animate-pulse flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-40 bg-white/10 rounded" />
                                <div className="h-3 w-28 bg-white/10 rounded" />
                            </div>
                            <div className="h-6 w-20 bg-white/10 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default function StudentFeesPage() {
    const { userProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [showPayModal, setShowPayModal] = useState(false);
    const [fees, setFees] = useState({
        totalTuition: DEMO_FEES.totalTuition,
        paid: DEMO_FEES.paid,
        pending: DEMO_FEES.pending,
        dueDate: DEMO_FEES.dueDate,
        transactions: DEMO_FEES.transactions as any[]
    });

    useEffect(() => {
        if (!userProfile?.id) {
            setIsLoading(false);
            return;
        }
        const fetchFees = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/fees?firebaseId=${userProfile.id}`);
                const json = await res.json();
                if (json.success && json.data.totalTuition > 0) {
                    setFees(json.data);
                }
                // else keep DEMO_FEES defaults
            } catch (err) {
                console.error(err);
                // keep DEMO_FEES defaults on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchFees();
    }, [userProfile?.id]);

    if (isLoading) {
        return (
            <DashboardLayout role="student" title="Fee Management">
                <div className="page-header">Tuition &amp; Fees</div>
                <p className="page-subheader">Track your campus dues and payment history</p>
                <FeesSkeleton />
            </DashboardLayout>
        );
    }

    const { totalTuition, paid, pending, dueDate, transactions } = fees;
    const progress = totalTuition > 0 ? Math.round((paid / totalTuition) * 100) : 0;
    const dashLen = 2 * Math.PI * 15.9; // cicumference of r=15.9

    return (
        <DashboardLayout role="student" title="Fee Management">
            <div className="page-header">Tuition &amp; Fees</div>
            <p className="page-subheader">Track your campus dues and payment history</p>

            {/* Top Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 fade-in">
                <div className="glass-card p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                        <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Total Semester Fee</p>
                    <p className="text-3xl font-bold text-white mt-1">₹{totalTuition.toLocaleString()}</p>
                </div>
                <div className="glass-card p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Amount Paid</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">₹{paid.toLocaleString()}</p>
                </div>
                <div className="glass-card p-6 flex flex-col justify-center items-center text-center bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/20">
                    <p className="text-amber-400 text-sm font-medium">Pending Dues</p>
                    <p className="text-4xl font-bold text-amber-500 mt-2">₹{pending.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-2">Due by {formatDate(dueDate)}</p>
                    {pending > 0 && (
                        <button
                            onClick={() => setShowPayModal(true)}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/20 transition-all text-sm w-full">
                            Pay Now
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Overview */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24 fade-in">
                        <h3 className="text-white font-semibold mb-6">Payment Overview</h3>
                        <div className="relative w-40 h-40 mx-auto mb-6 flex-shrink-0 drop-shadow-lg">
                            <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                <circle
                                    cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                                    strokeDasharray={`${(progress / 100) * dashLen} ${dashLen}`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                />
                            </svg>
                            <span className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-2xl">{progress}%</span>
                                <span className="text-xs text-emerald-400">Cleared</span>
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tuition Fee</span>
                                <span className="text-white font-medium">₹{totalTuition.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Library / Lab</span>
                                <span className="text-white font-medium">Included</span>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex justify-between font-semibold">
                                <span className="text-white">Amount Cleared</span>
                                <span className="text-emerald-400">₹{paid.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2">
                    <h3 className="text-white font-semibold mb-4 fade-in">Transaction History</h3>
                    <div className="space-y-3 fade-in">
                        {transactions.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 border border-white/5 rounded-2xl bg-white/5">
                                No fee transactions found.
                            </div>
                        ) : (
                            transactions.map(txn => (
                                <div key={txn.id} className="glass-card p-5 hover:border-white/20 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-base">{txn.semester} Tuition</p>
                                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                                <span>{formatDate(txn.date)}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                <span>{txn.method}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                                        <span className="text-lg font-bold text-white">₹{txn.amount.toLocaleString()}</span>
                                        <button
                                            onClick={() => {
                                                const content = [
                                                    "ITS GHAZIABAD — OFFICIAL FEE RECEIPT",
                                                    "=".repeat(40),
                                                    `Student: ${userProfile?.name || "Student"}`,
                                                    `Roll No: ${userProfile?.rollNumber || "—"}`,
                                                    `Semester: ${txn.semester}`,
                                                    `Date: ${formatDate(txn.date)}`,
                                                    `Method: ${txn.method}`,
                                                    `Amount: Rs. ${txn.amount.toLocaleString()}`,
                                                    `Status: ${txn.status.toUpperCase()}`,
                                                    `Receipt ID: ${txn.id}`,
                                                    "=".repeat(40),
                                                    "This is a computer-generated receipt.",
                                                ].join("\n");
                                                const blob = new Blob([content], { type: "text/plain" });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement("a");
                                                a.href = url;
                                                a.download = `receipt_${txn.id}.txt`;
                                                a.click();
                                                URL.revokeObjectURL(url);
                                            }}
                                            className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 mt-1 transition-colors">
                                            <Download className="w-3.5 h-3.5" /> Receipt
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3">
                        <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-400">
                            <p className="text-white font-medium mb-1">Payment Policies</p>
                            Fees are non-refundable after the first 14 days of the semester. Late fee of ₹500/week applies after the due date. Contact accounts@college.edu for discrepancies.
                        </div>
                    </div>
                </div>
            </div>
            {/* Pay Now Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPayModal(false)}>
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-amber-400" /> Fee Payment
                            </h3>
                            <button onClick={() => setShowPayModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm mb-5">
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 font-semibold mb-1">Amount Due</p>
                                <p className="text-3xl font-bold text-white">₹{pending.toLocaleString()}</p>
                                <p className="text-slate-400 text-xs mt-1">Due by {formatDate(dueDate)}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Bank Transfer Details</p>
                                <div className="flex justify-between"><span className="text-slate-400">Bank</span><span className="text-white font-medium">Punjab National Bank</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Account No.</span><span className="text-white font-mono">50100123456789</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">IFSC</span><span className="text-white font-mono">PUNB0123456</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-white font-medium">ITS Ghaziabad</span></div>
                            </div>
                            <p className="text-xs text-slate-500 text-center">After payment, email the UTR reference to <span className="text-blue-400">accounts@its.edu.in</span></p>
                        </div>
                        <button onClick={() => setShowPayModal(false)} className="w-full btn-primary py-2.5">Close</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
