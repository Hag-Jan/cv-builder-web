"use client";

import { useState, Suspense } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase.client";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }

            // Redirect back to the requested URL, or default to editor
            const redirectUrl = searchParams.get("redirect") || "/editor";
            router.push(redirectUrl);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Sign Up"}</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleAuth} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 underline">
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-100"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div></div>}>
            <LoginContent />
        </Suspense>
    );
}
