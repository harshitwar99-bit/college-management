"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Loader2, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface RollNoMapping {
    collegeRollNo: string;
    universityRollNo: string;
    dob?: string;
}

export default function SyncRollNoPage() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<RollNoMapping[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: "success" | "error" } | null>(null);

    const showToast = (title: string, desc: string, type: "success" | "error") => {
        setToastMessage({ title, desc, type });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            parseFile(e.target.files[0]);
        }
    };

    const parseFile = (file: File) => {
        const fileType = file.name.split(".").pop()?.toLowerCase();

        if (fileType === "csv") {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data as any[];
                    formatData(parsedData);
                },
                error: (error) => {
                    showToast("Error parsing CSV", error.message, "error");
                },
            });
        } else if (fileType === "xlsx" || fileType === "xls") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                formatData(jsonData);
            };
            reader.readAsBinaryString(file);
        } else {
            showToast("Invalid file type", "Please upload a .csv, .xls, or .xlsx file.", "error");
            setFile(null);
        }
    };

    const formatData = (rawData: any[]) => {
        const formattedData: RollNoMapping[] = rawData.map((row) => ({
            // Try to match variations of column names
            collegeRollNo: String(row.collegeRollNo || row.CollegeRollNo || row["College Roll No"] || row.CollegeRollNumber || ""),
            universityRollNo: String(row.universityRollNo || row.UniversityRollNo || row["University Roll No"] || row.UniversityRollNumber || ""),
            dob: row.dob || row.DOB || row["Date of Birth"] || ""
        })).filter(row => row.collegeRollNo && row.universityRollNo); // Filter out empty rows entirely

        setData(formattedData);

        if (formattedData.length === 0) {
            showToast("No valid data found", "Ensure your file has columns like 'CollegeRollNo' and 'UniversityRollNo', and no empty rows are present.", "error");
        }
    };

    const handleUpload = async () => {
        if (data.length === 0) {
            showToast("No data to sync", "Please upload a valid file containing mappings.", "error");
            return;
        }

        setIsUploading(true);

        try {
            const response = await fetch("/api/coordinator/sync-rollno", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mappings: data }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to sync roll numbers.");
            }

            showToast("Sync Successful", result.message, "success");

            if (result.errors && result.errors.length > 0) {
                console.error("Some records failed to update:", result.errors);
                showToast("Partial Sync", `Some records failed. Check console for details. (Updated ${result.updatedCount})`, "error");
            }

            setFile(null);
            setData([]);
        } catch (error: any) {
            showToast("Sync Failed", error.message, "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <DashboardLayout role="coordinator" title="Sync Roll Numbers">
            <div className="page-header">Sync Roll Numbers</div>
            <p className="page-subheader">Upload a CSV or Excel file to map college roll numbers to university roll numbers</p>

            {toastMessage && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg border z-50 transition-all ${toastMessage.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    }`}>
                    <h4 className="font-bold text-sm tracking-tight">{toastMessage.title}</h4>
                    <p className="text-sm mt-1">{toastMessage.desc}</p>
                </div>
            )}



            <div className="glass-card p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-bold t-heading">Upload Roll Number Mapping</h3>
                    <p className="text-sm t-muted mt-1">
                        Upload a CSV or Excel file containing student College Roll Numbers and University Roll Numbers.
                        Optionally include a DOB column.
                        <br />
                        Required Columns: <strong>CollegeRollNo</strong>, <strong>UniversityRollNo</strong>
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2 max-w-sm">
                        <label htmlFor="mapping-file" className="text-sm font-medium t-heading">Mapping File (.csv, .xlsx)</label>
                        <input
                            id="mapping-file"
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 border-[var(--border-item)] bg-[var(--bg-item)]"
                        />
                    </div>

                    {data.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-[var(--bg-item)] p-4 rounded-xl border border-[var(--border-item)]">
                                <span className="text-sm t-muted">
                                    Found <strong className="t-heading">{data.length}</strong> valid mappings in the file.
                                </span>
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Sync {data.length} Records
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="rounded-xl border border-[var(--border-item)] max-h-[400px] overflow-auto custom-scrollbar bg-[var(--bg-item)]">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-[var(--bg-item-hover)] t-muted border-b border-[var(--border-item)] sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">College Roll No</th>
                                            <th className="px-6 py-3 font-semibold">University Roll No</th>
                                            <th className="px-6 py-3 font-semibold">DOB (Optional)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-item)]">
                                        {data.slice(0, 100).map((row, index) => (
                                            <tr key={index} className="hover:bg-[var(--bg-item-hover)] transition-colors">
                                                <td className="px-6 py-4 t-heading font-medium">{row.collegeRollNo}</td>
                                                <td className="px-6 py-4 t-muted">{row.universityRollNo}</td>
                                                <td className="px-6 py-4 t-muted">{row.dob || "-"}</td>
                                            </tr>
                                        ))}
                                        {data.length > 100 && (
                                            <tr key="more-rows">
                                                <td colSpan={3} className="px-6 py-4 text-center t-muted italic text-xs">
                                                    And {data.length - 100} more rows listed below...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
