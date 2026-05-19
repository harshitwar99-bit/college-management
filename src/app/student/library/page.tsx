"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, Book, Clock, CheckCircle, AlertTriangle, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import { getDemoData } from "@/lib/demo-data";

export default function LibraryPage() {
    const { userProfile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState<any[]>(() => getDemoData(undefined).library.books);
    const [issuedBooks, setIssuedBooks] = useState<any[]>(() => getDemoData(undefined).library.transactions);

    useEffect(() => {
        const lib = getDemoData(userProfile?.branch).library;
        setBooks(lib.books);
        setIssuedBooks(lib.transactions);
        if (!userProfile?.id) return;
        const fetchLibrary = async () => {
            try {
                const res = await fetch(`/api/library?firebaseId=${userProfile.id}`);
                const json = await res.json();
                if (json.success && (json.data.books?.length > 0 || json.data.transactions?.length > 0)) {
                    setBooks(json.data.books || lib.books);
                    setIssuedBooks((json.data.transactions || []).filter((t: any) => t.status === 'Borrowed' || t.status === 'Overdue'));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchLibrary();
    }, [userProfile?.id, userProfile?.branch]);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
    );

    return (
        <DashboardLayout role="student" title="Library">
            <div className="page-header">Library Portal</div>
            <p className="page-subheader">Track issued resources and browse the catalog</p>

            {/* Issued Books Section */}
            <div className="mb-8 fade-in">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5 text-indigo-400" />
                    Currently Issued
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {issuedBooks.length === 0 ? (
                        <div className="col-span-full p-6 text-center text-slate-400 border border-white/5 rounded-2xl bg-white/5">
                            You have no books currently issued.
                        </div>
                    ) : (
                        issuedBooks.map(txn => {
                            const isOverdue = new Date(txn.dueDate) < new Date();
                            const daysOverdue = isOverdue ? Math.floor((new Date().getTime() - new Date(txn.dueDate).getTime()) / (1000 * 3600 * 24)) : 0;
                            const fine = daysOverdue * 10; // Rs 10 per day fine

                            return (
                                <div key={txn.id} className={`glass-card p-5 border-l-4 ${isOverdue ? 'border-l-red-500' : 'border-l-emerald-500'} relative overflow-hidden group hover:border-white/20 transition-all`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Book className="w-16 h-16 text-slate-400" />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg leading-tight mb-1 pr-12">{txn.book.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{txn.book.author}</p>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Clock className="w-4 h-4" />
                                            <span>Due: <span className={isOverdue ? 'text-red-400 font-medium' : 'text-slate-300'}>{formatDate(txn.dueDate)}</span></span>
                                        </div>
                                        {isOverdue && (
                                            <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-medium border border-red-500/20">
                                                <AlertTriangle className="w-4 h-4" />
                                                Late Fine: ₹{fine}
                                            </div>
                                        )}
                                        {!isOverdue && (
                                            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                                                <CheckCircle className="w-4 h-4" /> On Track
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Catalog Search Section */}
            <div className="fade-in" style={{ animationDelay: "100ms" }}>
                <h2 className="text-xl font-bold text-white mb-4">Book Catalog</h2>
                <div className="glass-card p-1">
                    <div className="flex items-center gap-3 p-3 border-b border-white/5">
                        <Search className="w-5 h-5 text-slate-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Title, Author, or ISBN..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
                        />
                    </div>
                    <div className="divide-y divide-white/5">
                        {filteredBooks.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                No books found matching "{searchQuery}"
                            </div>
                        ) : (
                            filteredBooks.map(book => (
                                <div key={book.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                    <div>
                                        <p className="text-white font-medium">{book.title}</p>
                                        <p className="text-slate-400 text-sm mt-0.5">{book.author} <span className="mx-2 opacity-50">•</span> <span className="font-mono text-xs">ISBN: {book.isbn}</span></p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-3">
                                        <span className="text-slate-500 text-xs">{book.available} / {book.quantity} left</span>
                                        {book.available > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                Available shelf
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <Clock className="w-3 h-3" />
                                                Fully Issued
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
