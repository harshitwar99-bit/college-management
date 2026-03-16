"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, ClipboardList, Calendar, Clock, FileText,
    MapPin, BarChart2, Bell, User, LogOut,
    Users, BookOpen, Award, ChevronRight, Menu, X, CalendarClock, CreditCard,
    Sun, Moon, Sparkles, Contact, Library
} from "lucide-react";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { EmailSyncModal } from "@/components/ui/EmailSyncModal";
import { NotificationTray } from "@/components/ui/NotificationTray";

const studentLinks = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/attendance", label: "Attendance", icon: ClipboardList },
    { href: "/student/timetable", label: "Timetable", icon: Calendar },
    { href: "/student/today-schedule", label: "Today's Schedule", icon: Clock },
    { href: "/student/exam-schedule", label: "Exam Schedule", icon: FileText },
    { href: "/student/seating-plan", label: "Seating Plan", icon: MapPin },
    { href: "/student/results", label: "Results & Grades", icon: BarChart2 },
    { href: "/student/notices", label: "Notices", icon: Bell },
    { href: "/student/assignments", label: "Assignments", icon: BookOpen },
    { href: "/student/library", label: "Library", icon: Library },
    { href: "/student/leaves", label: "Leave Requests", icon: CalendarClock },
    { href: "/student/fees", label: "Fee Payment", icon: CreditCard },
    { href: "/student/id-card", label: "ID Card", icon: Contact },
    { href: "/student/profile", label: "My Profile", icon: User },
];

const facultyLinks = [
    { href: "/faculty/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/faculty/attendance", label: "Mark Attendance", icon: ClipboardList },
    { href: "/faculty/timetable", label: "Timetable", icon: Calendar },
    { href: "/faculty/exams", label: "Exam Management", icon: FileText },
    { href: "/faculty/results", label: "Marks & Results", icon: Award },
    { href: "/faculty/assignments", label: "Assignments", icon: BookOpen },
    { href: "/faculty/leaves", label: "Leave Requests", icon: CalendarClock },
    { href: "/faculty/notices", label: "Post Notices", icon: Bell },
    { href: "/faculty/students", label: "Students", icon: Users },
    { href: "/faculty/profile", label: "My Profile", icon: User },
];

const coordinatorLinks = [
    { href: "/coordinator/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/coordinator/users", label: "Manage Users", icon: Users },
    { href: "/coordinator/classes", label: "Classes & Timetables", icon: Calendar },
    { href: "/coordinator/exams", label: "Exam Coordination", icon: FileText },
    { href: "/coordinator/leaves", label: "Leave Approvals", icon: CalendarClock },
    { href: "/coordinator/notices", label: "Notices", icon: Bell },
    { href: "/coordinator/profile", label: "My Profile", icon: User },
];

interface SidebarProps {
    role: "student" | "faculty" | "coordinator";
}

function ThemeToggleButton({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                "bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25",
                "text-slate-300 hover:text-white shadow-sm",
                className
            )}
        >
            <span
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                )}
            >
                <Moon className="w-[18px] h-[18px]" />
            </span>
            <span
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                )}
            >
                <Sun className="w-[18px] h-[18px] text-amber-400" />
            </span>
        </button>
    );
}

