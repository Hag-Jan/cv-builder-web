"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PlanFeature {
    name: string;
    free: string | boolean;
    pro: string | boolean;
    career: string | boolean;
}

const comparisonFeatures: { category: string; features: PlanFeature[] }[] = [
    {
        category: "Usage",
        features: [
            { name: "Active resumes", free: "1", pro: "3", career: "Unlimited" },
            { name: "Templates", free: "3 templates", pro: "All templates", career: "All templates" },
            { name: "Resume Versions", free: "1", pro: "3", career: "10" },
        ]
    },
    {
        category: "Features",
        features: [
            { name: "ATS Score & Analysis", free: "Basic (Pass/Fail)", pro: "Full Breakdown", career: "Score + Comparison" },
            { name: "Export Formats", free: "PDF only", pro: "PDF, Word, TXT", career: "PDF, Word, TXT" },
            { name: "Cover Letter", free: false, pro: "Builder", career: "AI Written" },
            { name: "Job Tracker", free: false, pro: "Basic", career: "Advanced + Reminders" },
            { name: "AI Suggestions", free: false, pro: false, career: true },
            { name: "LinkedIn Import", free: false, pro: false, career: true },
        ]
    }
];

export const PricingTable = () => {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            name: "Free",
            badge: "BEST TO START",
            price: "$0",
            description: "Build your first ATS resume.",
            features: [
                "1 active resume",
                "3 ATS templates",
                "Basic ATS score (pass/fail)",
                "PDF download only"
            ],
            buttonText: "Start free",
            href: "/editor",
            variant: "outline"
        },
        {
            name: "Pro",
            badge: "MOST POPULAR",
            price: isAnnual ? "$5" : "$9",
            interval: "/ month",
            savings: isAnnual ? "Save $48/year" : null,
            description: "Land more interviews faster.",
            features: [
                "3 active resumes",
                "All ATS templates",
                "Full ATS score breakdown",
                "PDF/Word/TXT export",
                "Cover letter builder",
                "Basic job tracker",
                "3 resume versions"
            ],
            buttonText: "Go Pro",
            href: "/login?plan=pro",
            variant: "solid",
            highlight: true
        },
        {
            name: "Career",
            badge: "BEST VALUE",
            price: isAnnual ? "$11" : "$19",
            interval: "/ month",
            savings: isAnnual ? "Save $96/year" : null,
            description: "Run your entire job search in one place.",
            features: [
                "Unlimited resumes",
                "Full ATS score + competitor comparison",
                "AI written cover letter",
                "Advanced job tracker + reminders",
                "AI keyword suggestions",
                "10 resume versions",
                "LinkedIn import"
            ],
            buttonText: "Go Career",
            href: "/login?plan=career",
            variant: "dark"
        }
    ];

    return (
        <div className="space-y-32">
            {/* Toggle and Cards */}
            <div className="flex flex-col items-center">
                {/* Toggle */}
                <div className="flex items-center gap-4 mb-16">
                    <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-12 h-6 bg-emerald-500 rounded-full transition-colors focus:outline-none"
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isAnnual ? 'left-7' : 'left-1'}`} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Annual</span>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            save up to 42%
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${plan.highlight
                                    ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/10 scale-105 z-10"
                                    : "border-slate-100 bg-white"
                                }`}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full group-hover:bg-slate-200 transition-colors">
                                {plan.badge}
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm mb-6 h-10">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                                    {plan.interval && <span className="text-slate-400 font-bold text-sm tracking-tight">{plan.interval}</span>}
                                </div>
                                {plan.savings && (
                                    <p className="text-emerald-500 text-[10px] font-black uppercase mt-2">{plan.savings}</p>
                                )}
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-slate-600 text-[13px] font-medium leading-tight">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg leading-none mt-px">
                                            check_circle
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`w-full py-4 rounded-xl text-center font-bold transition-all active:scale-95 ${plan.variant === 'solid'
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                        : plan.variant === 'dark'
                                            ? "bg-slate-900 text-white hover:bg-slate-800"
                                            : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                                    }`}
                            >
                                {plan.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-4xl mx-auto pt-20">
                <h3 className="text-2xl font-black text-slate-900 text-center mb-16 uppercase tracking-widest">Compare plans</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-6 text-xs font-black text-slate-400 uppercase tracking-widest w-1/4">Feature</th>
                                <th className="py-6 text-xs font-black text-slate-600 uppercase tracking-widest text-center">Free</th>
                                <th className="py-6 text-xs font-black text-slate-600 uppercase tracking-widest text-center">Pro</th>
                                <th className="py-6 text-xs font-black text-slate-600 uppercase tracking-widest text-center">Career</th>
                            </tr>
                        </thead>
                        {comparisonFeatures.map((cat) => (
                            <tbody key={cat.category} className="border-b border-slate-50">
                                <tr className="bg-slate-50/50">
                                    <td colSpan={4} className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {cat.category}
                                    </td>
                                </tr>
                                {cat.features.map((f) => (
                                    <tr key={f.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                        <td className="py-5 pr-4 text-sm font-medium text-slate-600">{f.name}</td>
                                        <td className="py-5 text-center text-sm font-bold text-slate-500">
                                            {typeof f.free === 'boolean' ? (f.free ? '✓' : '—') : f.free}
                                        </td>
                                        <td className="py-5 text-center text-sm font-bold text-slate-700">
                                            {typeof f.pro === 'boolean' ? (f.pro ? '✓' : '—') : f.pro}
                                        </td>
                                        <td className={`py-5 text-center text-sm font-black ${typeof f.career === 'boolean' && f.career ? 'text-emerald-500' : 'text-slate-900'}`}>
                                            {typeof f.career === 'boolean' ? (f.career ? '✓' : '—') : f.career}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </div>
    );
};
