"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Users, Calendar, BookOpen, Bell, CreditCard, User, LayoutDashboard, ClipboardList, Clock, MapPin, BarChart2, CalendarClock, Award, Contact, Library } from "lucide-react";

interface GlobalSearchProps {
    role: "student" | "faculty" | "coordinator";
    isMobile?: boolean;
}

export function GlobalSearch({ role, isMobile }: GlobalSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Define search indices based on role
    const getSearchData = () => {
        const studentLinks = [
            { href: "/student/dashboard", label: "Dashboard Overview", desc: "View your classes, schedule and stats", icon: LayoutDashboard },
            { href: "/student/attendance", label: "My Attendance", desc: "Check your attendance records", icon: ClipboardList },
            { href: "/student/timetable", label: "Timetable & Classes", desc: "View full weekly timetable", icon: Calendar },
            { href: "/student/today-schedule", label: "Today's Schedule", desc: "View classes for today", icon: Clock },
            { href: "/student/exam-schedule", label: "Exam Schedule", desc: "Upcoming examination dates", icon: FileText },
            { href: "/student/seating-plan", label: "Seating Plan", desc: "View exam seating arrangements", icon: MapPin },
            { href: "/student/results", label: "Results & Grades", desc: "Check your academic performance", icon: BarChart2 },
            { href: "/student/notices", label: "Notices & Announcements", desc: "Important college updates", icon: Bell },
            { href: "/student/assignments", label: "Assignments & Submissions", desc: "Pending and completed work", icon: BookOpen },
            { href: "/student/library", label: "Library Portal", desc: "Search books and issued items", icon: Library },
            { href: "/student/leaves", label: "Leave Requests", desc: "Apply for leaves", icon: CalendarClock },
            { href: "/student/fees", label: "Fee Payment", desc: "Pay college fees", icon: CreditCard },
            { href: "/student/id-card", label: "Digital ID Card", desc: "View and print your ID card", icon: Contact },
            { href: "/student/profile", label: "My Profile", desc: "View personal details", icon: User },
        ];

        const facultyLinks = [
            { href: "/faculty/dashboard", label: "Dashboard Overview", desc: "View daily metrics and quick actions", icon: LayoutDashboard },
            { href: "/faculty/attendance", label: "Mark Attendance", desc: "Take attendance for your classes", icon: ClipboardList },
            { href: "/faculty/timetable", label: "My Timetable", desc: "View teaching schedule", icon: Calendar },
            { href: "/faculty/exams", label: "Exam Management", desc: "Manage exams and invigilation", icon: FileText },
            { href: "/faculty/results", label: "Marks & Results", desc: "Upload student grades", icon: Award },
            { href: "/faculty/assignments", label: "Manage Assignments", desc: "Create and score assignments", icon: BookOpen },
            { href: "/faculty/leaves", label: "My Leave Requests", desc: "Apply for employee leave", icon: CalendarClock },
            { href: "/faculty/notices", label: "Post Notices", desc: "Publish class announcements", icon: Bell },
            { href: "/faculty/students", label: "My Students", desc: "View class rosters and student details", icon: Users },
            { href: "/faculty/profile", label: "My Profile", desc: "View personal details", icon: User },
        ];

        const coordinatorLinks = [
            { href: "/coordinator/dashboard", label: "Dashboard Overview", desc: "Institution top-level metrics", icon: LayoutDashboard },
            { href: "/coordinator/users", label: "Manage Users", desc: "Add, edit, or remove students and faculty", icon: Users },
            { href: "/coordinator/classes", label: "Classes & Timetables", desc: "Manage schedules and courses", icon: Calendar },
            { href: "/coordinator/exams", label: "Exam Coordination", desc: "Schedule exams and venues", icon: FileText },
            { href: "/coordinator/leaves", label: "Leave Approvals", desc: "Review staff leave requests", icon: CalendarClock },
            { href: "/coordinator/notices", label: "Global Notices", desc: "Publish institution-wide announcements", icon: Bell },
            { href: "/coordinator/profile", label: "My Profile", desc: "View personal details", icon: User },
        ];

        return role === "student" ? studentLinks : role === "faculty" ? facultyLinks : coordinatorLinks;
    };

    const data = getSearchData();
    const filteredResults = query === ""
        ? data.slice(0, 5)
        : data.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase())
        );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
            setActiveIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter" && filteredResults[activeIndex]) {
            e.preventDefault();
            router.push(filteredResults[activeIndex].href);
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Search Trigger Button for Desktop TopBar */}
            {/* Search Trigger Button for Desktop TopBar */}
            {isMobile ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                    <Search className="w-5 h-5 flex-shrink-0" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] border border-[var(--border-item)] transition-colors text-slate-400 hover:text-white"
                >
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search</span>
                    <kbd className="ml-2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            )}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

                    <div className="relative w-full max-w-xl bg-slate-50 dark:bg-[#0e1b2e] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden transform scale-100 opacity-100 transition-all">
                        {/* Search Input */}
                        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-white/10">
                            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="What do you need to find?"
                                className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400"
                            />
                            <kbd className="hidden lg:inline-flex h-6 items-center gap-1 rounded border border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-white/5 px-2 font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                                ESC
                            </kbd>
                        </div>

                        {/* Search Results */}
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {filteredResults.length === 0 ? (
                                <div className="py-10 text-center text-slate-500">
                                    <p>No results found for &quot;{query}&quot;</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {query ? "Results" : "Quick Navigation"}
                                    </div>
                                    {filteredResults.map((item, index) => (
                                        <div
                                            key={item.href}
                                            onClick={() => {
                                                router.push(item.href);
                                                setIsOpen(false);
                                            }}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors ${activeIndex === index
                                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${activeIndex === index ? "bg-blue-500/20 text-blue-500" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"}`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{item.label}</p>
                                                <p className={`text-xs ${activeIndex === index ? "text-blue-500/70 dark:text-blue-400/70" : "text-slate-500 dark:text-slate-500"}`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
