"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Info, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationTray() {
    const [isOpen, setIsOpen] = useState(false);
    const trayRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState([
        { id: 1, title: "Exam Schedule Published", desc: "Mid-terms begin next week.", time: "1h ago", unread: true, type: "alert" },
        { id: 2, title: "New Notice Posted", desc: "Holiday declared for Monday.", time: "5h ago", unread: true, type: "info" },
        { id: 3, title: "Assignment Graded", desc: "Data Structures - 95/100", time: "1d ago", unread: false, type: "success" },
        { id: 4, title: "Timetable Updated", desc: "Room change for Algorithms class.", time: "2d ago", unread: false, type: "calendar" },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (trayRef.current && !trayRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'calendar': return <Calendar className="w-5 h-5 text-purple-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="relative" ref={trayRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 rounded-xl transition-colors text-slate-400 hover:text-white border border-transparent hover:border-white/10",
                    isOpen ? "bg-white/10 text-white" : "hover:bg-white/5"
                )}
            >
                {/* 
                  Since this is rendering on the dark TopBar, 
                  we force text-white or text-slate-400 
                */}
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50 overflow-hidden fade-in origin-top-right">
                    <div className="p-4 border-b border-[var(--border-item)] flex flex-col gap-1 bg-[var(--bg-item)]/50">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg t-heading">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <p className="text-xs t-muted font-medium">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <div className="w-12 h-12 bg-[var(--bg-item)] rounded-full mb-3 flex items-center justify-center">
                                    <Bell className="w-6 h-6 t-muted opacity-50" />
                                </div>
                                <p className="t-heading font-semibold text-sm">All caught up!</p>
                                <p className="t-muted text-xs mt-1">Check back later for new notifications.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={cn(
                                            "flex gap-3 p-4 border-b border-[var(--border-item)] hover:bg-[var(--bg-item-hover)] transition-colors cursor-pointer",
                                            notif.unread ? "bg-[var(--bg-item)]/30" : ""
                                        )}
                                        onClick={() => {
                                            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                                        }}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className={cn("p-2 rounded-xl bg-white/5", notif.unread ? "opacity-100" : "opacity-60")}>
                                                {getIcon(notif.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <p className={cn("text-sm font-semibold truncate", notif.unread ? "t-heading" : "t-muted")}>
                                                    {notif.title}
                                                </p>
                                                {notif.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                                            </div>
                                            <p className="text-xs t-muted line-clamp-2 leading-relaxed mb-1.5">{notif.desc}</p>
                                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{notif.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="w-full p-3 text-center text-sm font-semibold text-blue-500 hover:bg-[var(--bg-item)] transition-colors border-t border-[var(--border-item)]">
                        View All Notifications
                    </button>
                </div>
            )}
        </div>
    );
}
