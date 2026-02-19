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
        <div className="flex flex-col h-screen bg-gray-50">
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
