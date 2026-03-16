"use client";

import { useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { Printer, Download, CreditCard, Award, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import QRCode from "react-qr-code";
import { formatDate } from "@/lib/utils";

export default function IDCardPage() {
    const { userProfile } = useAuth();
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    if (!userProfile) return null;

    // Simulate course based on role, department etc.
    const course = userProfile.role === 'student' ? 'BCA - Bachelor of Computer Applications' : 'Faculty Member';
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + (userProfile.role === 'student' ? 4 : 1));

    return (
        <DashboardLayout role="student" title="Digital ID Card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold t-heading mb-1 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-indigo-500" />
                        Digital Identity Card
                    </h1>
                    <p className="t-muted text-sm font-medium">Your official digital campus identity. Safe to print or download.</p>
                </div>
                <div className="flex items-center gap-3 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20 font-semibold"
                    >
                        <Printer className="w-4 h-4" /> Print ID Card
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-item)] border border-[var(--border-item)] t-heading rounded-xl transition-all hover:bg-[var(--bg-item-hover)] font-semibold"
                    >
                        <Download className="w-4 h-4" /> Save as Image
                    </button>
                </div>
            </div>

            {/* Print Layout Container */}
            <div className="flex justify-center md:justify-start">
                <div
                    ref={printRef}
                    className="relative w-[340px] h-[540px] bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:m-0 border border-slate-200"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-transparent"></div>

                    {/* Header Strip */}
                    <div className="bg-gradient-to-br from-indigo-800 to-blue-900 pt-5 pb-6 px-4 text-center text-white relative z-10 rounded-b-[40px] shadow-md border-b-4 border-emerald-500">
                        <h2 className="text-lg font-black uppercase tracking-widest text-slate-50 mb-0.5">Institute of Technology and Science</h2>
                        <p className="text-[10px] font-medium text-indigo-200 tracking-wide">Approved by AICTE, Affiliated to Chaudhary Charan Singh University (CCSU)</p>
                    </div>

                    {/* Photo Container */}
                    <div className="absolute top-[85px] left-1/2 -translate-x-1/2 z-20">
                        <div className="w-32 h-32 rounded-xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
                            {/* Placeholder for actual photo, using initial for now */}
                            <div className="text-4xl font-black text-slate-300">
                                {userProfile?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>

                    {/* Student Info Body */}
                    <div className="px-6 pt-[90px] pb-4 text-center relative z-10">
                        <h3 className="text-2xl font-black text-slate-800 leading-tight tracking-tight uppercase mb-1">{userProfile.name}</h3>
                        <p className="text-sm font-bold text-indigo-600 tracking-wide uppercase">{course}</p>

                        <div className="w-12 h-1 bg-emerald-500 mx-auto my-3 rounded-full"></div>

                        <div className="text-left space-y-2.5 mt-4">
                            <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-1">
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider flex justify-between w-[90px]">Roll No <span className="text-slate-400">:</span></span>
                                <span className="font-bold text-slate-800 tracking-wide">{userProfile.collegeRollNo || userProfile.rollNumber}</span>
                            </div>
                            {userProfile.universityRollNo && (
                                <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-1">
                                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider flex justify-between w-[90px]">AKTU Roll <span className="text-slate-400">:</span></span>
                                    <span className="font-bold text-slate-800 tracking-wide">{userProfile.universityRollNo}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-1">
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider flex justify-between w-[90px]">DOB <span className="text-slate-400">:</span></span>
                                <span className="font-bold text-slate-800">{userProfile.dob ? formatDate(new Date(userProfile.dob).toISOString()) : "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-1">
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider flex justify-between w-[90px]">Blood Group <span className="text-slate-400">:</span></span>
                                <span className="font-bold text-red-600">O+</span> {/* Mocking blood group for aesthetic realism */}
                            </div>
                            <div className="flex items-center justify-between text-sm border-b border-slate-100 pb-1">
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider flex justify-between w-[90px]">Validity <span className="text-slate-400">:</span></span>
                                <span className="font-bold text-slate-800">{validUntil.getFullYear()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / QR layout */}
                    <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between items-end">
                        <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <QRCode
                                value={`https://college-management-flame.vercel.app/verify/${userProfile.rollNumber}`}
                                size={56}
                                level="M"
                            />
                        </div>
                        <div className="text-right">
                            <div className="w-16 h-8 border-b border-slate-400 border-dashed mx-auto mb-1"></div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Issuing Authority</p>
                        </div>
                    </div>

                    {/* Top Right small chip */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> STUDENT
                        </div>
                    </div>
                </div>
            </div>

            {/* Style definitions specifically for the printed output */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: auto;  margin: 0mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
        </DashboardLayout>
    );
}
