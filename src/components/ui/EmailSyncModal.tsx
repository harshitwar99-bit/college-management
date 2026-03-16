"use client";

import { useState } from "react";
import { Mail, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight, UploadCloud } from "lucide-react";
import { parseEmailText, syncEmailDataToFirebase, ParsedEmailResult } from "@/lib/emailParser";

interface EmailSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EmailSyncModal({ isOpen, onClose }: EmailSyncModalProps) {
    const [emailText, setEmailText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [parsedData, setParsedData] = useState<ParsedEmailResult | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleParse = async () => {
        if (!emailText.trim()) {
            setError("Please paste email content first.");
            return;
        }
        setError("");
        setIsParsing(true);
        // Simulate minor delay for "AI" feel
        setTimeout(async () => {
            try {
                const result = await parseEmailText(emailText);
                if (result.type === "unknown") {
                    setError("Could not automatically classify this email. Are you sure it contains a Notice or Timetable update?");
                } else {
                    setParsedData(result);
                }
            } catch (err: any) {
                setError(err.message || "Failed to parse email");
            } finally {
                setIsParsing(false);
            }
        }, 800);
    };

    const handleSync = async () => {
        if (!parsedData) return;
        setIsSyncing(true);
        setError("");
        try {
            await syncEmailDataToFirebase(parsedData);
            setSuccessMessage(`Successfully synced ${parsedData.type} to database!`);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to sync to database");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleClose = () => {
        setParsedData(null);
        setEmailText("");
        setSuccessMessage("");
        setError("");
        onClose();
    };

    // Auto-fill template for mock testing
    const fillMockNotice = () => {
        setEmailText("Subject: Tomorrow is declared a holiday\n\nDear Students,\nPlease be informed that tomorrow will be a holiday on account of the state festival. The college will remain closed. Normal classes will resume the day after.\n\nRegards,\nDean of Academics");
    };

    const fillMockTimetable = () => {
        setEmailText("Subject: Operating Systems class rescheduled\n\nAttention 4th Semester CS-A,\n\nThe Operating Systems lab originally scheduled for tomorrow morning is rescheduled to Thursday from 14:00 to 16:00 in Room 412. Please make a note of this change.\n\nProf. Sharma");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0e1b2e] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold t-heading">Smart Email Sync</h2>
                            <p className="text-xs t-muted">AI-powered extraction to live database</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 t-muted hover:t-heading hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {successMessage ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold t-heading mb-2">Sync Complete!</h3>
                            <p className="t-muted max-w-sm">{successMessage}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {!parsedData ? (
                                <div className="space-y-4 fade-in">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold t-heading">Paste Email Content</label>
                                        <div className="flex gap-2">
                                            <button onClick={fillMockNotice} className="text-xs text-blue-500 hover:text-blue-600 font-medium">Auto-fill Notice</button>
                                            <span className="t-muted text-xs">|</span>
                                            <button onClick={fillMockTimetable} className="text-xs text-blue-500 hover:text-blue-600 font-medium">Auto-fill Timetable</button>
                                        </div>
                                    </div>
                                    <textarea
                                        value={emailText}
                                        onChange={(e) => setEmailText(e.target.value)}
                                        placeholder="Paste the raw text of the email here..."
                                        className="w-full h-48 bg-[var(--bg-item)] border border-[var(--border-item)] rounded-xl p-4 t-heading placeholder:t-faint text-sm resize-none focus:outline-none focus:border-blue-500/50"
                                    />
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20">
                                            <AlertCircle className="w-4 h-4" /> {error}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6 fade-in">
                                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium text-sm bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Successfully identified as {parsedData.type.toUpperCase()} ({Math.round(parsedData.confidence * 100)}% Confidence)
                                    </div>

                                    <div className="bg-[var(--bg-item)] border border-[var(--border-item)] rounded-xl p-5">
                                        <h3 className="text-xs font-bold uppercase tracking-wider t-muted mb-4 border-b border-[var(--border-item)] pb-2 flex items-center gap-2">
                                            <UploadCloud className="w-4 h-4" /> Extracted Data Preview
                                        </h3>

                                        {parsedData.type === "notice" && (
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs t-muted mb-1">Title</p>
                                                    <p className="text-sm t-heading font-medium">{parsedData.data.title}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs t-muted mb-1">Category</p>
                                                        <p className="text-sm t-heading capitalize bg-white/5 inline-block px-2 py-1 rounded">{parsedData.data.type}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs t-muted mb-1">Author</p>
                                                        <p className="text-sm t-heading">{parsedData.data.author}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs t-muted mb-1">Body Summary</p>
                                                    <p className="text-sm t-body italic border-l-2 border-blue-500 pl-3 py-1 bg-white/5 rounded-r">{parsedData.data.body}</p>
                                                </div>
                                            </div>
                                        )}

                                        {parsedData.type === "timetable" && (
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs t-muted mb-1">Subject</p>
                                                    <p className="text-sm t-heading font-medium text-purple-500">{parsedData.data.update.subject}</p>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-xs t-muted mb-1">Target Day</p>
                                                        <p className="text-sm t-heading">{parsedData.data.day}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs t-muted mb-1">Time</p>
                                                        <p className="text-sm t-heading">{parsedData.data.update.time} - {parsedData.data.update.end}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs t-muted mb-1">Room</p>
                                                        <p className="text-sm t-heading">{parsedData.data.update.room}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!successMessage && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex justify-end gap-3">
                        <button onClick={handleClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold t-muted hover:t-heading hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            Cancel
                        </button>

                        {!parsedData ? (
                            <button
                                onClick={handleParse}
                                disabled={isParsing || !emailText.trim()}
                                className="btn-primary flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {isParsing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Parse Email <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        ) : (
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="btn-primary flex items-center justify-center gap-2 min-w-[140px] bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/25"
                            >
                                {isSyncing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sync to Database <UploadCloud className="w-4 h-4" /></>}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
