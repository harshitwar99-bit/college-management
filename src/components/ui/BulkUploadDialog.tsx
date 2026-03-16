"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileType, CheckCircle, AlertTriangle, X } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface BulkUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (data: any[]) => void;
    title?: string;
    description?: string;
    sampleData?: string;
}

export function BulkUploadDialog({
    isOpen,
    onClose,
    onUpload,
    title = "Bulk Upload Data",
    description = "Upload a CSV or Excel file to import multiple records at once.",
    sampleData = "Name, Email, Role\nJohn Doe, john@example.com, Student"
}: BulkUploadDialogProps) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const processFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setParsedData([]);
        setIsParsing(true);

        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();

        try {
            if (fileExt === 'csv') {
                Papa.parse(selectedFile, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors.length > 0 && results.data.length === 0) {
                            setError("Failed to parse CSV file properly.");
                        } else {
                            setParsedData(results.data);
                        }
                        setIsParsing(false);
                    },
                    error: (err) => {
                        setError(err.message);
                        setIsParsing(false);
                    }
                });
            } else if (fileExt === 'xlsx' || fileExt === 'xls') {
                const buffer = await selectedFile.arrayBuffer();
                const workbook = XLSX.read(buffer);
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                setParsedData(json);
                setIsParsing(false);
            } else {
                setError("Unsupported file format. Please upload CSV or Excel files only.");
                setIsParsing(false);
            }
        } catch (err: any) {
            setError(`Error processing file: ${err.message || 'Unknown error'}`);
            setIsParsing(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleConfirm = () => {
        if (parsedData.length > 0) {
            onUpload(parsedData);
            handleReset();
            onClose();
        }
    };

    const handleReset = () => {
        setFile(null);
        setParsedData([]);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDownloadSample = () => {
        const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "sample_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in">
            <div className="bg-white dark:bg-[#0e1b2e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
                    <h2 className="text-lg font-semibold t-heading">{title}</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!file ? (
                        <>
                            <p className="t-muted text-sm mb-6">{description}</p>

                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]
                                ${dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-inner">
                                    <UploadCloud className="w-7 h-7" />
                                </div>
                                <p className="t-heading font-medium text-base mb-1">Click to upload or drag & drop</p>
                                <p className="t-muted text-xs">CSV, XLS, or XLSX files only</p>
                            </div>

                            <button onClick={handleDownloadSample} className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 font-medium w-full justify-center">
                                <FileType className="w-4 h-4" /> Download Sample Template
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                                    <FileType className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="t-heading font-medium text-sm truncate">{file.name}</p>
                                    <p className="t-muted text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button onClick={handleReset} className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {isParsing && (
                                <div className="mt-6 flex flex-col items-center justify-center py-6 text-center">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                    <p className="t-muted text-sm animate-pulse">Scanning and extracting rows...</p>
                                </div>
                            )}

                            {!isParsing && error && (
                                <div className="mt-4 p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-rose-800 dark:text-rose-400 text-sm font-medium">Upload Error</p>
                                        <p className="text-rose-600 dark:text-rose-300/80 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {!isParsing && !error && parsedData.length > 0 && (
                                <div className="mt-4 p-5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-emerald-800 dark:text-emerald-400 text-base font-medium">Ready to Import</p>
                                        <p className="text-emerald-600 dark:text-emerald-400/80 text-sm mt-1">Successfully extracted <strong>{parsedData.length}</strong> valid rows from the file.</p>

                                        {/* Snippet preview */}
                                        <div className="mt-3 p-3 rounded-lg bg-emerald-100/50 dark:bg-black/20 border border-emerald-200/50 dark:border-white/5 overflow-x-auto">
                                            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono whitespace-pre opacity-80">
                                                {JSON.stringify(parsedData[0], null, 2).split('\n').slice(0, 4).join('\n')}
                                                {Object.keys(parsedData[0] || {}).length > 2 ? '\n  ...' : ''}
                                                {'\n}'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-medium t-muted hover:t-heading hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!file || isParsing || !!error || parsedData.length === 0}
                        className="btn-primary !py-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-none hover:shadow-lg disabled:hover:shadow-none transition-all flex items-center gap-2"
                    >
                        {isParsing ? 'Processing...' : `Import ${parsedData.length || ''} Records`}
                    </button>
                </div>

            </div>
        </div>
    );
}
