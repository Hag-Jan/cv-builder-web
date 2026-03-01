"use client";

import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase.client";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function TopBar() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
            <h1 className="text-lg font-semibold text-foreground">ResumeATS</h1>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <button
                    onClick={handleLogout}
                    className="text-sm text-muted-foreground hover:text-destructive transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