export function Sidebar({ role, isHovered, setIsHovered, isMobileOpen, setIsMobileOpen }: SidebarProps & { isHovered: boolean, setIsHovered: (v: boolean) => void, isMobileOpen: boolean, setIsMobileOpen: (v: boolean) => void }) {
    const pathname = usePathname();
    const { userProfile, logout } = useAuth();
    const links = role === "student" ? studentLinks : role === "faculty" ? facultyLinks : coordinatorLinks;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "flex flex-col h-full bg-slate-900/95 lg:border-r border-white/5 lg:backdrop-blur-xl z-50 transition-all duration-300 ease-in-out overflow-hidden group print:hidden",
                    // Mobile positioning (drawer)
                    "fixed top-0 bottom-0 left-0 w-72 transform lg:static lg:transform-none lg:flex-shrink-0 shadow-2xl lg:shadow-none",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    // Desktop width sizing
                    !isMobileOpen && isHovered ? "lg:w-64" : "lg:w-[76px]"
                )}
            >
                <div className="flex flex-col h-full w-full overflow-hidden relative">
                    {/* Mobile Close Button */}
                    {isMobileOpen && (
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-5 right-4 lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                    {/* Logo */}
                    <div className="py-5 border-b border-white/5 flex-shrink-0 flex items-center h-[77px] px-3">
                        <div className="flex items-center w-full relative">
                            <div className={cn(
                                "flex items-center justify-center flex-shrink-0 transition-all duration-300",
                                (isHovered || isMobileOpen) ? "w-10 h-10 ml-1" : "w-10 h-10 lg:w-10 lg:h-10 mx-auto"
                            )}>
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/logo.png" alt="ITS Logo" className="w-8 h-8 object-contain" />
                                </div>
                            </div>
                            <div className={cn(
                                "transition-all duration-300 overflow-hidden whitespace-nowrap",
                                (isHovered || isMobileOpen) ? "opacity-100 w-auto ml-3 flex-1" : "lg:opacity-0 lg:w-0 lg:ml-0 lg:flex-none opacity-100 w-auto ml-3 flex-1"
                            )}>
                                <p className="text-base font-bold text-white tracking-wide">ITS</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Management</p>
                            </div>
                        </div>
                    </div>

                    {/* User info */}
                    <div className="py-4 border-b border-white/5 flex-shrink-0 px-3">
                        <div className={cn(
                            "flex items-center rounded-xl transition-all duration-300 relative w-full",
                            (isHovered || isMobileOpen) ? "p-1 justify-start pr-4 bg-white/5" : "p-1 justify-center lg:px-0 lg:py-0 bg-transparent"
                        )}>
                            <div className={cn(
                                "flex items-center justify-center flex-shrink-0 transition-all duration-300",
                                (isHovered || isMobileOpen) ? "w-10 h-10 ml-1" : "w-10 h-10 lg:w-10 lg:h-10 mx-auto"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg",
                                    role === "student" ? "bg-gradient-to-br from-blue-600 to-cyan-600 shadow-blue-500/20" :
                                        role === "faculty" ? "bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-500/20" :
                                            "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-500/20"
                                )}>
                                    {userProfile?.name?.charAt(0) || "?"}
                                </div>
                            </div>
                            <div className={cn(
                                "transition-all duration-300 overflow-hidden whitespace-nowrap text-left",
                                (isHovered || isMobileOpen) ? "opacity-100 w-auto ml-3 flex-1" : "lg:opacity-0 lg:w-0 lg:ml-0 lg:flex-none opacity-100 w-auto ml-3 flex-1"
                            )}>
                                <p className="text-sm font-semibold text-white truncate">{userProfile?.name || "User"}</p>
                                <p className="text-xs text-slate-400 capitalize mt-0.5">{userProfile?.role || role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 overflow-y-auto space-y-1.5 custom-scrollbar px-3">
                        {links.map(link => {
                            const active = pathname === link.href;
                            const isExpanded = isHovered || isMobileOpen;
                            return (
                                <Link key={link.href} href={link.href} className="block w-full" onClick={() => isMobileOpen && setIsMobileOpen(false)}>
                                    <span className={cn(
                                        "transition-all duration-300 group/link relative flex items-center rounded-xl overflow-hidden",
                                        isExpanded ? "p-1 justify-start pr-4" : "p-1 justify-center lg:w-12 lg:h-12 lg:mx-auto",
                                        active ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    )}>
                                        <div className={cn(
                                            "flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-300",
                                            isExpanded ? "w-10 h-10 ml-1" : "w-10 h-10 lg:w-10 lg:h-10 mx-auto",
                                            active ? "bg-blue-600/20 text-blue-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" : "text-slate-400 group-hover/link:text-white"
                                        )}>
                                            <link.icon className={cn("w-[22px] h-[22px] transition-all duration-300", active ? "" : "group-hover/link:-translate-y-0.5")} />
                                        </div>
                                        <span className={cn(
                                            "transition-all duration-300 overflow-hidden whitespace-nowrap font-medium text-[15px]",
                                            isExpanded ? "opacity-100 w-auto ml-3 flex-1" : "lg:opacity-0 lg:w-0 lg:ml-0 lg:flex-none opacity-100 w-auto ml-3 flex-1"
                                        )}>{link.label}</span>
                                        {active && isExpanded && <ChevronRight className="w-5 h-5 opacity-70 ml-auto flex-shrink-0" />}

                                        {/* Active indicator border overlay */}
                                        {active && (
                                            <span className={cn(
                                                "absolute left-0 bg-gradient-to-b from-blue-400 to-indigo-500 transition-all duration-300",
                                                isExpanded ? "top-0 bottom-0 w-1" : "lg:top-[20%] lg:bottom-[20%] lg:w-1.5 lg:rounded-r-md top-0 bottom-0 w-1"
                                            )}></span>
                                        )}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="py-4 border-t border-white/5 flex-shrink-0 px-3">
                        <button
                            onClick={logout}
                            className={cn(
                                "w-full transition-all duration-300 flex items-center rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 group/btn overflow-hidden",
                                (isHovered || isMobileOpen) ? "p-1 justify-start pr-4" : "p-1 justify-center lg:w-12 lg:h-12 lg:mx-auto lg:px-0 lg:py-0"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-300",
                                (isHovered || isMobileOpen) ? "w-10 h-10 ml-1" : "w-10 h-10 lg:w-10 lg:h-10 mx-auto"
                            )}>
                                <LogOut className="w-[22px] h-[22px] flex-shrink-0 transition-all duration-300 group-hover/btn:-translate-y-0.5" />
                            </div>
                            <span className={cn(
                                "transition-all duration-300 overflow-hidden whitespace-nowrap font-medium text-[15px] text-left",
                                (isHovered || isMobileOpen) ? "opacity-100 w-auto ml-3 flex-1" : "lg:opacity-0 lg:w-0 lg:ml-0 lg:flex-none opacity-100 w-auto ml-3 flex-1"
                            )}>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export function BottomNav({ role }: SidebarProps) {
    const pathname = usePathname();
    const bottomLinks = role === "student"
        ? [
            { href: "/student/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/student/assignments", label: "Tasks", icon: BookOpen },
            { href: "/student/admit-card", label: "Admit Card", icon: FileText },
            { href: "/student/notices", label: "Notices", icon: Bell },
            { href: "/student/profile", label: "Profile", icon: User },
        ]
        : role === "faculty" ? [
            { href: "/faculty/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/faculty/attendance", label: "Attend.", icon: ClipboardList },
            { href: "/faculty/exams", label: "Exams", icon: FileText },
            { href: "/faculty/notices", label: "Notices", icon: Bell },
            { href: "/faculty/profile", label: "Profile", icon: User },
        ] : [
            { href: "/coordinator/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/coordinator/users", label: "Users", icon: Users },
            { href: "/coordinator/academic", label: "Academic", icon: BookOpen },
            { href: "/coordinator/notices", label: "Notices", icon: Bell },
            { href: "/coordinator/exams", label: "Exams", icon: FileText },
            { href: "/coordinator/results", label: "Results", icon: BarChart2 },
            { href: "/coordinator/sync-rollno", label: "Sync Roll Nos", icon: FileText },
            { href: "/coordinator/profile", label: "Profile", icon: User },
        ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 z-30 bottom-nav">
            <div className="flex items-center justify-around px-2 py-2">
                {bottomLinks.map(link => {
                    const active = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}>
                            <span className={cn(
                                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200",
                                active ? "text-blue-400" : "text-slate-500"
                            )}>
                                <link.icon className={cn("w-5 h-5", active && "scale-110 transition-transform")} />
                                <span className="text-xs font-medium">{link.label}</span>
                                {active && <span className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export function MobileTopBar({ title, role, onMenuClick, onEmailSyncClick }: { title: string; role: "student" | "faculty" | "coordinator"; onMenuClick: () => void; onEmailSyncClick: () => void }) {
    return (
        <div className="lg:hidden sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-sm print:hidden">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="text-slate-400 hover:text-white transition-colors p-1">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="ITS Logo" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-white font-semibold text-sm truncate max-w-[120px]">{title}</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {role !== "student" && (
                    <button onClick={onEmailSyncClick} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </button>
                )}
                <NotificationTray />
                <GlobalSearch role={role} isMobile />
                <ThemeToggleButton className="w-8 h-8 ml-1" />
            </div>
        </div>
    );
}

export function DesktopTopBar({ title, role, onEmailSyncClick }: { title: string, role: "student" | "faculty" | "coordinator"; onEmailSyncClick: () => void }) {
    return (
        <div className="hidden lg:flex items-center justify-between px-10 py-4 flex-shrink-0 print:hidden"
            style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-card)' }}>
            <div>
                <h1 className="text-xl font-bold t-heading">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                {role !== "student" && (
                    <>
                        <button
                            onClick={onEmailSyncClick}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-600/10 hover:bg-blue-100 dark:hover:bg-blue-600/20 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors shadow-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">Email Sync</span>
                        </button>
                        <div className="w-px h-6 bg-[var(--border-item)] mx-1" />
                    </>
                )}
                <NotificationTray />
                <GlobalSearch role={role} />
                <ThemeToggleButton />
            </div>
        </div>
    );
}

export function DashboardLayout({
    children, role, title,
}: {
    children: React.ReactNode;
    role: "student" | "faculty" | "coordinator";
    title: string;
}) {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEmailSyncOpen, setIsEmailSyncOpen] = useState(false);

    return (
        <div className="flex h-[100dvh] overflow-hidden w-full relative transition-colors duration-300" style={{ background: 'var(--bg-page)' }}>
            <Sidebar
                role={role}
                isHovered={isSidebarHovered}
                setIsHovered={setIsSidebarHovered}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <MobileTopBar title={title} role={role} onMenuClick={() => setIsMobileMenuOpen(true)} onEmailSyncClick={() => setIsEmailSyncOpen(true)} />
                <DesktopTopBar title={title} role={role} onEmailSyncClick={() => setIsEmailSyncOpen(true)} />
                <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 relative">
                    <div className="px-5 py-6 lg:px-10 lg:py-10 max-w-[1400px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

            {/* Keeping BottomNav for mobile quick actions if they prefer it, but user has drawer now */}
            <BottomNav role={role} />

            <EmailSyncModal isOpen={isEmailSyncOpen} onClose={() => setIsEmailSyncOpen(false)} />
        </div>
    );
}
