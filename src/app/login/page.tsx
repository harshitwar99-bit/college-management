"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Eye, EyeOff, AlertCircle, BookOpen, Users, Shield, Settings, Sun, Moon, ChevronLeft, CheckCircle, Lock } from "lucide-react";

// Secret key for coordinator registration — in a real app this would be an invite token
const COORDINATOR_SECRET_KEY = "ITS@COORD2026";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();

    // Registration mode state
    const [mode, setMode] = useState<"login" | "register">("login");
    const [regStep, setRegStep] = useState<1 | 2>(1);
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regSecretKey, setRegSecretKey] = useState("");
    const [regSuccess, setRegSuccess] = useState(false);
    const [showRegPwd, setShowRegPwd] = useState(false);

    const DEMO_CREDS = [
        { label: "BCA Yr-1", email: "bca1@its.edu.in", password: "student123", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
        { label: "BCA Yr-2", email: "bca2@its.edu.in", password: "student123", icon: BookOpen, color: "from-blue-600 to-indigo-600" },
        { label: "BCA Yr-3", email: "bca3@its.edu.in", password: "student123", icon: BookOpen, color: "from-blue-700 to-violet-700" },
        { label: "BBA Yr-1", email: "bba1@its.edu.in", password: "student123", icon: Users, color: "from-amber-500 to-orange-500" },
        { label: "BBA Yr-2", email: "bba2@its.edu.in", password: "student123", icon: Users, color: "from-amber-600 to-red-500" },
        { label: "BBA Yr-3", email: "bba3@its.edu.in", password: "student123", icon: Users, color: "from-orange-700 to-rose-700" },
        { label: "Faculty", email: "faculty@its.edu.in", password: "faculty123", icon: Shield, color: "from-purple-600 to-indigo-600" },
        { label: "Coord BCA1", email: "coord.bca1@its.edu.in", password: "coord123", icon: Settings, color: "from-emerald-600 to-teal-600" },
        { label: "Coord BBA1", email: "coord.bba1@its.edu.in", password: "coord123", icon: Settings, color: "from-teal-600 to-cyan-600" },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
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

    // Step 1: Validate secret key → Step 2: Fill name, email, password
    const handleRegisterStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (regSecretKey !== COORDINATOR_SECRET_KEY) {
            setError("Invalid coordinator access key. Contact the system administrator.");
            return;
        }
        setRegStep(2);
    };

    const handleRegisterStep2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (regPassword !== regConfirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (regPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setLoading(true);
        try {
            // Register in demo-data store (add to DEMO_USERS at runtime via localStorage)
            const newCoord = {
                uid: `coordinator-${Date.now()}`,
                email: regEmail,
                password: regPassword,
                role: "coordinator",
                name: regName,
                phone: regPhone,
                photo: "",
            };
            // Persist to localStorage for demo/fallback mode
            const existing = JSON.parse(localStorage.getItem("registered_coordinators") || "[]");
            existing.push(newCoord);
            localStorage.setItem("registered_coordinators", JSON.stringify(existing));

            // Try to POST to real API if available
            try {
                await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: regName,
                        email: regEmail,
                        role: "COORDINATOR",
                        phone: regPhone,
                        firebaseId: newCoord.uid,
                    }),
                });
            } catch { /* API offline — localStorage fallback already saved */ }

            setRegSuccess(true);
            // Auto-fill login after 2 seconds
            setTimeout(() => {
                setMode("login");
                setEmail(regEmail);
                setPassword(regPassword);
                setRegSuccess(false);
                setRegStep(1);
                setRegName(""); setRegEmail(""); setRegPassword("");
                setRegConfirmPassword(""); setRegPhone(""); setRegSecretKey("");
            }, 2500);
        } catch {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-[var(--bg-item)] border border-[var(--border-item)] rounded-xl px-4 py-3 t-heading placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-[var(--bg-item-hover)] transition-all duration-200 text-sm";

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-[var(--bg-page)] transition-colors duration-300">
            {/* Theme toggle */}
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

                {/* ─── LOGIN CARD ─── */}
                {mode === "login" && (
                    <div className="glass-card p-8 shadow-xl">
                        <h2 className="text-xl font-semibold t-heading mb-6">Sign in to your account</h2>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium t-body mb-1.5">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="your@college.edu" required className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium t-body mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPwd ? "text" : "password"} value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password" required
                                        className={inputCls + " pr-11"} />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 t-muted hover:t-heading transition-colors">
                                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full btn-primary flex items-center justify-center gap-2 mt-2">
                                {loading
                                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <><Shield className="w-4 h-4" /> Sign In Securely</>}
                            </button>
                        </form>

                        {/* Demo credentials */}
                        <div className="mt-6 pt-5 border-t theme-divider">
                            <p className="text-xs t-muted text-center mb-3 uppercase tracking-wider font-semibold">Quick Demo Access</p>
                            <div className="grid grid-cols-3 gap-2">
                                {DEMO_CREDS.map(creds => (
                                    <button key={creds.label} onClick={() => fillDemo(creds)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-item)] hover:bg-[var(--bg-item-hover)] border border-[var(--border-item)] hover:border-blue-500/30 transition-all duration-200 group">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${creds.color} flex items-center justify-center shadow-sm`}>
                                            <creds.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-xs font-bold t-heading group-hover:text-blue-500 transition-colors">{creds.label} Demo</span>
                                        <span className="text-[10px] t-faint font-mono font-medium -mt-1">{creds.email}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Register coordinator link */}
                        <div className="mt-4 text-center">
                            <button onClick={() => { setMode("register"); setError(""); setRegStep(1); }}
                                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-1 mx-auto">
                                <Lock className="w-3 h-3" /> Register as Coordinator (with admin key)
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── REGISTER COORDINATOR CARD ─── */}
                {mode === "register" && (
                    <div className="glass-card p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={() => { setMode("login"); setError(""); setRegStep(1); }}
                                className="p-1.5 rounded-lg t-muted hover:t-heading hover:bg-white/10 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-xl font-semibold t-heading">Register Coordinator Account</h2>
                                <p className="text-xs t-muted mt-0.5">Step {regStep} of 2</p>
                            </div>
                            <div className="ml-auto flex gap-1.5">
                                <div className={`w-8 h-1.5 rounded-full transition-colors ${regStep >= 1 ? "bg-emerald-500" : "bg-white/10"}`} />
                                <div className={`w-8 h-1.5 rounded-full transition-colors ${regStep >= 2 ? "bg-emerald-500" : "bg-white/10"}`} />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                            </div>
                        )}

                        {regSuccess && (
                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <p className="text-white font-bold text-lg">Account Created!</p>
                                <p className="text-slate-400 text-sm">Redirecting to login...</p>
                            </div>
                        )}

                        {!regSuccess && regStep === 1 && (
                            <form onSubmit={handleRegisterStep1} className="space-y-4">
                                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-400 flex items-start gap-2">
                                    <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>Coordinator registration requires an admin-issued access key. Contact your system administrator to obtain it.</span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium t-body mb-1.5">Admin Access Key</label>
                                    <input type="password" value={regSecretKey} onChange={e => setRegSecretKey(e.target.value)}
                                        placeholder="Enter coordinator access key"
                                        required className={inputCls} />
                                    <p className="text-xs t-muted mt-1">Hint for demo: <span className="font-mono text-emerald-400">{COORDINATOR_SECRET_KEY}</span></p>
                                </div>
                                <button type="submit" className="w-full btn-primary !from-emerald-600 !to-teal-600 py-3 flex items-center justify-center gap-2">
                                    <Shield className="w-4 h-4" /> Verify Key & Continue
                                </button>
                            </form>
                        )}

                        {!regSuccess && regStep === 2 && (
                            <form onSubmit={handleRegisterStep2} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium t-body mb-1.5">Full Name</label>
                                        <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                                            placeholder="Dr. First Last" required className={inputCls} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium t-body mb-1.5">Email Address</label>
                                        <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                            placeholder="coord@its.edu.in" required className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium t-body mb-1.5">Phone</label>
                                        <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                                            placeholder="+91 9876543210" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium t-body mb-1.5">Password</label>
                                        <div className="relative">
                                            <input type={showRegPwd ? "text" : "password"} value={regPassword}
                                                onChange={e => setRegPassword(e.target.value)}
                                                placeholder="Min. 8 chars" required className={inputCls + " pr-11"} />
                                            <button type="button" onClick={() => setShowRegPwd(!showRegPwd)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 t-muted hover:t-heading">
                                                {showRegPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium t-body mb-1.5">Confirm Password</label>
                                        <input type="password" value={regConfirmPassword}
                                            onChange={e => setRegConfirmPassword(e.target.value)}
                                            placeholder="Re-enter password" required className={inputCls} />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full btn-primary !from-emerald-600 !to-teal-600 py-3 flex items-center justify-center gap-2">
                                    {loading
                                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <><CheckCircle className="w-4 h-4" /> Create Coordinator Account</>}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                <p className="text-center text-xs t-muted font-medium mt-4 bg-white/50 dark:bg-black/20 py-2 rounded-full max-w-[max-content] mx-auto px-4 border border-[var(--border-card)] backdrop-blur-sm">
                    🔒 Demo mode — no account required
                </p>
            </div>
        </div>
    );
}
