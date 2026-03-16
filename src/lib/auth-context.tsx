"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { DEMO_USERS } from "./demo-data";

export type UserRole = "student" | "faculty" | "coordinator" | null;

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    rollNumber?: string;
    collegeRollNo?: string;
    universityRollNo?: string;
    dob?: string;
    semester?: string;
    branch?: string;
    division?: string;
    department?: string;
    phone?: string;
    photo?: string;
    fatherName?: string;
    address?: string;
    seatType?: string;
    batch?: string;
    subjects?: string[];
    classes?: string[];
}

interface AuthContextType {
    user: UserProfile | null;
    role: UserRole;
    loading: boolean;
    userProfile: UserProfile | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUserProfile: (uid?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    userProfile: null,
    login: async () => { },
    logout: async () => { },
    loadUserProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    const handleMockLogin = (email: string, password: string): UserProfile => {
        const match = DEMO_USERS.find(
            u => u.email === email && u.password === password
        );
        if (!match) throw new Error("Invalid demo credentials");

        const profile: UserProfile = {
            id: match.uid,
            name: match.name,
            email: match.email,
            role: match.role as UserRole,
            ...(match.role === "student" ? {
                rollNumber: (match as unknown as UserProfile).rollNumber,
                semester: (match as unknown as UserProfile).semester,
                branch: (match as unknown as UserProfile).branch,
                division: (match as unknown as UserProfile).division,
                phone: match.phone,
                fatherName: (match as any).fatherName,
                address: (match as any).address,
                seatType: (match as any).seatType,
                batch: (match as any).batch,
            } : match.role === "faculty" ? {
                department: (match as unknown as UserProfile).department,
                subjects: (match as unknown as UserProfile).subjects,
                classes: (match as unknown as UserProfile).classes,
                phone: match.phone,
            } : {
                phone: match.phone,
            }),
        };
        return profile;
    };

    const syncServerSession = async (profile: UserProfile | null) => {
        try {
            if (profile) {
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: profile.id,
                        role: profile.role,
                        email: profile.email,
                        name: profile.name,
                    }),
                });
            } else {
                await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: "logout" })
                });
            }
        } catch (error) {
            console.error("Failed to sync server session", error);
        }
    };

    const loadUserProfile = async (uid?: string, userObject?: { email?: string | null; name?: string | null }) => {
        const targetUid = uid || auth.currentUser?.uid;
        if (!targetUid) return;

        try {
            // First, try to sync the user via our new API (PostgreSQL + Prisma)
            const syncResponse = await fetch('/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseId: targetUid,
                    email: auth.currentUser?.email || userObject?.email,
                    name: auth.currentUser?.displayName || userObject?.name || '',
                    // Defaulting to STUDENT unless overriden by signup logic later
                    role: 'STUDENT',
                })
            });

            if (syncResponse.ok) {
                const { data } = await syncResponse.json();

                const profile: UserProfile = {
                    id: data.firebaseId,
                    email: data.email,
                    name: data.name,
                    role: data.role.toLowerCase() as UserRole, // Map Prisma Enum 'STUDENT' to 'student'
                    phone: data.phone || '',
                };

                setUser(profile);
                setRole(profile.role);
                localStorage.setItem("edu_session", JSON.stringify(profile));
                await syncServerSession(profile);
                return;
            } else {
                console.warn("Postgres API sync failed, falling back to Firestore");
            }

        } catch (error) {
            console.warn("Postgres fetch failed:", error);
        }

        // Fallback: Attempt to load from real Firestore if configured properly
        try {
            const docRef = doc(db, "users", targetUid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const profile = { id: targetUid, ...docSnap.data() } as UserProfile;
                setUser(profile);
                setRole(profile.role);
                localStorage.setItem("edu_session", JSON.stringify(profile));
                await syncServerSession(profile);
                return;
            } else {
                console.error("User profile not found in Firebase Firestore.");
            }
        } catch (error) {
            console.warn("Firestore fetch failed:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await loadUserProfile(firebaseUser.uid);
            } else {
                try {
                    const cached = localStorage.getItem("edu_session");
                    if (cached) {
                        const profile = JSON.parse(cached) as UserProfile;
                        setUser(profile);
                        setRole(profile.role);
                    } else {
                        setUser(null);
                        setRole(null);
                    }
                } catch {
                    localStorage.removeItem("edu_session");
                    setUser(null);
                    setRole(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // ONLY Attempt Real Firebase Authentication. 
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await loadUserProfile(userCredential.user.uid);
        } catch (error: unknown) {
            console.warn("Firebase Auth failed, attempting Mock Auth...", error);
            try {
                // Securely fallback to Mock Auth while generating full JWT
                const profile = handleMockLogin(email, password);
                setUser(profile);
                setRole(profile.role);
                localStorage.setItem("edu_session", JSON.stringify(profile));
                await syncServerSession(profile);
            } catch (mockError) {
                throw error; // throw original if mock fails too
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            await syncServerSession(null);
        } catch (error) {
            console.warn("Firebase SignOut error:", error);
        } finally {
            localStorage.removeItem("edu_session");
            setUser(null);
            setRole(null);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, userProfile: user, login, logout, loadUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
