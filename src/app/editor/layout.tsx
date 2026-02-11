"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Verifying access...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-600">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar placeholder */}
            <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto shrink-0">
                <h1 className="text-xl font-bold mb-6 text-blue-600">ResumeATS</h1>
                <nav className="space-y-2">
                    <div className="font-medium text-gray-500 mb-2">Sections</div>
                    {/* section navigation items */}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {children}
            </main>
        </div>
    );
}
