"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Eye, EyeOff, AlertCircle, BookOpen, Users, Shield, Settings, Sun, Moon } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    const DEMO_CREDS = [
        { label: "Student", email: "harshitbbt_bca24_27@its.edu.in", password: "student123", icon: BookOpen, color: "from-blue-600 to-cyan-600" },
        { label: "Faculty", email: "faculty@college.edu", password: "faculty123", icon: Users, color: "from-purple-600 to-indigo-600" },
        { label: "Coordinator", email: "coordinator@college.edu", password: "coordinator123", icon: Settings, color: "from-emerald-600 to-teal-600" },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            // Auth context sets role; read from localStorage
            const cached = localStorage.getItem("edu_session");
            const role = cached ? JSON.parse(cached).role : null;
            if (role === "faculty") router.replace("/faculty/dashboard");
            else if (role === "coordinator") router.replace("/coordinator/dashboard");
            else router.replace("/student/dashboard");
        } catch {
            setError("Invalid credentials. Click a demo button below to auto-fill.");
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (creds: typeof DEMO_CREDS[0]) => {
        setEmail(creds.email);
        setPassword(creds.password);
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-[var(--bg-page)] transition-colors duration-300">
            {/* Theme toggle – top right */}
            <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] border border-[var(--border-item)] t-muted hover:t-heading transition-all duration-300 shadow-md"
            >
                {theme === "dark" ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px] text-amber-500" />}
            </button>

            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl" />
            </div>

            <div className="w-full max-w-md relative z-10 fade-in">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white mb-4 overflow-hidden border border-[var(--border-card)] shadow-lg p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="ITS Logo" className="w-20 h-20 object-contain transition-all duration-300" />
                    </div>
                    <h1 className="text-3xl font-bold t-heading mb-1">ITS Ghaziabad</h1>
                    <p className="t-muted text-sm font-medium mb-2">Institute of Technology and Science</p>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                        <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">A+ Grade by NAAC</span>
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full">AICTE Approved</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 shadow-xl">
                    <h2 className="text-xl font-semibold t-heading mb-6">Sign in to your account</h2>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium t-body mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@college.edu"
                                required
                                className="w-full bg-[var(--bg-item)] border border-[var(--border-item)] rounded-xl px-4 py-3 t-heading placeholder:text-slate-400 dark:placeholder:text-slate-500
                  focus:outline-none focus:border-blue-500/50 focus:bg-[var(--bg-item-hover)] transition-all duration-200 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium t-body mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-[var(--bg-item)] border border-[var(--border-item)] rounded-xl px-4 py-3 pr-11 t-heading placeholder:text-slate-400 dark:placeholder:text-slate-500
                    focus:outline-none focus:border-blue-500/50 focus:bg-[var(--bg-item-hover)] transition-all duration-200 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 t-muted hover:t-heading transition-colors"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    Sign In Securely
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 pt-5 border-t theme-divider">
                        <p className="text-xs t-muted text-center mb-3 uppercase tracking-wider font-semibold">Quick Demo Access</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {DEMO_CREDS.map(creds => (
                                <button
                                    key={creds.label}
                                    onClick={() => fillDemo(creds)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] border border-[var(--border-item)] hover:border-blue-500/30 transition-all duration-200 group`}
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${creds.color} flex items-center justify-center shadow-sm`}>
                                        <creds.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs font-bold t-heading group-hover:text-blue-500 transition-colors">
                                        {creds.label} Demo
                                    </span>
                                    <span className="text-[10px] t-faint font-mono font-medium -mt-1">{creds.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs t-muted font-medium mt-4 bg-white/50 dark:bg-black/20 py-2 rounded-full max-w-[max-content] mx-auto px-4 border border-[var(--border-card)] backdrop-blur-sm">
                    🔒 Demo mode — no account required
                </p>
            </div>
        </div>
    );
}
