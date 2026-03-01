"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!loading && !user) {
            const currentParams = searchParams.toString();
            const currentUrl = currentParams ? `${pathname}?${currentParams}` : pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
        }
    }, [user, loading, router, pathname, searchParams]);

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

    return <>{children}</>;
}

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <main className="flex-1 overflow-hidden">
                <Suspense fallback={
                    <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading editor...</p>
                    </div>
                }>
                    <AuthGuard>{children}</AuthGuard>
                </Suspense>
            </main>
        </div>
    );
}
