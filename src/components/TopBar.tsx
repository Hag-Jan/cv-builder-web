"use client";

// import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase.client";
import { useRouter } from "next/navigation";

export default function TopBar() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b">
            <h1 className="text-lg font-semibold">ResumeATS</h1>

            <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
}
