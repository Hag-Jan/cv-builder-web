"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ThemeToggle";

export const Navbar = () => {
    const pathname = usePathname();

    const navLinks = [
        { name: "Templates", href: "/templates" },
        { name: "ATS Checker", href: "/ats-checker" },
        { name: "Cover Letter", href: "/cover-letter" },
        { name: "Pricing", href: "/pricing" },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 py-6">
                    <Link href="/" className="flex items-center gap-2 group mr-12 md:mr-16">
                        <div className="bg-emerald-600 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">R</div>
                        <span className="font-bold text-xl tracking-wide text-foreground">ResumeATS</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-10 lg:gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                className={`transition-all duration-200 text-sm font-medium whitespace-nowrap ${pathname === link.href
                                    ? "text-emerald-600"
                                    : "text-gray-600 hover:text-black"
                                    }`}
                                href={link.href}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center space-x-6 ml-auto">
                        <ThemeToggle />
                        <Link className="text-gray-600 hover:text-black transition-all duration-200 text-sm font-medium whitespace-nowrap" href="/login">Log In</Link>
                        <Link className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 hover:-translate-y-0.5" href="/editor">Get Started</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
