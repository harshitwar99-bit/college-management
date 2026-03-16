"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DEMO_FEES } from "@/lib/demo-data";
import { CreditCard, Download, ExternalLink, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentFeesPage() {
    const { totalTuition, paid, pending, dueDate, transactions } = DEMO_FEES;
    const progress = Math.round((paid / totalTuition) * 100);

    return (
        <DashboardLayout role="student" title="Fee Management">
            <div className="page-header">Tuition & Fees</div>
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
                        <button className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/20 transition-all text-sm w-full">
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
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                                    strokeDasharray={`${progress} ${100 - progress}`} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" />
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
                        {transactions.map(txn => (
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
                                    <button className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 mt-1 transition-colors">
                                        <Download className="w-3.5 h-3.5" /> Receipt
                                    </button>
                                </div>
                            </div>
                        ))}
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
        </DashboardLayout>
    );
}
