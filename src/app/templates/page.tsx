"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TEMPLATES } from "@/data/templates";

export default function TemplatesPage() {
    // Filter out the examples for the main grid if they exist, 
    // but the latest TEMPLATES array only has the 6 core ones.
    const coreTemplates = TEMPLATES.filter(t => t.category !== 'example');
    const exampleTemplates = TEMPLATES.filter(t => t.category === 'example');

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Header */}
                <header className="max-w-4xl mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Free Resume Templates
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Choose an ATS-ready design that matches your career goals.
                        Modern, professional, and completely free to download.
                    </p>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Templates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 mb-32">
                        {coreTemplates.map((template, idx) => (
                            <TemplateCard key={`${template.id}-${idx}`} template={template} />
                        ))}
                    </div>

                    {/* Role-based Examples Section (Optional, keeping as supplementary) */}
                    {exampleTemplates.length > 0 && (
                        <section id="examples" className="pt-24 border-t border-slate-200">
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    Resume Examples by Role
                                </h2>
                                <p className="text-slate-600 max-w-3xl leading-relaxed text-lg">
                                    Not sure where to start? Browse our role-specific samples for inspiration.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                {exampleTemplates.map((template, idx) => (
                                    <TemplateCard key={`ex-${template.id}-${idx}`} template={template} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Bottom CTA */}
                <section className="mt-40 py-24 bg-slate-900 overflow-hidden relative rounded-3xl mx-4 sm:mx-8 lg:mx-auto max-w-7xl">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>

                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
                            Stop waiting. Start interviewing.
                        </h2>
                        <div className="space-y-8">
                            <Link
                                href="/editor"
                                className="inline-block bg-emerald-500 text-slate-900 text-lg px-14 py-5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30"
                            >
                                Open Resume Builder
                            </Link>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span>Free forever</span>
                                <span className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>No Credit Card Required</span>
                                <span className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>ATS Verified</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

// Subcomponent Link for local use if needed, but we use next/link
import Link from "next/link";
