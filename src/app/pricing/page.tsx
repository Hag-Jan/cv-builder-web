"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingTable } from "@/components/landing/PricingTable";

const faqItems = [
    {
        question: "How does the billing work?",
        answer: "We offer both monthly and annual billing options. Annual plans are billed once per year and offer up to 42% savings compared to monthly plans."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. You will continue to have access to your plan features until the end of your current billing period."
    },
    {
        question: "Is my data safe if I downgrade?",
        answer: "Absolutely. Even if you downgrade to the Free plan, your resumes are saved. You'll just be limited to the features of the Free plan for future edits and downloads."
    }
];

export default function PricingPage() {
    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Header Section */}
                <header className="max-w-4xl mx-auto px-4 text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Simple pricing for serious job seekers
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
                        Start free, upgrade only if ResumeATS helps you get more callbacks.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href="/editor"
                            className="bg-emerald-500 text-white px-10 py-5 rounded-lg text-lg font-black shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Create My ATS Resume Free
                        </Link>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            No credit card required to start
                        </p>
                    </div>
                </header>

                {/* Pricing Table (Includes card grid and comparison) */}
                <PricingTable />

                {/* Performance & FAQ Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-48 py-24 bg-white/50 border-t border-slate-100">
                    <div className="grid lg:grid-cols-2 gap-24 items-start">
                        {/* Left: Performance Metric */}
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                Performance Data
                            </span>
                            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
                                Pro users get 2x more callbacks.
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed mb-12">
                                By using our advanced keyword matching and multi-versioning tools,
                                Pro members land interviews significantly faster than applicants using generic templates.
                            </p>
                        </div>

                        {/* Right: FAQ Accordion */}
                        <div>
                            <h3 className="text-lg font-black text-slate-900 mb-10 uppercase tracking-widest">Common Questions</h3>
                            <div className="space-y-4">
                                {faqItems.map((item) => (
                                    <details key={item.question} className="group border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                            <span className="text-sm font-bold text-slate-900">{item.question}</span>
                                            <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                                                expand_more
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                                            {item.answer}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <section className="mt-40 py-24 bg-slate-900 overflow-hidden relative rounded-3xl mx-4 sm:mx-8 lg:mx-auto max-w-7xl">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl"></div>

                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tight leading-tight">
                            Try ResumeATS free. Upgrade only if it helps.
                        </h2>
                        <div className="space-y-8">
                            <Link
                                href="/editor"
                                className="inline-block bg-emerald-500 text-white text-lg px-14 py-5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30"
                            >
                                Start For Free
                            </Link>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                                No credit card required
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
